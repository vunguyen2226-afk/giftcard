export interface ColorPreset {
  id: string
  name: string
  hex: string
  description: string
}

export const COLOR_PRESETS: ColorPreset[] = [
  {
    id: "rose",
    name: "Rose",
    hex: "#f43f5e",
    description: "Vibrant rose pink for romantic and warm greetings",
  },
  {
    id: "red",
    name: "Red",
    hex: "#dc2626",
    description: "Traditional red for Lunar New Year and festive occasions",
  },
  {
    id: "amber",
    name: "Amber",
    hex: "#f59e0b",
    description: "Golden amber for prosperity and celebration",
  },
  {
    id: "emerald",
    name: "Emerald",
    hex: "#10b981",
    description: "Fresh emerald green for growth and renewal",
  },
  {
    id: "sky",
    name: "Sky",
    hex: "#0ea5e9",
    description: "Bright sky blue for optimism and new beginnings",
  },
  {
    id: "violet",
    name: "Violet",
    hex: "#7c3aed",
    description: "Rich violet for elegance and creativity",
  },
  {
    id: "pink",
    name: "Pink",
    hex: "#ec4899",
    description: "Playful pink for joy and friendliness",
  },
  {
    id: "neutral",
    name: "Neutral",
    hex: "#171717",
    description: "Sophisticated neutral for minimalist designs",
  },
  {
    id: "gold",
    name: "Gold",
    hex: "#ca8a04",
    description: "Luxurious gold for premium and formal greetings",
  },
  {
    id: "indigo",
    name: "Indigo",
    hex: "#4f46e5",
    description: "Deep indigo for trust and sophistication",
  },
]

export function getColorPresetById(id: string): ColorPreset | undefined {
  return COLOR_PRESETS.find((c) => c.id === id)
}

export function getColorPresetByHex(hex: string): ColorPreset | undefined {
  return COLOR_PRESETS.find((c) => c.hex.toLowerCase() === hex.toLowerCase())
}

export function getDefaultColorPreset(): ColorPreset {
  return COLOR_PRESETS[1] // Red as default
}
