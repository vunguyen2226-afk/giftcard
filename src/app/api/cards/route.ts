import { auth } from "../../../../auth"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { nanoid } from "nanoid"
import { validateCardInput, sanitizeText } from "@/lib/validation"

// GET: List user's cards with recipients
export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const cards = await prisma.card.findMany({
      where: { userId: session.user.id },
      include: { recipients: true },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ cards })
  } catch (error) {
    console.error("Error fetching cards:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST: Create new card + recipients
export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // Validate input (includes enum validation for templateId, fontFamily, primaryColor, effect)
    const validation = validateCardInput(body)
    if (!validation.valid) {
      return NextResponse.json(
        { error: "Validation failed", errors: validation.errors },
        { status: 400 }
      )
    }

    const {
      templateId,
      senderName,
      message,
      fontFamily,
      primaryColor,
      effect,
      imageUrl,
      backgroundMusic,
      recipients,
    } = body

    // Sanitize text inputs
    const sanitizedSenderName = sanitizeText(senderName, 100)
    const sanitizedMessage = sanitizeText(message, 500)

    // Generate card slug
    const cardSlug = nanoid(10)

    // Generate personal slugs for recipients
    const recipientsData = recipients.map((r: { name: string; email?: string }) => ({
      name: sanitizeText(r.name, 100),
      email: r.email?.trim() || null,
      personalSlug: nanoid(10),
    }))

    // Create card with recipients
    const card = await prisma.card.create({
      data: {
        slug: cardSlug,
        templateId,
        senderName: sanitizedSenderName,
        message: sanitizedMessage,
        fontFamily: fontFamily || "sans-serif",
        primaryColor: primaryColor || "#e11d48",
        effect: effect || "confetti",
        imageUrl: imageUrl || null,
        backgroundMusic: backgroundMusic || null,
        userId: session.user.id,
        recipients: {
          create: recipientsData,
        },
      },
      include: {
        recipients: true,
      },
    })

    return NextResponse.json({ card })
  } catch (error) {
    console.error("Error creating card:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
