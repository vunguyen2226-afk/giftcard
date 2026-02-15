import { auth } from "../../../../../../auth"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

type RouteContext = {
  params: Promise<{ id: string }>
}

// GET: Card stats with recipient view details
export async function GET(request: Request, context: RouteContext) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await context.params

  // Verify card ownership and fetch with recipients
  const card = await prisma.card.findUnique({
    where: { id },
    include: {
      recipients: {
        orderBy: { createdAt: "desc" },
      },
    },
  })

  if (!card) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 })
  }

  if (card.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  // Calculate total views
  const totalViews = card.recipients.reduce((sum, r) => sum + r.viewCount, 0)

  return NextResponse.json({
    card: {
      id: card.id,
      templateId: card.templateId,
      senderName: card.senderName,
      message: card.message,
      createdAt: card.createdAt.toISOString(),
    },
    totalViews,
    recipients: card.recipients.map((r) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      personalSlug: r.personalSlug,
      viewCount: r.viewCount,
      firstViewedAt: r.firstViewedAt?.toISOString() || null,
    })),
  })
}
