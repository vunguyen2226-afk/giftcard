// Vietnamese Lunar New Year SVG decorative elements for card templates
// Includes: mai flowers, lanterns, dragon motifs, banh chung, cherry blossoms

// Mai flower (Hoa Mai) - iconic yellow 5-petal flower for Tet
export function MaiFlower({ className = "", size = 40 }: { className?: string; size?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className}>
      <g fill="#fbbf24" opacity="0.9">
        {/* 5 petals */}
        <ellipse cx="50" cy="20" rx="12" ry="20" transform="rotate(0 50 50)" />
        <ellipse cx="50" cy="20" rx="12" ry="20" transform="rotate(72 50 50)" />
        <ellipse cx="50" cy="20" rx="12" ry="20" transform="rotate(144 50 50)" />
        <ellipse cx="50" cy="20" rx="12" ry="20" transform="rotate(216 50 50)" />
        <ellipse cx="50" cy="20" rx="12" ry="20" transform="rotate(288 50 50)" />
        {/* Center pistil */}
        <circle cx="50" cy="50" r="8" fill="#92400e" />
        <circle cx="50" cy="50" r="5" fill="#fbbf24" />
      </g>
    </svg>
  )
}

// Hanging lantern - traditional red/gold
export function Lantern({ className = "", size = 60 }: { className?: string; size?: number }) {
  return (
    <svg viewBox="0 0 60 100" width={size * 0.6} height={size} className={className}>
      {/* Hanging string */}
      <line x1="30" y1="0" x2="30" y2="15" stroke="#fbbf24" strokeWidth="1.5" />
      {/* Top cap */}
      <rect x="22" y="14" width="16" height="5" rx="2" fill="#fbbf24" />
      {/* Lantern body */}
      <ellipse cx="30" cy="48" rx="22" ry="30" fill="#dc2626" opacity="0.9" />
      <ellipse cx="30" cy="48" rx="18" ry="26" fill="#ef4444" opacity="0.6" />
      {/* Gold ribs */}
      <path d="M30 18 L30 78" stroke="#fbbf24" strokeWidth="1" opacity="0.5" />
      <path d="M12 48 Q30 20 48 48 Q30 76 12 48" stroke="#fbbf24" strokeWidth="1" fill="none" opacity="0.4" />
      {/* Bottom cap */}
      <rect x="24" y="76" width="12" height="4" rx="1" fill="#fbbf24" />
      {/* Tassel */}
      <line x1="28" y1="80" x2="28" y2="95" stroke="#fbbf24" strokeWidth="1" />
      <line x1="30" y1="80" x2="30" y2="97" stroke="#fbbf24" strokeWidth="1" />
      <line x1="32" y1="80" x2="32" y2="95" stroke="#fbbf24" strokeWidth="1" />
    </svg>
  )
}

// Stylized dragon head motif
export function DragonMotif({ className = "", size = 80 }: { className?: string; size?: number }) {
  return (
    <svg viewBox="0 0 120 60" width={size} height={size * 0.5} className={className}>
      <g fill="none" stroke="#fbbf24" strokeWidth="2" opacity="0.6">
        {/* Dragon body curve */}
        <path d="M10 30 Q30 5 50 25 Q70 45 90 20 Q100 10 115 15" strokeWidth="3" />
        {/* Dragon scales along body */}
        <path d="M25 15 Q30 10 35 15" />
        <path d="M45 30 Q50 25 55 30" />
        <path d="M65 35 Q70 30 75 35" />
        <path d="M85 20 Q90 15 95 20" />
        {/* Dragon whiskers */}
        <path d="M10 30 Q5 20 2 15" strokeWidth="1.5" />
        <path d="M10 30 Q3 28 0 32" strokeWidth="1.5" />
        {/* Head detail */}
        <circle cx="12" cy="26" r="2" fill="#fbbf24" />
      </g>
    </svg>
  )
}

// Bánh chưng - square rice cake
export function BanhChung({ className = "", size = 40 }: { className?: string; size?: number }) {
  return (
    <svg viewBox="0 0 60 60" width={size} height={size} className={className}>
      {/* Banana leaf wrapping (green square) */}
      <rect x="8" y="8" width="44" height="44" rx="3" fill="#15803d" opacity="0.7" />
      <rect x="12" y="12" width="36" height="36" rx="2" fill="#22c55e" opacity="0.5" />
      {/* Cross tie strings */}
      <line x1="30" y1="5" x2="30" y2="55" stroke="#fbbf24" strokeWidth="2" opacity="0.6" />
      <line x1="5" y1="30" x2="55" y2="30" stroke="#fbbf24" strokeWidth="2" opacity="0.6" />
      {/* Inner rice visible area */}
      <rect x="18" y="18" width="24" height="24" rx="1" fill="#fef3c7" opacity="0.3" />
    </svg>
  )
}

// Cherry blossom branch (Hoa Đào) - for northern Vietnam
export function CherryBlossomBranch({ className = "", size = 100 }: { className?: string; size?: number }) {
  return (
    <svg viewBox="0 0 120 80" width={size} height={size * 0.67} className={className}>
      <g opacity="0.7">
        {/* Branch */}
        <path d="M0 60 Q30 50 50 40 Q80 25 120 15" stroke="#92400e" strokeWidth="2.5" fill="none" />
        <path d="M40 42 Q45 30 55 20" stroke="#92400e" strokeWidth="1.5" fill="none" />
        {/* Blossoms */}
        {[
          { cx: 25, cy: 52 }, { cx: 48, cy: 38 }, { cx: 70, cy: 28 },
          { cx: 95, cy: 18 }, { cx: 52, cy: 22 }, { cx: 38, cy: 45 },
        ].map((pos, i) => (
          <g key={i} transform={`translate(${pos.cx},${pos.cy})`}>
            {[0, 72, 144, 216, 288].map((angle) => (
              <ellipse
                key={angle}
                cx="0" cy="-6" rx="3.5" ry="6"
                fill="#fda4af" transform={`rotate(${angle})`}
              />
            ))}
            <circle cx="0" cy="0" r="2.5" fill="#fbbf24" />
          </g>
        ))}
        {/* Buds */}
        <circle cx="110" cy="15" r="3" fill="#fb7185" opacity="0.6" />
        <circle cx="15" cy="57" r="2.5" fill="#fb7185" opacity="0.5" />
      </g>
    </svg>
  )
}

// Scattered mai flower petals (small decorative accents)
export function MaiPetals({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={`w-full h-full ${className}`} preserveAspectRatio="none">
      <g fill="#fbbf24" opacity="0.15">
        <ellipse cx="20" cy="30" rx="4" ry="8" transform="rotate(30 20 30)" />
        <ellipse cx="170" cy="50" rx="3" ry="7" transform="rotate(-20 170 50)" />
        <ellipse cx="50" cy="160" rx="5" ry="9" transform="rotate(60 50 160)" />
        <ellipse cx="150" cy="170" rx="4" ry="7" transform="rotate(-45 150 170)" />
        <ellipse cx="100" cy="20" rx="3" ry="6" transform="rotate(15 100 20)" />
        <ellipse cx="30" cy="100" rx="4" ry="8" transform="rotate(-30 30 100)" />
        <ellipse cx="180" cy="130" rx="3" ry="7" transform="rotate(45 180 130)" />
      </g>
    </svg>
  )
}
