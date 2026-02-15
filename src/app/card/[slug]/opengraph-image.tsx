import { ImageResponse } from "next/og"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function OGImage({ params }: PageProps) {
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
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #fef2f2 0%, #fef3c7 100%)",
            fontSize: 60,
            fontWeight: "bold",
            color: "#991b1b"
          }}
        >
          Card Not Found
        </div>
      ),
      { ...size }
    )
  }

  const senderName = recipient.card.senderName || recipient.card.user.name || "Someone"
  const message = recipient.card.message.slice(0, 200)

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(135deg, ${recipient.card.primaryColor}22 0%, #fef3c7 100%)`,
          padding: "60px"
        }}
      >
        {/* Main Card Container */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "white",
            borderRadius: "24px",
            padding: "48px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            width: "900px",
            border: `4px solid ${recipient.card.primaryColor}`
          }}
        >
          {/* Emoji/Icon */}
          <div style={{ fontSize: 80, marginBottom: 20 }}>
            🎉
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: 48,
              fontWeight: "bold",
              color: recipient.card.primaryColor,
              marginBottom: 16,
              textAlign: "center"
            }}
          >
            New Year Card for {recipient.name}
          </div>

          {/* From */}
          <div
            style={{
              fontSize: 28,
              color: "#6b7280",
              marginBottom: 24
            }}
          >
            From: {senderName}
          </div>

          {/* Message Preview */}
          <div
            style={{
              fontSize: 24,
              color: "#374151",
              textAlign: "center",
              maxWidth: "700px",
              lineHeight: 1.4,
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical"
            }}
          >
            {message}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: 32,
            fontSize: 20,
            color: "#6b7280"
          }}
        >
          Click to view your personalized card
        </div>
      </div>
    ),
    { ...size }
  )
}
