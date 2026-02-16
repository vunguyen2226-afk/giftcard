export interface BackgroundPreset {
  id: string
  name: string
  css: string // CSS background value
  textClass: "light" | "dark" // whether text on this bg should be light or dark
}

export const BACKGROUND_PRESETS: BackgroundPreset[] = [
  {
    id: "peach-blossom",
    name: "Peach Blossom Garden",
    css: "linear-gradient(135deg, #fce7f3 0%, #fbcfe8 30%, #f9a8d4 60%, #f472b6 100%)",
    textClass: "dark",
  },
  {
    id: "golden-lanterns",
    name: "Golden Lanterns Night",
    css: "radial-gradient(ellipse at 30% 20%, rgba(251, 191, 36, 0.4) 0%, transparent 50%), radial-gradient(ellipse at 70% 30%, rgba(245, 158, 11, 0.3) 0%, transparent 50%), linear-gradient(to bottom, #1e1b4b 0%, #1e3a5f 50%, #172554 100%)",
    textClass: "light",
  },
  {
    id: "mai-flower-field",
    name: "Mai Flower Field",
    css: "linear-gradient(135deg, #fef9c3 0%, #fde68a 30%, #fbbf24 60%, #f59e0b 100%)",
    textClass: "dark",
  },
  {
    id: "lucky-red-silk",
    name: "Lucky Red Silk",
    css: "linear-gradient(135deg, #991b1b 0%, #dc2626 25%, #ef4444 50%, #dc2626 75%, #991b1b 100%)",
    textClass: "light",
  },
  {
    id: "spring-morning",
    name: "Spring Morning",
    css: "linear-gradient(135deg, #d1fae5 0%, #6ee7b7 30%, #34d399 60%, #059669 100%)",
    textClass: "dark",
  },
  {
    id: "fireworks-sky",
    name: "Fireworks Sky",
    css: "radial-gradient(circle at 20% 30%, rgba(239, 68, 68, 0.3) 0%, transparent 30%), radial-gradient(circle at 80% 20%, rgba(251, 191, 36, 0.3) 0%, transparent 30%), radial-gradient(circle at 50% 70%, rgba(168, 85, 247, 0.3) 0%, transparent 30%), radial-gradient(circle at 70% 60%, rgba(34, 211, 238, 0.2) 0%, transparent 25%), linear-gradient(to bottom, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
    textClass: "light",
  },
]

export function getBackgroundPresetById(id: string): BackgroundPreset | undefined {
  return BACKGROUND_PRESETS.find((b) => b.id === id)
}
