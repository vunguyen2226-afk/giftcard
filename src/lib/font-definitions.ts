import { FontFamily } from "@/types"

export interface FontDefinition {
  id: FontFamily
  name: string
  cssFamily: string
  description: string
  googleFont?: string // Google Font name for import
}

export const FONT_DEFINITIONS: FontDefinition[] = [
  {
    id: "sans-serif",
    name: "Sans Serif",
    cssFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    description: "Clean and modern sans-serif font for contemporary designs",
  },
  {
    id: "serif",
    name: "Serif",
    cssFamily: "ui-serif, Georgia, 'Times New Roman', serif",
    description: "Classic serif font for traditional and elegant greetings",
  },
  {
    id: "cursive",
    name: "Cursive",
    cssFamily: "'Dancing Script', 'Brush Script MT', cursive",
    description: "Flowing cursive font for personal and heartfelt messages",
    googleFont: "Dancing Script",
  },
  {
    id: "monospace",
    name: "Monospace",
    cssFamily: "ui-monospace, 'Courier New', monospace",
    description: "Fixed-width font for unique and technical aesthetics",
  },
  {
    id: "handwriting",
    name: "Handwriting",
    cssFamily: "'Kalam', 'Comic Sans MS', cursive",
    description: "Casual handwriting style for friendly and informal greetings",
    googleFont: "Kalam",
  },
]

export function getFontDefinition(id: FontFamily): FontDefinition | undefined {
  return FONT_DEFINITIONS.find((f) => f.id === id)
}

export function getDefaultFont(): FontDefinition {
  return FONT_DEFINITIONS[0] // Sans-serif as default
}

export function getFontCSSFamily(id: FontFamily): string {
  const font = getFontDefinition(id)
  return font?.cssFamily || FONT_DEFINITIONS[0].cssFamily
}

// Generate Google Fonts link for fonts that require it
export function getGoogleFontsLink(): string {
  const googleFonts = FONT_DEFINITIONS
    .filter((f) => f.googleFont)
    .map((f) => f.googleFont!.replace(/ /g, "+"))
    .join("&family=")

  if (!googleFonts) return ""

  return `https://fonts.googleapis.com/css2?family=${googleFonts}&display=swap`
}
