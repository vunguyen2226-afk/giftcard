"use client"

import { CardTemplateProps } from "@/types"
import { getBackgroundPresetById } from "@/lib/background-presets"

export function ModernTemplate({
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
      className={`relative overflow-hidden rounded-2xl min-h-[500px] ${className}`}
      style={{
        background: bgPreset
          ? bgPreset.css
          : `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 50%, ${primaryColor}99 100%)`,
        fontFamily: fontMap[fontFamily],
      }}
    >
      {/* Background image with overlay if provided */}
      {imageUrl && (
        <div className="absolute inset-0">
          <img
            src={imageUrl}
            alt="Background"
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${primaryColor}dd 0%, ${primaryColor}bb 100%)`,
            }}
          />
        </div>
      )}

      {/* Geometric decorative elements */}
      <div className="absolute top-10 right-10 w-32 h-32 rounded-full border-4 border-white/20 opacity-60" />
      <div className="absolute top-20 right-24 w-20 h-20 rounded-full border-4 border-white/10 opacity-40" />
      <div className="absolute bottom-10 left-10 w-40 h-40 rounded-full border-4 border-white/15 opacity-50" />
      <div className="absolute bottom-32 left-20 w-16 h-16 rounded-full bg-white/10 opacity-60" />

      {/* Glassmorphism card overlay */}
      <div className="relative z-10 flex items-center justify-center min-h-[500px] p-8">
        <div className="max-w-2xl w-full bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/20">
          {/* Large year number */}
          <div className="absolute -top-8 -right-8 text-[200px] font-black text-white/5 leading-none select-none">
            2026
          </div>

          {/* Recipient name at top */}
          <div className="mb-8 text-center">
            <div className="text-sm font-medium tracking-widest text-white/70 uppercase mb-2">
              To
            </div>
            <div className="text-4xl font-bold text-white">{recipientName}</div>
          </div>

          {/* Decorative line */}
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-1 bg-white/30 rounded-full" />
          </div>

          {/* Message in center */}
          <div className="mb-8">
            <p className="text-center text-xl leading-relaxed text-white whitespace-pre-wrap">
              {message}
            </p>
          </div>

          {/* Decorative line */}
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-1 bg-white/30 rounded-full" />
          </div>

          {/* Sender name at bottom-right */}
          <div className="text-right">
            <div className="text-sm font-medium tracking-widest text-white/70 uppercase mb-1">
              From
            </div>
            <div className="text-2xl font-semibold text-white">{senderName}</div>
          </div>

          {/* Additional geometric accent */}
          <div className="absolute -bottom-4 -left-4 w-24 h-24 border-l-4 border-b-4 border-white/20 rounded-bl-3xl" />
        </div>
      </div>

      {/* Geometric lines decoration */}
      <svg
        className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line x1="0" y1="100" x2="300" y2="0" stroke="white" strokeWidth="2" />
        <line x1="100%" y1="0" x2="80%" y2="100%" stroke="white" strokeWidth="2" />
        <circle cx="20%" cy="80%" r="100" fill="none" stroke="white" strokeWidth="2" />
      </svg>
    </div>
  )
}
