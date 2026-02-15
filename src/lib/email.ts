import { Resend } from "resend"
import { CardNotification } from "@/emails/card-notification"

// Resend client configuration
// Use placeholder key during build if not available
export const resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder_key_for_build")

export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "cards@yourdomain.com"

/**
 * Send a card notification email to a recipient
 */
export async function sendCardEmail(
  to: string,
  recipientName: string,
  senderName: string,
  cardUrl: string,
  message: string
) {
  // Check if API key is configured
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "re_placeholder_key_for_build") {
    console.error("Resend API key not configured")
    return { success: false, error: "Email service not configured" }
  }

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `${senderName} sent you a New Year card!`,
      react: CardNotification({
        recipientName,
        senderName,
        cardUrl,
        message,
      }),
    })

    return { success: true, id: result.data?.id }
  } catch (error) {
    console.error("Failed to send email:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}
