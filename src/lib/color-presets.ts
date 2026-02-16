export type ColorCategory = "tet" | "warm" | "cool" | "neutral"

export interface ColorPreset {
  id: string
  name: string
  hex: string
  description: string
  category: ColorCategory
}

export const COLOR_PRESETS: ColorPreset[] = [
  // Tet-themed colors
  {
    id: "red",
    name: "Red",
    hex: "#dc2626",
    description: "Traditional red for Lunar New Year and festive occasions",
    category: "tet",
  },
  {
    id: "crimson",
    name: "Crimson",
    hex: "#be123c",
    description: "Deep crimson for elegant Tet greetings",
    category: "tet",
  },
  {
    id: "vermillion",
    name: "Vermillion",
    hex: "#e63946",
    description: "Vivid vermillion red for bold festive designs",
    category: "tet",
  },
  {
    id: "burgundy",
    name: "Burgundy",
    hex: "#881337",
    description: "Rich burgundy for refined Tet celebrations",
    category: "tet",
  },
  {
    id: "gold",
    name: "Gold",
    hex: "#ca8a04",
    description: "Luxurious gold for premium and formal greetings",
    category: "tet",
  },
  {
    id: "imperial-gold",
    name: "Imperial Gold",
    hex: "#b8860b",
    description: "Regal imperial gold for distinguished Tet cards",
    category: "tet",
  },
  {
    id: "amber",
    name: "Amber",
    hex: "#f59e0b",
    description: "Golden amber for prosperity and celebration",
    category: "tet",
  },
  // Warm colors
  {
    id: "rose",
    name: "Rose",
    hex: "#f43f5e",
    description: "Vibrant rose pink for romantic and warm greetings",
    category: "warm",
  },
  {
    id: "pink",
    name: "Pink",
    hex: "#ec4899",
    description: "Playful pink for joy and friendliness",
    category: "warm",
  },
  {
    id: "peach",
    name: "Peach",
    hex: "#f9a8d4",
    description: "Soft peach blossom for gentle spring vibes",
    category: "warm",
  },
  {
    id: "apricot",
    name: "Apricot Blossom",
    hex: "#fb923c",
    description: "Warm apricot blossom symbolizing Tet arrival",
    category: "warm",
  },
  {
    id: "coral",
    name: "Coral",
    hex: "#f97316",
    description: "Energetic coral for vibrant celebrations",
    category: "warm",
  },
  // Cool colors
  {
    id: "emerald",
    name: "Emerald",
    hex: "#10b981",
    description: "Fresh emerald green for growth and renewal",
    category: "cool",
  },
  {
    id: "teal",
    name: "Teal",
    hex: "#14b8a6",
    description: "Calm teal for balanced and fresh designs",
    category: "cool",
  },
  {
    id: "sky",
    name: "Sky",
    hex: "#0ea5e9",
    description: "Bright sky blue for optimism and new beginnings",
    category: "cool",
  },
  {
    id: "cyan",
    name: "Cyan",
    hex: "#06b6d4",
    description: "Vivid cyan for modern and refreshing cards",
    category: "cool",
  },
  {
    id: "violet",
    name: "Violet",
    hex: "#7c3aed",
    description: "Rich violet for elegance and creativity",
    category: "cool",
  },
  {
    id: "indigo",
    name: "Indigo",
    hex: "#4f46e5",
    description: "Deep indigo for trust and sophistication",
    category: "cool",
  },
  // Neutral colors
  {
    id: "neutral",
    name: "Neutral",
    hex: "#171717",
    description: "Sophisticated neutral for minimalist designs",
    category: "neutral",
  },
  {
    id: "slate",
    name: "Slate",
    hex: "#475569",
    description: "Subtle slate for understated elegance",
    category: "neutral",
  },
]

export const COLOR_CATEGORIES: ColorCategory[] = ["tet", "warm", "cool", "neutral"]

export function getColorPresetById(id: string): ColorPreset | undefined {
  return COLOR_PRESETS.find((c) => c.id === id)
}

export function getColorPresetByHex(hex: string): ColorPreset | undefined {
  return COLOR_PRESETS.find((c) => c.hex.toLowerCase() === hex.toLowerCase())
}

export function getDefaultColorPreset(): ColorPreset {
  return COLOR_PRESETS[0] // Red as default
}

export function getColorsByCategory(category: ColorCategory): ColorPreset[] {
  return COLOR_PRESETS.filter((c) => c.category === category)
}
