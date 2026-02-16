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

// Firecracker - Red tube with golden fuse, classic Tet symbol
export function Firecracker({ className = "", size = 50 }: { className?: string; size?: number }) {
  return (
    <svg viewBox="0 0 40 100" width={size * 0.4} height={size} className={className}>
      <g opacity="0.85">
        {/* Fuse */}
        <path d="M20 0 Q25 5 20 10 Q15 15 20 18" stroke="#fbbf24" strokeWidth="1.5" fill="none" />
        {/* Spark */}
        <circle cx="20" cy="2" r="3" fill="#fbbf24" opacity="0.7" />
        {/* Top cap */}
        <rect x="12" y="18" width="16" height="4" rx="1" fill="#fbbf24" />
        {/* Body */}
        <rect x="14" y="22" width="12" height="60" rx="2" fill="#dc2626" />
        <rect x="16" y="22" width="8" height="60" rx="1" fill="#ef4444" opacity="0.5" />
        {/* Gold bands */}
        <rect x="13" y="32" width="14" height="3" rx="1" fill="#fbbf24" opacity="0.7" />
        <rect x="13" y="52" width="14" height="3" rx="1" fill="#fbbf24" opacity="0.7" />
        <rect x="13" y="72" width="14" height="3" rx="1" fill="#fbbf24" opacity="0.7" />
        {/* Bottom cap */}
        <rect x="12" y="82" width="16" height="4" rx="1" fill="#fbbf24" />
        {/* Chinese character-like decoration */}
        <text x="20" y="58" textAnchor="middle" fill="#fbbf24" fontSize="12" fontWeight="bold" opacity="0.6">福</text>
      </g>
    </svg>
  )
}

// Kumquat tree - Small tree with orange fruits, symbol of prosperity
export function KumquatTree({ className = "", size = 60 }: { className?: string; size?: number }) {
  return (
    <svg viewBox="0 0 80 100" width={size * 0.8} height={size} className={className}>
      <g opacity="0.8">
        {/* Pot */}
        <path d="M25 85 L55 85 L52 100 L28 100 Z" fill="#92400e" />
        <rect x="22" y="82" width="36" height="5" rx="2" fill="#b45309" />
        {/* Trunk */}
        <path d="M38 82 Q40 65 40 55" stroke="#92400e" strokeWidth="3" fill="none" />
        <path d="M42 82 Q40 65 40 55" stroke="#78350f" strokeWidth="2" fill="none" />
        {/* Branches */}
        <path d="M40 65 Q30 55 20 50" stroke="#92400e" strokeWidth="2" fill="none" />
        <path d="M40 60 Q50 50 60 48" stroke="#92400e" strokeWidth="2" fill="none" />
        <path d="M40 55 Q35 45 25 38" stroke="#92400e" strokeWidth="1.5" fill="none" />
        <path d="M40 55 Q48 42 55 35" stroke="#92400e" strokeWidth="1.5" fill="none" />
        {/* Leaf clusters */}
        <ellipse cx="20" cy="45" rx="12" ry="10" fill="#15803d" opacity="0.7" />
        <ellipse cx="60" cy="43" rx="12" ry="10" fill="#16a34a" opacity="0.6" />
        <ellipse cx="25" cy="33" rx="10" ry="8" fill="#16a34a" opacity="0.6" />
        <ellipse cx="55" cy="30" rx="10" ry="8" fill="#15803d" opacity="0.7" />
        <ellipse cx="40" cy="25" rx="14" ry="12" fill="#15803d" opacity="0.7" />
        {/* Kumquat fruits */}
        <circle cx="22" cy="42" r="4" fill="#f97316" />
        <circle cx="58" cy="40" r="4" fill="#fb923c" />
        <circle cx="30" cy="30" r="3.5" fill="#f97316" />
        <circle cx="50" cy="28" r="3.5" fill="#fb923c" />
        <circle cx="40" cy="22" r="3" fill="#f97316" />
        <circle cx="35" cy="48" r="3" fill="#fb923c" />
        <circle cx="48" cy="45" r="3.5" fill="#f97316" />
      </g>
    </svg>
  )
}

