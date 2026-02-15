"use client"

import { CardTemplateProps } from "@/types"

export function TraditionalTemplate({
  senderName,
  recipientName,
  message,
  fontFamily,
  primaryColor,
  imageUrl,
  className = "",
}: CardTemplateProps) {
  const fontMap: Record<string, string> = {
    "sans-serif": "ui-sans-serif, system-ui, sans-serif",
    serif: "ui-serif, Georgia, serif",
    cursive: "cursive",
    monospace: "ui-monospace, monospace",
    handwriting: "cursive",
  }

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-600 via-red-700 to-red-900 p-8 ${className}`}
      style={{ fontFamily: fontMap[fontFamily] }}
    >
      {/* Decorative corner ornaments */}
      <div className="absolute top-0 left-0 w-24 h-24 opacity-30">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path
            d="M 0 0 Q 50 50 100 0 L 100 100 L 0 100 Z"
            fill="url(#gold-gradient)"
          />
          <defs>
            <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: "#fbbf24", stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: "#f59e0b", stopOpacity: 1 }} />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="absolute top-0 right-0 w-24 h-24 opacity-30 rotate-90">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path
            d="M 0 0 Q 50 50 100 0 L 100 100 L 0 100 Z"
            fill="url(#gold-gradient-2)"
          />
          <defs>
            <linearGradient id="gold-gradient-2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: "#fbbf24", stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: "#f59e0b", stopOpacity: 1 }} />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Decorative border pattern */}
      <div className="absolute inset-4 border-4 border-amber-400 rounded-xl opacity-50" />
      <div className="absolute inset-6 border-2 border-amber-300 rounded-lg opacity-30" />

      {/* Main content container */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[500px] text-white">
        {/* Header with traditional greeting */}
        <div className="mb-8 text-center">
          <div className="text-sm font-medium tracking-widest text-amber-300 mb-2">
            Chúc Mừng Năm Mới
          </div>
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
            <div className="text-4xl font-bold tracking-wide" style={{ color: primaryColor }}>
              Happy New Year
            </div>
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
          </div>
        </div>

        {/* Recipient name */}
        <div className="mb-6">
          <div className="text-2xl font-semibold text-amber-100">
            Dear {recipientName}
          </div>
        </div>

        {/* Optional image with decorative frame */}
        {imageUrl && (
          <div className="mb-8 relative">
            <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-amber-400 shadow-2xl">
              <img
                src={imageUrl}
                alt="Card image"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative corner accents on image frame */}
            <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-amber-300 rounded-tl-lg" />
            <div className="absolute -top-2 -right-2 w-8 h-8 border-t-4 border-r-4 border-amber-300 rounded-tr-lg" />
            <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-4 border-l-4 border-amber-300 rounded-bl-lg" />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-amber-300 rounded-br-lg" />
          </div>
        )}

        {/* Message with decorative dividers */}
        <div className="mb-8 max-w-lg">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-px bg-amber-400" />
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <div className="w-8 h-px bg-amber-400" />
          </div>
          <p className="text-center text-lg leading-relaxed text-white/90 whitespace-pre-wrap">
            {message}
          </p>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="w-8 h-px bg-amber-400" />
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <div className="w-8 h-px bg-amber-400" />
          </div>
        </div>

        {/* Sender name with ornamental frame */}
        <div className="mt-6 relative">
          <div className="px-6 py-2 bg-amber-400/20 rounded-lg border border-amber-400/50 backdrop-blur-sm">
            <div className="text-sm text-amber-200 mb-1">With warm wishes,</div>
            <div className="text-xl font-semibold text-amber-100">{senderName}</div>
          </div>
        </div>
      </div>

      {/* Bottom decorative elements */}
      <div className="absolute bottom-0 left-0 w-24 h-24 opacity-30 rotate-180">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path
            d="M 0 0 Q 50 50 100 0 L 100 100 L 0 100 Z"
            fill="url(#gold-gradient-3)"
          />
          <defs>
            <linearGradient id="gold-gradient-3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: "#fbbf24", stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: "#f59e0b", stopOpacity: 1 }} />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="absolute bottom-0 right-0 w-24 h-24 opacity-30 -rotate-90">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path
            d="M 0 0 Q 50 50 100 0 L 100 100 L 0 100 Z"
            fill="url(#gold-gradient-4)"
          />
          <defs>
            <linearGradient id="gold-gradient-4" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: "#fbbf24", stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: "#f59e0b", stopOpacity: 1 }} />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  )
}
