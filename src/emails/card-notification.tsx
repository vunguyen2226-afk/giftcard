import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Img,
  Hr,
} from "@react-email/components"

interface CardNotificationProps {
  recipientName: string
  senderName: string
  cardUrl: string
  message: string
}

export function CardNotification({
  recipientName,
  senderName,
  cardUrl,
  message,
}: CardNotificationProps) {
  const messagePreview = message.length > 150 ? message.slice(0, 150) + "..." : message

  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={box}>
            {/* Header */}
            <div style={header}>
              <Text style={heading}>🎉 You received a New Year card!</Text>
            </div>

            {/* Content */}
            <Text style={greeting}>Dear {recipientName},</Text>

            <Text style={paragraph}>
              <strong>{senderName}</strong> sent you a beautiful greeting card to celebrate the New Year.
            </Text>

            <div style={messageBox}>
              <Text style={messageText}>
                &ldquo;{messagePreview}&rdquo;
              </Text>
            </div>

            {/* CTA Button */}
            <Section style={buttonContainer}>
              <Button href={cardUrl} style={button}>
                🎊 View Your Card
              </Button>
            </Section>

            <Hr style={hr} />

            {/* Footer */}
            <Text style={footer}>
              This card was sent from New Year Greeting Cards. If you received this by mistake,
              you can safely ignore it.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
const main = {
  backgroundColor: "#f9fafb",
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
}

const container = {
  maxWidth: "560px",
  margin: "0 auto",
  padding: "20px",
}

const box = {
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  padding: "32px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
}

const header = {
  textAlign: "center" as const,
  marginBottom: "24px",
}

const heading = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#111827",
  margin: "0",
}

const greeting = {
  fontSize: "16px",
  color: "#374151",
  marginTop: "0",
  marginBottom: "16px",
}

const paragraph = {
  fontSize: "16px",
  color: "#374151",
  lineHeight: "24px",
  margin: "0 0 16px 0",
}

const messageBox = {
  backgroundColor: "#fef2f2",
  border: "2px solid #fecaca",
  borderRadius: "8px",
  padding: "16px",
  marginBottom: "24px",
}

const messageText = {
  fontSize: "15px",
  color: "#991b1b",
  fontStyle: "italic",
  lineHeight: "22px",
  margin: "0",
}

const buttonContainer = {
  textAlign: "center" as const,
  marginBottom: "24px",
}

const button = {
  backgroundColor: "#e11d48",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "14px 32px",
  borderRadius: "8px",
}

const hr = {
  border: "none",
  borderTop: "1px solid #e5e7eb",
  margin: "24px 0",
}

const footer = {
  fontSize: "13px",
  color: "#6b7280",
  lineHeight: "20px",
  margin: "0",
}

export default CardNotification
