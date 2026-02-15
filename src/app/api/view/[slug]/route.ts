import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { rateLimit, createCardViewKey, getClientIp } from "@/lib/rate-limit"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    // Rate limiting: 30 requests per minute per IP per slug
    const clientIp = getClientIp(request)
    const viewKey = createCardViewKey(slug, clientIp)
    const rateLimitResult = rateLimit(viewKey, 30, 60 * 1000) // 1 minute

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded. Please try again later.",
          resetAt: rateLimitResult.resetAt
        },
        { status: 429 }
      )
    }

    const recipient = await prisma.recipient.findUnique({
      where: { personalSlug: slug },
      include: {
        card: {
          include: {
            user: {
              select: { name: true, image: true }
            }
          }
        }
      }
    })

    if (!recipient) {
      return NextResponse.json(
        { error: "Card not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      card: recipient.card,
      recipient: {
        id: recipient.id,
        name: recipient.name,
        personalSlug: recipient.personalSlug,
        viewCount: recipient.viewCount,
        firstViewedAt: recipient.firstViewedAt
      }
    })
  } catch (error) {
    console.error("Error fetching card:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
