import { auth } from "../../../../../../auth"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { nanoid } from "nanoid"
import { sanitizeText, isValidEmail } from "@/lib/validation"

type RouteContext = {
  params: Promise<{ id: string }>
}

// POST: Add recipients to existing card
export async function POST(request: Request, context: RouteContext) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await context.params
    const body = await request.json()

    // Verify card ownership
    const existingCard = await prisma.card.findUnique({
      where: { id },
      select: { userId: true },
    })

    if (!existingCard) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 })
    }

    if (existingCard.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Validate recipients
    const { recipients } = body
    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json(
        { error: "At least one recipient is required" },
        { status: 400 }
      )
    }

    // Validate each recipient
    const errors: string[] = []
    recipients.forEach((r: { name?: string; email?: string }, i) => {
      if (!r.name?.trim()) {
        errors.push(`Recipient ${i + 1}: Name is required`)
      } else if (r.name.length > 100) {
        errors.push(`Recipient ${i + 1}: Name exceeds 100 characters`)
      }

      if (r.email && !isValidEmail(r.email)) {
        errors.push(`Recipient ${i + 1}: Invalid email address`)
      }
    })

    if (errors.length > 0) {
      return NextResponse.json(
        { error: "Validation failed", errors },
        { status: 400 }
      )
    }

    // Validate max recipients (check total)
    const currentCount = await prisma.recipient.count({
      where: { cardId: id },
    })

    if (currentCount + recipients.length > 50) {
      return NextResponse.json(
        { error: `Maximum 50 recipients allowed per card. Current: ${currentCount}` },
        { status: 400 }
      )
    }

    // Generate personal slugs for new recipients
    const recipientsData = recipients.map((r: { name: string; email?: string }) => ({
      name: sanitizeText(r.name, 100),
      email: r.email?.trim() || null,
      personalSlug: nanoid(10),
      cardId: id,
    }))

    // Create recipients
    await prisma.recipient.createMany({
      data: recipientsData,
    })

    // Fetch and return all recipients
    const allRecipients = await prisma.recipient.findMany({
      where: { cardId: id },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ recipients: allRecipients })
  } catch (error) {
    console.error("Error adding recipients:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
