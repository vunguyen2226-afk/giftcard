import { auth } from "../../../../auth"
import { prisma } from "@/lib/prisma"
import { DashboardClient } from "./dashboard-client"

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user?.id) {
    return null
  }

  // Fetch user's cards with recipients
  const cards = await prisma.card.findMany({
    where: { userId: session.user.id },
    include: {
      recipients: {
        select: {
          id: true,
          personalSlug: true,
          viewCount: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  // Serialize dates
  const serializedCards = cards.map((card) => ({
    id: card.id,
    templateId: card.templateId,
    senderName: card.senderName,
    message: card.message,
    primaryColor: card.primaryColor,
    createdAt: card.createdAt.toISOString(),
    recipients: card.recipients,
  }))

  // Calculate stats
  const totalCards = cards.length
  const totalRecipients = cards.reduce((sum, card) => sum + card.recipients.length, 0)
  const totalViews = cards.reduce(
    (sum, card) => sum + card.recipients.reduce((s, r) => s + r.viewCount, 0),
    0
  )

  return (
    <DashboardClient
      cards={serializedCards}
      userName={session.user.name?.split(" ")[0] || "there"}
      stats={{
        totalCards,
        totalRecipients,
        totalViews,
      }}
    />
  )
}
