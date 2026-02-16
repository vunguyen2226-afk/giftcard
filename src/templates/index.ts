import { TemplateMetadata, CardTemplateProps } from "@/types"
import { TraditionalTemplate } from "./traditional"
import { ModernTemplate } from "./modern"
import { AnimatedTemplate } from "./animated"
import { MinimalTemplate } from "./minimal"
import { ElegantTemplate } from "./elegant"
import { ComponentType } from "react"

export const TEMPLATES: TemplateMetadata[] = [
  {
    id: "traditional",
    name: "Traditional",
    description: "Classic Tet/Lunar New Year theme with red and gold",
    thumbnail: "/templates/traditional-preview.png",
    defaultImage: "/templates/traditional-preview.png",
    defaultColor: "#dc2626",
    defaultFont: "serif",
    category: "traditional",
  },
  {
    id: "modern",
    name: "Modern",
    description: "Sleek gradients and glassmorphism design",
    thumbnail: "/templates/modern-preview.png",
    defaultImage: "/templates/modern-preview.png",
    defaultColor: "#7c3aed",
    defaultFont: "sans-serif",
    category: "modern",
  },
  {
    id: "animated",
    name: "Animated",
    description: "Dynamic entrance effects and glowing accents",
    thumbnail: "/templates/animated-preview.png",
    defaultImage: "/templates/animated-preview.png",
    defaultColor: "#0ea5e9",
    defaultFont: "sans-serif",
    category: "animated",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean whitespace and typography-focused",
    thumbnail: "/templates/minimal-preview.jpg",
    defaultImage: "/templates/minimal-preview.jpg",
    defaultColor: "#171717",
    defaultFont: "sans-serif",
    category: "minimal",
  },
  {
    id: "elegant",
    name: "Elegant",
    description: "Ornate borders and serif typography",
    thumbnail: "/templates/elegant-preview.png",
    defaultImage: "/templates/elegant-preview.png",
    defaultColor: "#92400e",
    defaultFont: "serif",
    category: "elegant",
  },
]

export const TEMPLATE_COMPONENTS: Record<string, ComponentType<CardTemplateProps>> = {
  traditional: TraditionalTemplate,
  modern: ModernTemplate,
  animated: AnimatedTemplate,
  minimal: MinimalTemplate,
  elegant: ElegantTemplate,
}

export function getTemplate(id: string): TemplateMetadata | undefined {
  return TEMPLATES.find((t) => t.id === id)
}

export function getTemplateComponent(id: string): ComponentType<CardTemplateProps> {
  return TEMPLATE_COMPONENTS[id] ?? TEMPLATE_COMPONENTS.traditional
}

// Re-export template components for direct imports
export { TraditionalTemplate } from "./traditional"
export { ModernTemplate } from "./modern"
export { AnimatedTemplate } from "./animated"
export { MinimalTemplate } from "./minimal"
export { ElegantTemplate } from "./elegant"
