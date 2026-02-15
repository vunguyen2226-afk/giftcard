"use client"

import { getTemplateComponent } from "@/templates"
import { CardTemplateProps } from "@/types"

interface CardDisplayProps extends CardTemplateProps {}

export function CardDisplay(props: CardDisplayProps) {
  const TemplateComponent = getTemplateComponent(props.className || "traditional")

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-8">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <TemplateComponent {...props} />
        </div>
      </div>
    </div>
  )
}
