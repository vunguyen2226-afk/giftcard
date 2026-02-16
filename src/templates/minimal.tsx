"use client"

import { CardTemplateProps } from "@/types"
import { getBackgroundPresetById } from "@/lib/background-presets"

export function MinimalTemplate({
  senderName,
  recipientName,
  message,
  fontFamily,
  primaryColor,
  imageUrl,
  backgroundPresetId,
  className = "",
}: CardTemplateProps) {
  const fontMap: Record<string, string> = {
    "sans-serif": "ui-sans-serif, system-ui, sans-serif",
    serif: "ui-serif, Georgia, serif",
    cursive: "'Dancing Script', 'Brush Script MT', cursive",
    monospace: "ui-monospace, monospace",
    handwriting: "'Kalam', 'Comic Sans MS', cursive",
  }

  const bgPreset = backgroundPresetId ? getBackgroundPresetById(backgroundPresetId) : undefined

  return (
    <div
      className={`relative overflow-hidden rounded-2xl ${!bgPreset ? "bg-neutral-50" : ""} ${className}`}
      style={{
        fontFamily: fontMap[fontFamily],
        ...(bgPreset ? { background: bgPreset.css } : {}),
      }}
    >
      {/* Main content with maximum whitespace */}
      <div className="flex flex-col items-center justify-center min-h-[500px] p-16">
        {/* Small tasteful image thumbnail if provided */}
        {imageUrl && (
          <div className="mb-12">
            <div className="w-24 h-24 rounded-full overflow-hidden shadow-sm border border-neutral-200">
              <img
                src={imageUrl}
                alt="Card image"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Small understated recipient name */}
        <div className="mb-16 text-center">
          <div className="text-sm font-medium tracking-widest uppercase text-neutral-400 mb-2">
            For
          </div>
          <div className="text-2xl font-light text-neutral-700">
            {recipientName}
          </div>
        </div>

        {/* Single accent line */}
        <div className="mb-16">
          <div
            className="w-16 h-px"
            style={{ backgroundColor: primaryColor }}
          />
        </div>

        {/* Message as focal point - large and centered */}
        <div className="mb-16 max-w-2xl">
          <p className="text-center text-3xl font-light leading-relaxed text-neutral-800 whitespace-pre-wrap">
            {message}
          </p>
        </div>

        {/* Small accent dot */}
        <div className="mb-16">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: primaryColor }}
          />
        </div>

        {/* Small understated sender name */}
        <div className="text-center">
          <div className="text-sm font-medium tracking-widest uppercase text-neutral-400 mb-2">
            From
          </div>
          <div
            className="text-xl font-normal"
            style={{ color: primaryColor }}
          >
            {senderName}
          </div>
        </div>
      </div>

      {/* Subtle corner accent - single thin line */}
      <div
        className="absolute top-8 right-8 w-12 h-12 border-t border-r opacity-20"
        style={{ borderColor: primaryColor }}
      />
      <div
        className="absolute bottom-8 left-8 w-12 h-12 border-b border-l opacity-20"
        style={{ borderColor: primaryColor }}
      />
    </div>
  )
}
