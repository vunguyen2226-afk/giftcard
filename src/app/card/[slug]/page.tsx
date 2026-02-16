import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { CardViewerClient } from "@/components/card-viewer/card-viewer-client"
import { Metadata } from "next"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const recipient = await prisma.recipient.findUnique({
    where: { personalSlug: slug },
    include: {
      card: {
        include: {
          user: { select: { name: true } }
        }
      }
    }
  })

  if (!recipient) {
    return {
      title: "Card Not Found"
    }
  }

  const senderName = recipient.card.senderName || recipient.card.user.name || "Someone"
  const truncatedMessage = recipient.card.message.slice(0, 160)

  return {
    title: `New Year Card for ${recipient.name} from ${senderName}`,
    description: truncatedMessage,
    openGraph: {
      title: `${senderName} sent you a New Year card!`,
      description: truncatedMessage,
      type: "website",
      images: [
        {
          url: `/card/${slug}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: `New Year Card for ${recipient.name}`
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: `${senderName} sent ${recipient.name} a New Year card!`,
      description: truncatedMessage,
    }
  }
}

export default async function CardViewerPage({ params }: PageProps) {
  const { slug } = await params
  const recipient = await prisma.recipient.findUnique({
    where: { personalSlug: slug },
    include: {
      card: true
    }
  })

  if (!recipient) {
    notFound()
  }

  const cardData = {
    id: recipient.card.id,
    slug: recipient.card.slug,
    templateId: recipient.card.templateId,
    senderName: recipient.card.senderName,
    message: recipient.card.message,
    fontFamily: recipient.card.fontFamily,
    primaryColor: recipient.card.primaryColor,
    backgroundMusic: recipient.card.backgroundMusic || undefined,
    backgroundPresetId: recipient.card.backgroundPresetId || undefined,
    effect: recipient.card.effect as import("@/types").EffectType,
    imageUrl: recipient.card.imageUrl || undefined,
    createdAt: recipient.card.createdAt.toISOString()
  }

  const recipientData = {
    id: recipient.id,
    name: recipient.name,
    email: recipient.email || undefined,
    personalSlug: recipient.personalSlug,
    viewCount: recipient.viewCount,
    firstViewedAt: recipient.firstViewedAt?.toISOString()
  }

  return <CardViewerClient card={cardData} recipient={recipientData} />
}
