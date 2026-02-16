"use client"

import { CardTemplateProps } from "@/types"
import { getBackgroundPresetById } from "@/lib/background-presets"

export function ElegantTemplate({
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
      className={`relative overflow-hidden rounded-2xl ${className}`}
      style={{
        background: bgPreset
          ? bgPreset.css
          : `linear-gradient(135deg, ${primaryColor}22 0%, ${primaryColor}11 100%)`,
        fontFamily: fontMap[fontFamily],
      }}
    >
      {/* Subtle texture background pattern */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, ${primaryColor}22 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Ornate decorative corner borders */}
      <svg
        className="absolute top-0 left-0 w-32 h-32 opacity-40"
        viewBox="0 0 100 100"
        style={{ fill: primaryColor }}
      >
        <path d="M 0 0 L 100 0 L 100 10 Q 50 10 10 10 L 10 100 L 0 100 Z" />
        <path d="M 5 5 L 95 5 Q 15 5 15 15 L 15 95 L 5 95 Z" opacity="0.5" />
      </svg>
      <svg
        className="absolute top-0 right-0 w-32 h-32 opacity-40 rotate-90"
        viewBox="0 0 100 100"
        style={{ fill: primaryColor }}
      >
        <path d="M 0 0 L 100 0 L 100 10 Q 50 10 10 10 L 10 100 L 0 100 Z" />
        <path d="M 5 5 L 95 5 Q 15 5 15 15 L 15 95 L 5 95 Z" opacity="0.5" />
      </svg>
      <svg
        className="absolute bottom-0 left-0 w-32 h-32 opacity-40 -rotate-90"
        viewBox="0 0 100 100"
        style={{ fill: primaryColor }}
      >
        <path d="M 0 0 L 100 0 L 100 10 Q 50 10 10 10 L 10 100 L 0 100 Z" />
        <path d="M 5 5 L 95 5 Q 15 5 15 15 L 15 95 L 5 95 Z" opacity="0.5" />
      </svg>
      <svg
        className="absolute bottom-0 right-0 w-32 h-32 opacity-40 rotate-180"
        viewBox="0 0 100 100"
        style={{ fill: primaryColor }}
      >
        <path d="M 0 0 L 100 0 L 100 10 Q 50 10 10 10 L 10 100 L 0 100 Z" />
        <path d="M 5 5 L 95 5 Q 15 5 15 15 L 15 95 L 5 95 Z" opacity="0.5" />
      </svg>

      {/* Ornate border frame */}
      <div
        className="absolute inset-8 border-2 rounded-lg opacity-30"
        style={{ borderColor: primaryColor }}
      />
      <div
        className="absolute inset-12 border rounded-md opacity-20"
        style={{ borderColor: primaryColor }}
      />

      {/* Main content in formal letter layout */}
      <div className="relative z-10 flex flex-col justify-center min-h-[500px] p-16">
        <div className="max-w-2xl mx-auto">
          {/* Formal greeting */}
          <div className="mb-12">
            <div
              className="text-2xl font-serif italic"
              style={{ color: primaryColor }}
            >
              Dear {recipientName},
            </div>
          </div>

          {/* Decorative divider */}
          <div className="flex items-center gap-3 mb-8">
            <div
              className="w-12 h-px"
              style={{ backgroundColor: primaryColor }}
            />
            <div
              className="w-3 h-3 rounded-full border-2"
              style={{ borderColor: primaryColor }}
            />
            <div
              className="flex-1 h-px"
              style={{ backgroundColor: primaryColor }}
            />
          </div>

          {/* Photo in elegant frame if provided */}
          {imageUrl && (
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div
                  className="w-56 h-56 rounded-lg overflow-hidden shadow-2xl border-4"
                  style={{ borderColor: primaryColor }}
                >
                  <img
                    src={imageUrl}
                    alt="Card image"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Elegant corner accents */}
                <div
                  className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2"
                  style={{ borderColor: primaryColor }}
                />
                <div
                  className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2"
                  style={{ borderColor: primaryColor }}
                />
                <div
                  className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2"
                  style={{ borderColor: primaryColor }}
                />
                <div
                  className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2"
                  style={{ borderColor: primaryColor }}
                />
              </div>
            </div>
          )}

          {/* Message body in formal paragraph style */}
          <div className="mb-12">
            <p
              className="text-xl leading-loose text-justify whitespace-pre-wrap"
              style={{ color: primaryColor, opacity: 0.9 }}
            >
              {message}
            </p>
          </div>

          {/* Decorative divider */}
          <div className="flex items-center gap-3 mb-8">
            <div
              className="flex-1 h-px"
              style={{ backgroundColor: primaryColor }}
            />
            <div
              className="w-3 h-3 rounded-full border-2"
              style={{ borderColor: primaryColor }}
            />
            <div
              className="w-12 h-px"
              style={{ backgroundColor: primaryColor }}
            />
          </div>

          {/* Formal closing and signature */}
          <div className="text-right">
            <div
              className="text-lg font-serif mb-2"
              style={{ color: primaryColor, opacity: 0.7 }}
            >
              With warmest regards,
            </div>
            <div
              className="text-3xl font-serif italic"
              style={{ color: primaryColor }}
            >
              {senderName}
            </div>
          </div>
        </div>
      </div>

      {/* Ornate center decorations */}
      <div className="absolute top-1/2 left-8 -translate-y-1/2 opacity-20">
        <svg width="24" height="100" viewBox="0 0 24 100">
          <path
            d="M 12 0 Q 6 25 12 50 Q 18 75 12 100"
            stroke={primaryColor}
            strokeWidth="2"
            fill="none"
          />
          <circle cx="12" cy="25" r="3" fill={primaryColor} />
          <circle cx="12" cy="50" r="4" fill={primaryColor} />
          <circle cx="12" cy="75" r="3" fill={primaryColor} />
        </svg>
      </div>
      <div className="absolute top-1/2 right-8 -translate-y-1/2 opacity-20">
        <svg width="24" height="100" viewBox="0 0 24 100">
          <path
            d="M 12 0 Q 18 25 12 50 Q 6 75 12 100"
            stroke={primaryColor}
            strokeWidth="2"
            fill="none"
          />
          <circle cx="12" cy="25" r="3" fill={primaryColor} />
          <circle cx="12" cy="50" r="4" fill={primaryColor} />
          <circle cx="12" cy="75" r="3" fill={primaryColor} />
        </svg>
      </div>
    </div>
  )
}
