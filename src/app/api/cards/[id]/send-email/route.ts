import { auth } from "../../../../../../auth"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendCardEmail } from "@/lib/email"
import { rateLimit, createEmailKey } from "@/lib/rate-limit"

type RouteContext = {
  params: Promise<{ id: string }>
}

// POST: Send email notifications to recipients
export async function POST(request: Request, context: RouteContext) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Rate limiting: 5 requests per hour per user
    const emailKey = createEmailKey(session.user.id)
    const rateLimitResult = rateLimit(emailKey, 5, 60 * 60 * 1000) // 1 hour

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded. Maximum 5 email sends per hour.",
          resetAt: rateLimitResult.resetAt
        },
        { status: 429 }
      )
    }

    const { id } = await context.params
    const body = await request.json()
    const { recipientIds } = body

    // Verify card ownership and fetch card with recipients
    const card = await prisma.card.findUnique({
      where: { id },
      include: {
        recipients: true,
      },
    })

    if (!card) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 })
    }

    if (card.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Filter recipients: those with email, optionally filtered by recipientIds
    let recipientsToEmail = card.recipients.filter((r) => r.email)

    if (recipientIds && Array.isArray(recipientIds) && recipientIds.length > 0) {
      recipientsToEmail = recipientsToEmail.filter((r) => recipientIds.includes(r.id))
    }

    if (recipientsToEmail.length === 0) {
      return NextResponse.json(
        { error: "No recipients with email addresses found" },
        { status: 400 }
      )
    }

    // Check Resend rate limit warning (100/day free tier)
    if (recipientsToEmail.length > 50) {
      return NextResponse.json(
        { error: "Cannot send more than 50 emails at once. Please contact support." },
        { status: 400 }
      )
    }

    // Send emails
    const results = await Promise.allSettled(
      recipientsToEmail.map(async (recipient) => {
        const cardUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/card/${recipient.personalSlug}`

        const result = await sendCardEmail(
          recipient.email!,
          recipient.name,
          card.senderName,
          cardUrl,
          card.message
        )

        return {
          recipientId: recipient.id,
          email: recipient.email,
          success: result.success,
          error: result.error,
        }
      })
    )

    // Process results
    const sent: string[] = []
    const failed: Array<{ recipientId: string; email: string; error: string }> = []

    results.forEach((result) => {
      if (result.status === "fulfilled" && result.value.success) {
        sent.push(result.value.recipientId)
      } else if (result.status === "fulfilled" && !result.value.success) {
        failed.push({
          recipientId: result.value.recipientId,
          email: result.value.email || "",
          error: result.value.error || "Unknown error",
        })
      } else if (result.status === "rejected") {
        failed.push({
          recipientId: "",
          email: "",
          error: result.reason?.message || "Unknown error",
        })
      }
    })

    return NextResponse.json({
      sent: sent.length,
      failed: failed.length,
      errors: failed,
    })
  } catch (error) {
    console.error("Error sending emails:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
