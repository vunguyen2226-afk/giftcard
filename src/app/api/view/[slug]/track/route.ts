import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { rateLimit, createViewTrackingKey, getClientIp } from "@/lib/rate-limit"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    // Rate limiting: 10 requests per minute per IP per slug
    const clientIp = getClientIp(request)
    const trackKey = createViewTrackingKey(slug, clientIp)
    const rateLimitResult = rateLimit(trackKey, 10, 60 * 1000) // 1 minute

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded. Please try again later.",
          resetAt: rateLimitResult.resetAt
        },
        { status: 429 }
      )
    }

    // Check if firstViewedAt is already set
    const recipient = await prisma.recipient.findUnique({
      where: { personalSlug: slug },
      select: { id: true, firstViewedAt: true }
    })

    if (!recipient) {
      return NextResponse.json(
        { error: "Recipient not found" },
        { status: 404 }
      )
    }

    // Update viewCount and set firstViewedAt only if null
    await prisma.recipient.update({
      where: { personalSlug: slug },
      data: {
        viewCount: { increment: 1 },
        ...(recipient.firstViewedAt === null && {
          firstViewedAt: new Date()
        })
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error tracking view:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
