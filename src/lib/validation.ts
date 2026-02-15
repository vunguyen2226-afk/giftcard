// Input validation utilities for Gift Card app
// Lightweight validation without external dependencies

const VALID_TEMPLATE_IDS = ["traditional", "modern", "animated", "minimal", "elegant"]
const VALID_EFFECTS = ["fireworks", "snow", "cherry_blossom", "confetti"]
const VALID_FONTS = ["sans-serif", "serif", "cursive", "monospace", "handwriting"]
const HEX_COLOR_REGEX = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/

interface CardInputData {
  templateId?: string
  senderName?: string
  message?: string
  fontFamily?: string
  primaryColor?: string
  effect?: string
  recipients?: Array<{ name?: string; email?: string }>
}

interface ValidationResult {
  valid: boolean
  errors: Record<string, string>
}

/**
 * Validates card creation input
 * @param data - Card input data to validate
 * @returns Validation result with errors map
 */
export function validateCardInput(data: CardInputData): ValidationResult {
  const errors: Record<string, string> = {}

  // Required fields
  if (!data.templateId?.trim()) {
    errors.templateId = "Template is required"
  } else if (!VALID_TEMPLATE_IDS.includes(data.templateId)) {
    errors.templateId = "Invalid template"
  }

  if (!data.senderName?.trim()) {
    errors.senderName = "Sender name is required"
  } else if (data.senderName.length > 100) {
    errors.senderName = "Sender name must be under 100 characters"
  }

  if (!data.message?.trim()) {
    errors.message = "Message is required"
  } else if (data.message.length > 500) {
    errors.message = "Message must be under 500 characters"
  }

  // Enum field validation
  if (data.fontFamily && !VALID_FONTS.includes(data.fontFamily)) {
    errors.fontFamily = "Invalid font family"
  }

  if (data.primaryColor && !HEX_COLOR_REGEX.test(data.primaryColor)) {
    errors.primaryColor = "Invalid color format (must be hex, e.g. #e11d48)"
  }

  if (data.effect && !VALID_EFFECTS.includes(data.effect)) {
    errors.effect = "Invalid effect type"
  }

  // Recipients validation
  if (!data.recipients || !Array.isArray(data.recipients)) {
    errors.recipients = "Recipients must be an array"
  } else if (data.recipients.length === 0) {
    errors.recipients = "At least one recipient is required"
  } else if (data.recipients.length > 50) {
    errors.recipients = "Maximum 50 recipients allowed per card"
  } else {
    // Validate each recipient
    data.recipients.forEach((r, i) => {
      if (!r.name?.trim()) {
        errors[`recipients.${i}.name`] = "Recipient name is required"
      } else if (r.name.length > 100) {
        errors[`recipients.${i}.name`] = "Recipient name must be under 100 characters"
      }

      if (r.email && !isValidEmail(r.email)) {
        errors[`recipients.${i}.email`] = "Invalid email address"
      }
    })
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  }
}

/**
 * Validates email format using regex
 * @param email - Email string to validate
 * @returns True if valid email format
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== "string") return false

  // RFC 5322 simplified regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.trim())
}

/**
 * Sanitizes text input by trimming and limiting length
 * @param text - Text to sanitize
 * @param maxLength - Maximum length (default 500)
 * @returns Sanitized text
 */
export function sanitizeText(text: string, maxLength = 500): string {
  if (!text || typeof text !== "string") return ""
  return text.trim().slice(0, maxLength)
}

/**
 * Validates a single enum field against allowed values
 * Useful for partial update (PUT) routes
 */
export function validateEnumField(field: string, value: string): string | null {
  switch (field) {
    case "templateId":
      return VALID_TEMPLATE_IDS.includes(value) ? null : "Invalid template"
    case "effect":
      return VALID_EFFECTS.includes(value) ? null : "Invalid effect type"
    case "fontFamily":
      return VALID_FONTS.includes(value) ? null : "Invalid font family"
    case "primaryColor":
      return HEX_COLOR_REGEX.test(value) ? null : "Invalid color format"
    default:
      return null
  }
}

/**
 * Validates file upload parameters
 * @param contentType - MIME type
 * @param fileSize - File size in bytes
 * @returns Validation result
 */
export function validateFileUpload(contentType: string, fileSize?: number): ValidationResult {
  const errors: Record<string, string> = {}

  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
  if (!allowedTypes.includes(contentType)) {
    errors.contentType = "File must be JPEG, PNG, WebP, or GIF"
  }

  const maxSize = 5 * 1024 * 1024 // 5MB
  if (fileSize && fileSize > maxSize) {
    errors.fileSize = "File size must be under 5MB"
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  }
}

/**
 * Validates file extension matches content type
 * @param fileName - File name with extension
 * @param contentType - MIME type
 * @returns True if extension matches type
 */
export function validateFileExtension(fileName: string, contentType: string): boolean {
  const ext = fileName.toLowerCase().split(".").pop()

  const typeMap: Record<string, string[]> = {
    "image/jpeg": ["jpg", "jpeg"],
    "image/png": ["png"],
    "image/webp": ["webp"],
    "image/gif": ["gif"]
  }

  const validExtensions = typeMap[contentType]
  return validExtensions ? validExtensions.includes(ext || "") : false
}
