"use client"

import { CardTemplateProps } from "@/types"
import {
  MaiFlower, Lantern, DragonMotif, BanhChung,
  CherryBlossomBranch, MaiPetals,
} from "./vietnamese-lunar-decorations"

const FONT_MAP: Record<string, string> = {
  "sans-serif": "ui-sans-serif, system-ui, sans-serif",
  serif: "ui-serif, Georgia, serif",
  cursive: "cursive",
  monospace: "ui-monospace, monospace",
  handwriting: "cursive",
}

export function TraditionalTemplate({
  senderName, recipientName, message, fontFamily, primaryColor, imageUrl, className = "",
}: CardTemplateProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-600 via-red-700 to-red-900 p-8 ${className}`}
      style={{ fontFamily: FONT_MAP[fontFamily] }}
    >
      {/* Scattered mai petals background */}
      <div className="absolute inset-0 pointer-events-none">
        <MaiPetals />
      </div>

      {/* Cherry blossom branch - top left */}
      <div className="absolute -top-2 -left-4 opacity-40 pointer-events-none">
        <CherryBlossomBranch size={140} />
      </div>

      {/* Cherry blossom branch - bottom right (flipped) */}
      <div className="absolute -bottom-2 -right-4 opacity-30 pointer-events-none rotate-180">
        <CherryBlossomBranch size={120} />
      </div>

      {/* Hanging lanterns */}
      <div className="absolute top-0 left-[15%] opacity-40 pointer-events-none">
        <Lantern size={50} />
      </div>
      <div className="absolute top-0 right-[15%] opacity-40 pointer-events-none">
        <Lantern size={50} />
      </div>

      {/* Dragon motif - subtle background */}
      <div className="absolute top-[20%] left-[5%] opacity-20 pointer-events-none">
        <DragonMotif size={100} />
      </div>
      <div className="absolute bottom-[20%] right-[5%] opacity-20 pointer-events-none -scale-x-100">
        <DragonMotif size={100} />
      </div>

      {/* Mai flowers in corners */}
      <div className="absolute top-3 left-3 opacity-60 pointer-events-none">
        <MaiFlower size={32} />
      </div>
      <div className="absolute top-3 right-3 opacity-60 pointer-events-none">
        <MaiFlower size={28} />
      </div>
      <div className="absolute bottom-3 left-3 opacity-50 pointer-events-none">
        <MaiFlower size={28} />
      </div>
      <div className="absolute bottom-3 right-3 opacity-50 pointer-events-none">
        <MaiFlower size={32} />
      </div>

      {/* Bánh chưng decorations - bottom corners */}
      <div className="absolute bottom-8 left-8 opacity-30 pointer-events-none">
        <BanhChung size={35} />
      </div>
      <div className="absolute bottom-8 right-8 opacity-30 pointer-events-none">
        <BanhChung size={35} />
      </div>

      {/* Decorative border pattern */}
      <div className="absolute inset-4 border-4 border-amber-400 rounded-xl opacity-50" />
      <div className="absolute inset-6 border-2 border-amber-300 rounded-lg opacity-30" />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[500px] text-white">
        <TraditionalHeader primaryColor={primaryColor} />

        <div className="mb-6">
          <div className="text-2xl font-semibold text-amber-100">
            Dear {recipientName}
          </div>
        </div>

        {imageUrl && <TraditionalImageFrame imageUrl={imageUrl} />}

        <TraditionalMessage message={message} />

        <div className="mt-6 relative">
          <div className="px-6 py-2 bg-amber-400/20 rounded-lg border border-amber-400/50 backdrop-blur-sm">
            <div className="text-sm text-amber-200 mb-1">With warm wishes,</div>
            <div className="text-xl font-semibold text-amber-100">{senderName}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Sub-components to keep file manageable
function TraditionalHeader({ primaryColor }: { primaryColor: string }) {
  return (
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
  )
}

function TraditionalImageFrame({ imageUrl }: { imageUrl: string }) {
  return (
    <div className="mb-8 relative">
      <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-amber-400 shadow-2xl">
        <img src={imageUrl} alt="Card image" className="w-full h-full object-cover" />
      </div>
      <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-amber-300 rounded-tl-lg" />
      <div className="absolute -top-2 -right-2 w-8 h-8 border-t-4 border-r-4 border-amber-300 rounded-tr-lg" />
      <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-4 border-l-4 border-amber-300 rounded-bl-lg" />
      <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-amber-300 rounded-br-lg" />
    </div>
  )
}

function TraditionalMessage({ message }: { message: string }) {
  return (
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
  )
}
