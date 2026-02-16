// Type definitions for the application

// Effect types for visual animations
export type EffectType = "fireworks" | "snow" | "cherry_blossom" | "confetti"

// Font options
export type FontFamily = "sans-serif" | "serif" | "cursive" | "monospace" | "handwriting"

// Music preset options
export interface MusicOption {
  id: string
  name: string
  url: string       // path to audio file in /public/music/
  duration: number   // seconds
}

// Template metadata for selector UI
export interface TemplateMetadata {
  id: string
  name: string
  description: string
  thumbnail: string   // path to preview image
  defaultImage?: string // default card image when template is selected
  defaultColor: string
  defaultFont: FontFamily
  category: "traditional" | "modern" | "animated" | "minimal" | "elegant"
}

// Props passed to template components
export interface CardTemplateProps {
  senderName: string
  recipientName: string
  message: string
  fontFamily: FontFamily
  primaryColor: string
  imageUrl?: string
  backgroundPresetId?: string
  className?: string
}

// Card data (mirrors Prisma model + joined recipient)
export interface CardData {
  id: string
  slug: string
  templateId: string
  senderName: string
  message: string
  fontFamily: string
  primaryColor: string
  backgroundMusic?: string
  backgroundPresetId?: string
  effect: EffectType
  imageUrl?: string
  createdAt: string
}

// Recipient data
export interface RecipientData {
  id: string
  name: string
  personalSlug: string
  viewCount: number
  firstViewedAt?: string
}

// Card + recipient for public viewer
export interface CardViewData {
  card: CardData
  recipient: RecipientData
}

// Editor state for step wizard
export interface EditorState {
  step: number
  templateId: string
  senderName: string
  recipientNames: string[]
  message: string
  fontFamily: FontFamily
  primaryColor: string
  effect: EffectType
  imageUrl?: string
  backgroundMusic?: string
  backgroundPresetId?: string
}

// API response types
export interface ApiResponse<T> {
  data?: T
  error?: string
}

export interface CardListResponse {
  cards: (CardData & { recipients: RecipientData[] })[]
}

export interface CardStatsResponse {
  totalViews: number
  recipients: RecipientData[]
}
