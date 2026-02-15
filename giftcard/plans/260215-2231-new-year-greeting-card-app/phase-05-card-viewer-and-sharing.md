# Phase 5: Card Viewer & Sharing

## Context Links

- **Parent Plan**: [plan.md](./plan.md)
- **Dependencies**: [Phase 3](./phase-03-card-templates-and-types.md) (templates), [Phase 4](./phase-04-card-editor.md) (cards exist in DB, API routes)
- **Research**: [Frontend & Email Report](./research/researcher-02-frontend-email-report.md)

## Overview

- **Date**: 2026-02-15
- **Priority**: P1
- **Status**: completed
- **Review Status**: pending
- **Description**: Build the public card viewer page at /card/[slug] with envelope-opening animation, visual effects (fireworks/snow/cherry blossom/confetti), background music, recipient personalization, view tracking, dynamic OG images, and sharing components (social links, QR code).

## Key Insights

- Public page -- no auth required; anyone with the slug URL can view
- Slug is the recipient's `personalSlug`, not the card slug; each recipient has a unique URL
- Envelope animation: rotateX on flap element, scale/opacity reveal on card body; ~2s total; **auto-play after 2s delay** (validated)
- Motion v11: import from `"motion/react"`, all components need `"use client"`
- Effects performance: limit ~50 simultaneous particles; use GPU-accelerated props (transform, opacity) only
- OG image: `opengraph-image.tsx` convention file with `ImageResponse` from `next/og`; 1200x630px; runs on **Node.js runtime** (validated: Prisma works directly)
<!-- Updated: Validation Session 1 - Changed OG runtime from edge to nodejs -->
- View tracking: fire POST on first load; debounce/deduplicate with sessionStorage flag
- Social sharing URLs: Facebook (share dialog), Zalo (zalo.me/share), WhatsApp (wa.me/?text=), Messenger (fb-messenger://share)

## Requirements

### Functional
- `/card/[slug]` resolves personalSlug, loads card + recipient data
- Envelope opening animation plays on first visit (click or auto-play after 2s)
- After envelope opens, card reveals with selected template and visual effect
- Background music: **muted by default, click to play** (validated). Visible toggle button, no autoplay attempt.
<!-- Updated: Validation Session 1 - Confirmed muted+click music UX, auto-play envelope -->
- Recipient's name displayed in card ("Dear [name]")
- View count incremented on first visit (deduplicated per session)
- Dynamic OG image shows card preview for social sharing
- generateMetadata sets title, description, og:image for each card
- ShareButtons component: Copy Link, Facebook, Zalo, WhatsApp, Messenger
- QR code generator: creates QR for card URL, downloadable as PNG
- "Create your own card" CTA button at bottom

### Non-Functional
- Page load < 2s (card data fetched server-side via RSC or SSR)
- Envelope animation smooth 60fps
- Effects don't cause jank (limit particles, GPU-only props)
- Works on mobile browsers (iOS Safari, Android Chrome)
- OG image generates in < 500ms (edge runtime)

## Architecture

```
/card/[slug]/
├── page.tsx ──────────── Server component: fetch card data, render layout
│   └── CardViewerClient ── "use client" wrapper for animations + interactivity
│       ├── EnvelopeAnimation ── rotateX flap + reveal card
│       ├── CardDisplay ──────── Renders template with card data
│       ├── EffectLayer ──────── Conditionally renders one of:
│       │   ├── FireworksEffect
│       │   ├── SnowEffect
│       │   ├── CherryBlossomEffect
│       │   └── ConfettiEffect
│       ├── MusicPlayer ──────── Audio toggle (muted by default)
│       ├── ShareButtons ─────── Copy link, social share links
│       └── QrCodeGenerator ──── QR code with download
├── opengraph-image.tsx ── Dynamic OG image generation

API:
GET  /api/view/[slug]         -> Return card + recipient data
POST /api/view/[slug]/track   -> Increment view count
```

## Related Code Files

### Files to Create
- `src/app/card/[slug]/page.tsx`
- `src/app/card/[slug]/opengraph-image.tsx`
- `src/components/card-viewer/card-viewer-client.tsx`
- `src/components/card-viewer/card-display.tsx`
- `src/components/card-viewer/envelope-animation.tsx`
- `src/components/card-viewer/fireworks-effect.tsx`
- `src/components/card-viewer/snow-effect.tsx`
- `src/components/card-viewer/cherry-blossom-effect.tsx`
- `src/components/card-viewer/confetti-effect.tsx`
- `src/components/card-viewer/music-player.tsx`
- `src/components/shared/share-buttons.tsx`
- `src/components/shared/qr-code-generator.tsx`
- `src/app/api/view/[slug]/route.ts`
- `src/app/api/view/[slug]/track/route.ts`

### Files to Modify
- `src/types/index.ts` -- Add CardViewData if not already present

## Implementation Steps

### 1. Create View API Route

`src/app/api/view/[slug]/route.ts`:

```typescript
// GET: Find recipient by personalSlug, include card + card.user
// Return: { card: CardData, recipient: RecipientData }
// 404 if slug not found

import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const recipient = await prisma.recipient.findUnique({
    where: { personalSlug: params.slug },
    include: {
      card: {
        include: { user: { select: { name: true, image: true } } }
      }
    }
  })

  if (!recipient) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 })
  }

  return NextResponse.json({
    card: recipient.card,
    recipient: { id: recipient.id, name: recipient.name, personalSlug: recipient.personalSlug }
  })
}
```

### 2. Create View Tracking Route

`src/app/api/view/[slug]/track/route.ts`:

```typescript
// POST: Increment viewCount, set firstViewedAt if null
// No auth required (public endpoint)
// Returns: { success: true }

export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  await prisma.recipient.update({
    where: { personalSlug: params.slug },
    data: {
      viewCount: { increment: 1 },
      firstViewedAt: { set: new Date() } // Only sets if null via conditional
    }
  })
  // Note: firstViewedAt should use a raw query or conditional to only set once
  // Better approach: use prisma.$executeRaw or check current value first
}
```

### 3. Build Card Viewer Page (Server Component)

`src/app/card/[slug]/page.tsx`:

```typescript
// Server component: fetch card data directly via Prisma (no API call)
// Pass data to CardViewerClient
// generateMetadata for SEO/social:
//   title: "New Year Card for {recipientName} from {senderName}"
//   description: truncated message
//   openGraph with images pointing to opengraph-image.tsx

import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { CardViewerClient } from "@/components/card-viewer/card-viewer-client"
import { Metadata } from "next"

export async function generateMetadata({ params }): Promise<Metadata> {
  const recipient = await prisma.recipient.findUnique({
    where: { personalSlug: params.slug },
    include: { card: true }
  })
  if (!recipient) return {}
  return {
    title: `New Year Card for ${recipient.name}`,
    description: recipient.card.message.slice(0, 160),
    openGraph: {
      title: `${recipient.card.senderName} sent you a New Year card!`,
      description: recipient.card.message.slice(0, 160),
    }
  }
}

export default async function CardViewerPage({ params }) {
  // Fetch data, pass to client component
  // Handle 404 with notFound()
}
```

### 4. Build Envelope Animation

`src/components/card-viewer/envelope-animation.tsx`:

```typescript
"use client"
import { motion, AnimatePresence } from "motion/react"

// States: closed -> opening -> opened
// Envelope body: bottom half rectangle
// Flap: top triangle, rotateX from 0 to 180 degrees (opens up)
// Card inside: slides up + scales from 0.8 to 1
// Trigger: click on envelope OR auto after 2s delay
// Total animation: ~2s

// Motion config:
// Flap: animate={{ rotateX: 180 }}, transition: { duration: 0.8, ease: "easeInOut" }
// Card reveal: animate={{ y: -100, scale: 1, opacity: 1 }}, transition: { delay: 0.6, duration: 0.8 }
```

### 5. Build Visual Effects

Each effect: "use client", renders motion-animated particles in a fixed/absolute overlay.

**`fireworks-effect.tsx`**:
- Spawn 3-5 burst points at random x positions
- Each burst: 15-20 particles radiating outward (scale 0->1->0, opacity 1->0)
- Stagger bursts over 3s, then loop or settle
- Colors: gold, red, orange, white

**`snow-effect.tsx`**:
- 30-50 snowflake elements (small circles)
- Each: y animates from -20px to screen height; x sways with sin-wave (±30px)
- Random sizes (2-6px), random speeds (5-15s duration)
- Infinite loop with random delays

**`cherry-blossom-effect.tsx`**:
- 20-30 petal shapes (rounded pink/rose elements, rotated)
- Fall with y animation, gentle x sway (wider than snow)
- Slight rotation during fall
- Colors: pink-200, pink-300, rose-200

**`confetti-effect.tsx`**:
- 40-50 rectangular pieces in multiple colors
- Burst from top-center, spread outward
- Each piece: random rotation (rotateX, rotateY, rotateZ), fall with gravity
- One-shot animation on card reveal, ~3s duration

### 6. Build Card Display

`src/components/card-viewer/card-display.tsx`:
- Import `getTemplateComponent` from registry
- Render selected template with full-screen sizing
- Pass card data as CardTemplateProps
- Apply recipient name personalization
- Wrapper: centered, max-width constraint, subtle shadow

### 7. Build Music Player

`src/components/card-viewer/music-player.tsx`:
- Floating button (bottom-right corner, fixed position)
- Icons: speaker on / speaker off
- HTML5 Audio element, starts muted (autoplay policy)
- User click toggles play/pause
- Subtle pulse animation when playing
- Handles missing music gracefully (hidden when no music set)

### 8. Build Card Viewer Client (Orchestrator)

`src/components/card-viewer/card-viewer-client.tsx`:
- "use client"
- States: envelope_closed -> envelope_opening -> card_revealed
- On mount: fire view tracking POST (with sessionStorage dedup)
- Render: EnvelopeAnimation -> on complete -> CardDisplay + EffectLayer + MusicPlayer
- After card revealed: show ShareButtons and QR at bottom
- "Create your own card" CTA button

### 9. Build Share Buttons

`src/components/shared/share-buttons.tsx`:
- Copy Link: navigator.clipboard.writeText(), show "Copied!" toast
- Facebook: `https://www.facebook.com/sharer/sharer.php?u={url}`
- Zalo: `https://zalo.me/share?url={url}`
- WhatsApp: `https://wa.me/?text={url}`
- Messenger: `https://www.facebook.com/dialog/send?link={url}&app_id={FB_APP_ID}`
  - Note: Messenger requires FB app ID; fallback to regular Facebook share if no app ID
- Each button: icon + label, styled consistently
- Receive `url` and `title` as props

### 10. Build QR Code Generator

`src/components/shared/qr-code-generator.tsx`:

```typescript
"use client"
import { QRCodeCanvas } from "qrcode.react"
import { useRef } from "react"

// Render QRCodeCanvas with card URL
// "Download QR" button: get canvas ref, toDataURL, trigger download
// Size: 200x200 default
// Include app logo in QR center (optional, via imageSettings prop)
```

### 11. Build Dynamic OG Image

`src/app/card/[slug]/opengraph-image.tsx`:

```typescript
import { ImageResponse } from "next/og"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs" // Validated: Node.js runtime so Prisma works directly (not edge)
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function OGImage({ params }) {
  const recipient = await prisma.recipient.findUnique({
    where: { personalSlug: params.slug },
    include: { card: true }
  })

  // Render: card preview styled with template colors
  // Include: "New Year Card for {name}", sender name, decorative elements
  // Use primaryColor as background accent
  // Simple layout (no complex CSS -- OG image uses limited subset)
  return new ImageResponse(/* JSX */, { ...size })
}
```

<!-- Validated: Using Node.js runtime, Prisma works directly. No alternatives needed. -->

### 12. View Tracking Deduplication

In CardViewerClient:
```typescript
useEffect(() => {
  const storageKey = `viewed_${slug}`
  if (!sessionStorage.getItem(storageKey)) {
    fetch(`/api/view/${slug}/track`, { method: "POST" })
    sessionStorage.setItem(storageKey, "1")
  }
}, [slug])
```

## Todo List

- [x] Create GET /api/view/[slug] route
- [x] Create POST /api/view/[slug]/track route
- [x] Build card viewer page (server component + generateMetadata)
- [x] Build CardViewerClient orchestrator
- [x] Build EnvelopeAnimation component
- [x] Build FireworksEffect component
- [x] Build SnowEffect component
- [x] Build CherryBlossomEffect component
- [x] Build ConfettiEffect component
- [x] Build CardDisplay wrapper
- [x] Build MusicPlayer component
- [x] Build ShareButtons component
- [x] Build QrCodeGenerator component
- [x] Build dynamic OG image (opengraph-image.tsx)
- [x] Implement view tracking with sessionStorage deduplication
- [x] Add "Create your own card" CTA
- [ ] Test envelope animation on mobile and desktop
- [ ] Test all 4 visual effects for performance (60fps target)
- [ ] Test OG image renders correctly (validate with Facebook debugger, etc.)
- [ ] Test social share links open correctly
- [ ] Test QR code download

## Success Criteria

- /card/[slug] loads and displays correct card for given recipient
- Envelope animation plays smoothly, reveals card
- Selected visual effect renders without performance issues
- Music player toggles correctly (respects autoplay policy)
- View count increments on first visit only (per session)
- OG image shows card preview when URL shared on social media
- Share buttons produce correct URLs for all platforms
- QR code encodes correct URL and downloads as PNG
- Page works on mobile browsers
- 404 shown for invalid slugs

## Risk Assessment

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| ~~Prisma not compatible with edge runtime for OG image~~ | ~~High~~ | **RESOLVED**: Using Node.js runtime instead of edge (Validation Session 1) |
| Browser autoplay policy blocks music | Expected | Start muted; require user click to unmute; show clear toggle |
| Motion animations cause jank on low-end mobile | Medium | Limit particles; use will-change sparingly; test on throttled CPU |
| sessionStorage not available in incognito/iframe | Low | Graceful fallback: track anyway (slight over-count acceptable) |
| Social platform OG cache stale | Medium | Append ?v=timestamp or use cache-busting; document how to purge |

## Security Considerations

- View tracking endpoint is public: no auth, but rate limit to prevent abuse (Phase 7)
- Validate slug format before DB query (alphanumeric, correct length)
- OG image generation should not expose sensitive card data (only public info)
- Audio files served from public/ -- ensure they are royalty-free
- Share URLs should not contain user tokens or session data

## Next Steps

- Phase 6 links from dashboard to card viewer for testing
- Phase 7 adds rate limiting on public /api/view/* endpoints
- After launch: monitor OG image cache behavior across platforms

## Unresolved Questions

1. Prisma on edge runtime for OG image: likely incompatible. Plan B: fetch from API route or use a lightweight query approach. Decide at implementation.
2. Should envelope animation auto-play or require click? Recommend: auto-play after 2s delay, with option to click to skip.
3. Messenger sharing requires Facebook App ID. Skip Messenger share if no app ID configured, or use generic `fb-messenger://` deep link?
4. Should view tracking use POST /api route or a Server Action? POST route is simpler for public access (no CSRF concerns with auth).