// Lucky Envelope (Lì Xì) - Red envelope with gold trim
export function LuckyEnvelope({ className = "", size = 50 }: { className?: string; size?: number }) {
  return (
    <svg viewBox="0 0 60 80" width={size * 0.75} height={size} className={className}>
      <g opacity="0.85">
        {/* Envelope body */}
        <rect x="5" y="10" width="50" height="65" rx="3" fill="#dc2626" />
        <rect x="7" y="12" width="46" height="61" rx="2" fill="#ef4444" opacity="0.5" />
        {/* Flap */}
        <path d="M5 10 L30 30 L55 10" fill="#b91c1c" />
        <path d="M7 12 L30 28 L53 12" fill="#dc2626" opacity="0.6" />
        {/* Gold trim border */}
        <rect x="5" y="10" width="50" height="65" rx="3" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
        {/* Center gold circle with character */}
        <circle cx="30" cy="48" r="14" fill="#fbbf24" opacity="0.9" />
        <circle cx="30" cy="48" r="11" fill="#dc2626" />
        <text x="30" y="53" textAnchor="middle" fill="#fbbf24" fontSize="14" fontWeight="bold">福</text>
        {/* Decorative corners */}
        <path d="M10 15 L10 22 L17 15 Z" fill="#fbbf24" opacity="0.4" />
        <path d="M50 15 L50 22 L43 15 Z" fill="#fbbf24" opacity="0.4" />
      </g>
    </svg>
  )
}

// Spring Scroll (Câu Đối) - Vertical red banner with gold border
export function SpringScroll({ className = "", size = 80 }: { className?: string; size?: number }) {
  return (
    <svg viewBox="0 0 35 100" width={size * 0.35} height={size} className={className}>
      <g opacity="0.8">
        {/* Top roller */}
        <rect x="3" y="0" width="29" height="6" rx="3" fill="#92400e" />
        <circle cx="5" cy="3" r="3" fill="#b45309" />
        <circle cx="30" cy="3" r="3" fill="#b45309" />
        {/* Scroll body */}
        <rect x="5" y="6" width="25" height="85" fill="#dc2626" />
        <rect x="5" y="6" width="25" height="85" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
        {/* Inner border */}
        <rect x="8" y="10" width="19" height="77" fill="none" stroke="#fbbf24" strokeWidth="0.5" opacity="0.5" />
        {/* Characters */}
        <text x="17.5" y="30" textAnchor="middle" fill="#fbbf24" fontSize="12" fontWeight="bold">迎</text>
        <text x="17.5" y="50" textAnchor="middle" fill="#fbbf24" fontSize="12" fontWeight="bold">春</text>
        <text x="17.5" y="70" textAnchor="middle" fill="#fbbf24" fontSize="12" fontWeight="bold">福</text>
        {/* Bottom roller */}
        <rect x="3" y="91" width="29" height="6" rx="3" fill="#92400e" />
        <circle cx="5" cy="94" r="3" fill="#b45309" />
        <circle cx="30" cy="94" r="3" fill="#b45309" />
        {/* Tassel */}
        <line x1="17" y1="97" x2="17" y2="100" stroke="#fbbf24" strokeWidth="1" />
      </g>
    </svg>
  )
}

// Watermelon - Half-circle red melon with green rind (Southern Tet symbol)
export function Watermelon({ className = "", size = 50 }: { className?: string; size?: number }) {
  return (
    <svg viewBox="0 0 80 50" width={size} height={size * 0.625} className={className}>
      <g opacity="0.8">
        {/* Green rind (outer) */}
        <path d="M5 45 A35 35 0 0 1 75 45 Z" fill="#15803d" />
        {/* White rind layer */}
        <path d="M9 45 A31 31 0 0 1 71 45 Z" fill="#dcfce7" opacity="0.5" />
        {/* Red flesh */}
        <path d="M12 45 A28 28 0 0 1 68 45 Z" fill="#dc2626" />
        <path d="M15 45 A25 25 0 0 1 65 45 Z" fill="#ef4444" opacity="0.4" />
        {/* Seeds */}
        <ellipse cx="25" cy="38" rx="2" ry="3" fill="#171717" transform="rotate(-15 25 38)" />
        <ellipse cx="40" cy="32" rx="2" ry="3" fill="#171717" />
        <ellipse cx="55" cy="38" rx="2" ry="3" fill="#171717" transform="rotate(15 55 38)" />
        <ellipse cx="32" cy="42" rx="1.5" ry="2.5" fill="#171717" transform="rotate(-10 32 42)" />
        <ellipse cx="48" cy="42" rx="1.5" ry="2.5" fill="#171717" transform="rotate(10 48 42)" />
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
