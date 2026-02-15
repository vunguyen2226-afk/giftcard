# Phase 3: Card Templates & Types

## Context Links

- **Parent Plan**: [plan.md](./plan.md)
- **Dependencies**: [Phase 1](./phase-01-project-setup-and-infrastructure.md) (types foundation, Prisma models)
- **Research**: [Frontend & Email Report](./research/researcher-02-frontend-email-report.md)

## Overview

- **Date**: 2026-02-15
- **Priority**: P1
- **Status**: completed
- **Review Status**: pending
- **Completed**: 2026-02-15
- **Description**: Define all TypeScript types, build 5 card templates (traditional, modern, animated, minimal, elegant), create template registry with metadata, and compile sample greeting suggestions.

## Key Insights

- Templates are React components receiving card data as props; render the visual card design
- Each template defines its own layout, typography emphasis, color application, and default settings
- Template registry exports metadata (id, name, description, thumbnail, default colors) for selector UI
- All templates must be "use client" because they receive animation effects as children
- Keep templates under 200 LOC each; extract shared patterns into utility components
- Sample greetings: 10-15 New Year messages in both English and Vietnamese

## Requirements

### Functional
- TypeScript types cover: Card, Recipient, Template, Effect, Font, MusicOption, EditorState
- 5 distinct templates: traditional (Tet-themed), modern (gradient/glass), animated (motion-heavy), minimal (clean/whitespace), elegant (serif/ornate)
- Template registry exports list of all templates with metadata
- Each template renders card data (sender name, recipient name, message, colors, font, image)
- Sample greeting suggestions available as importable data
- Templates accept `primaryColor` and apply it to accents/backgrounds

### Non-Functional
- Templates render correctly at both preview size (~400px) and full-screen viewer size
- Templates support dark backgrounds where appropriate
- Under 200 LOC per template file
- Consistent prop interface across all templates

## Architecture

```
src/types/index.ts ──── Central type definitions
src/templates/
  ├── index.ts ──────── Registry: metadata array + component map
  ├── traditional.tsx ── Tet/Lunar New Year theme
  ├── modern.tsx ─────── Gradient/glassmorphism
  ├── animated.tsx ───── Motion-heavy with entrance animations
  ├── minimal.tsx ────── Clean whitespace
  └── elegant.tsx ────── Serif typography, ornate borders
src/lib/greeting-suggestions.ts ── Sample messages
```

## Related Code Files

### Files to Create
- `src/types/index.ts`
- `src/templates/traditional.tsx`
- `src/templates/modern.tsx`
- `src/templates/animated.tsx`
- `src/templates/minimal.tsx`
- `src/templates/elegant.tsx`
- `src/templates/index.ts`
- `src/lib/greeting-suggestions.ts`

### Files to Modify
- None (all new files this phase)

## Implementation Steps

### 1. Define TypeScript Types

`src/types/index.ts`:

```typescript
// Effect types for visual animations
export type EffectType = "fireworks" | "snow" | "cherry_blossom" | "confetti"

// Font options
export type FontFamily = "sans-serif" | "serif" | "cursive" | "monospace" | "handwriting"

// Music preset options
export interface MusicOption {
  id: string
  name: string
  url: string       // path to audio file in /public/music/
  duration: number   // seconds
}

// Template metadata for selector UI
export interface TemplateMetadata {
  id: string
  name: string
  description: string
  thumbnail: string   // path to preview image
  defaultColor: string
  defaultFont: FontFamily
  category: "traditional" | "modern" | "animated" | "minimal" | "elegant"
}

// Props passed to template components
export interface CardTemplateProps {
  senderName: string
  recipientName: string
  message: string
  fontFamily: FontFamily
  primaryColor: string
  imageUrl?: string
  className?: string
}

// Card data (mirrors Prisma model + joined recipient)
export interface CardData {
  id: string
  slug: string
  templateId: string
  senderName: string
  message: string
  fontFamily: string
  primaryColor: string
  backgroundMusic?: string
  effect: EffectType
  imageUrl?: string
  createdAt: string
}

// Recipient data
export interface RecipientData {
  id: string
  name: string
  email?: string
  personalSlug: string
  viewCount: number
  firstViewedAt?: string
}

// Card + recipient for public viewer
export interface CardViewData {
  card: CardData
  recipient: RecipientData
}

// Editor state for step wizard
export interface EditorState {
  step: number
  templateId: string
  senderName: string
  recipientNames: string[]
  recipientEmails: string[]
  message: string
  fontFamily: FontFamily
  primaryColor: string
  effect: EffectType
  imageUrl?: string
  backgroundMusic?: string
}

// API response types
export interface ApiResponse<T> {
  data?: T
  error?: string
}

export interface CardListResponse {
  cards: (CardData & { recipients: RecipientData[] })[]
}

export interface CardStatsResponse {
  totalViews: number
  recipients: RecipientData[]
}
```

### 2. Create Template Component Interface

All templates receive `CardTemplateProps` and render a self-contained card visual. Pattern:

```tsx
"use client"

import { CardTemplateProps } from "@/types"

export function TemplateName({ senderName, recipientName, message, fontFamily, primaryColor, imageUrl, className }: CardTemplateProps) {
  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`}
         style={{ fontFamily, color: primaryColor }}>
      {/* Template-specific layout */}
    </div>
  )
}
```

### 3. Build Traditional Template

`src/templates/traditional.tsx`:
- Tet/Lunar New Year aesthetic: red/gold color palette
- Decorative border with Vietnamese/Asian-inspired patterns (CSS borders/gradients)
- Cherry blossom or plum blossom decorative SVG elements
- Prominent "Happy New Year" / "Chuc Mung Nam Moi" header
- Center-aligned message with decorative dividers
- Sender name at bottom with ornamental frame
- Optional photo in circular frame with gold border

### 4. Build Modern Template

`src/templates/modern.tsx`:
- Gradient background using primaryColor as base
- Glassmorphism card overlay (backdrop-blur, white/10 bg)
- Large bold sans-serif typography
- Geometric decorative elements (circles, lines)
- Full-bleed photo option (background image with overlay)
- Clean layout: recipient name top, message center, sender bottom-right

### 5. Build Animated Template

`src/templates/animated.tsx`:
- Motion entrance animations on all text elements (fade-in + slide-up staggered)
- Pulsing/glowing border effect using primaryColor
- Floating decorative particles (CSS animation, not Motion -- keep Motion for viewer effects)
- Dynamic gradient background that shifts slowly
- Emphasis animation on message text
- Note: heavier on CSS animations; Motion effects come from viewer layer

### 6. Build Minimal Template

`src/templates/minimal.tsx`:
- Maximum whitespace, clean typography
- Single accent color (primaryColor) used sparingly -- thin line, dot, sender name
- Large message text as focal point
- Small, understated sender/recipient names
- No decorative elements besides typography
- Optional photo as small, tasteful thumbnail

### 7. Build Elegant Template

`src/templates/elegant.tsx`:
- Serif typography (e.g., Georgia, Playfair Display feel via fontFamily)
- Ornate decorative borders (CSS border-image or SVG corners)
- Subtle texture background (CSS gradient noise or pattern)
- Script-like recipient greeting ("Dear [name],")
- Formal letter layout: greeting, body, closing, signature
- Photo in elegant frame with subtle shadow

### 8. Create Template Registry

`src/templates/index.ts`:

```typescript
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
    defaultColor: "#dc2626",
    defaultFont: "serif",
    category: "traditional",
  },
  {
    id: "modern",
    name: "Modern",
    description: "Sleek gradients and glassmorphism design",
    thumbnail: "/templates/modern-preview.png",
    defaultColor: "#7c3aed",
    defaultFont: "sans-serif",
    category: "modern",
  },
  {
    id: "animated",
    name: "Animated",
    description: "Dynamic entrance effects and glowing accents",
    thumbnail: "/templates/animated-preview.png",
    defaultColor: "#0ea5e9",
    defaultFont: "sans-serif",
    category: "animated",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean whitespace and typography-focused",
    thumbnail: "/templates/minimal-preview.png",
    defaultColor: "#171717",
    defaultFont: "sans-serif",
    category: "minimal",
  },
  {
    id: "elegant",
    name: "Elegant",
    description: "Ornate borders and serif typography",
    thumbnail: "/templates/elegant-preview.png",
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

export function getTemplate(id: string) {
  return TEMPLATES.find((t) => t.id === id)
}

export function getTemplateComponent(id: string) {
  return TEMPLATE_COMPONENTS[id] ?? TEMPLATE_COMPONENTS.traditional
}
```

### 9. Create Greeting Suggestions

`src/lib/greeting-suggestions.ts`:

```typescript
export interface GreetingSuggestion {
  id: string
  text: string
  language: "en" | "vi"
  category: "formal" | "casual" | "funny" | "heartfelt"
}

export const GREETING_SUGGESTIONS: GreetingSuggestion[] = [
  // English
  { id: "en-1", text: "Wishing you a year filled with joy, health, and prosperity!", language: "en", category: "formal" },
  { id: "en-2", text: "Happy New Year! May all your dreams come true in the coming year.", language: "en", category: "heartfelt" },
  { id: "en-3", text: "Cheers to new beginnings and wonderful memories ahead!", language: "en", category: "casual" },
  { id: "en-4", text: "May this new year bring you laughter, love, and everything your heart desires.", language: "en", category: "heartfelt" },
  { id: "en-5", text: "New year, new adventures! Let's make it the best one yet.", language: "en", category: "casual" },
  // Vietnamese
  { id: "vi-1", text: "Chuc Mung Nam Moi! Kinh chuc an khang thinh vuong, van su nhu y!", language: "vi", category: "formal" },
  { id: "vi-2", text: "Nam moi chuc ban va gia dinh nhieu suc khoe, hanh phuc va thanh cong!", language: "vi", category: "heartfelt" },
  { id: "vi-3", text: "Chuc ban nam moi phat tai, tien vao nhu nuoc!", language: "vi", category: "funny" },
  { id: "vi-4", text: "Mot nam moi tran day niem vui va nhung dieu tot dep nhat!", language: "vi", category: "casual" },
  { id: "vi-5", text: "Nam moi van su nhu y, suc khoe doi dao, cong viec thuan loi!", language: "vi", category: "formal" },
]
```

### 10. Create Template Preview Images

- Generate or create 5 placeholder preview images (400x300 or similar)
- Place in `public/templates/` directory
- These serve as thumbnails in the template selector
- Can be screenshots of the rendered templates or designed preview cards

## Todo List

- [x] Create `src/types/index.ts` with all type definitions
- [x] Build TraditionalTemplate component
- [x] Build ModernTemplate component
- [x] Build AnimatedTemplate component
- [x] Build MinimalTemplate component
- [x] Build ElegantTemplate component
- [x] Create template registry (`src/templates/index.ts`)
- [x] Create greeting suggestions data (`src/lib/greeting-suggestions.ts`)
- [x] Create template preview placeholder images
- [x] Verify all templates render at preview and full-screen sizes
- [x] Verify primaryColor prop applies correctly across templates
- [x] Verify fontFamily prop applies correctly
- [ ] TypeScript compiles clean (requires build command)

## Success Criteria

- All 5 templates render with sample card data
- Template registry exports metadata and components correctly
- `getTemplateComponent("traditional")` returns correct component
- Types cover all data structures needed for editor, viewer, and API
- Each template file under 200 LOC
- Greeting suggestions importable and filterable by language/category
- No TypeScript errors

## Risk Assessment

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| Templates look too similar | Medium | Define distinct visual identities upfront; review each against mood board |
| CSS-only decorations look flat | Medium | Use SVG elements for ornate borders; layer gradients for depth |
| Font loading inconsistency | Low | Use next/font for custom fonts or rely on system font stack |
| Template preview images missing at launch | Low | Use CSS gradient placeholders until real previews generated |

## Security Considerations

- Templates render user-provided message text: escape HTML by default (React does this)
- Image URLs from S3: validate they're from expected S3 bucket domain before rendering
- No dangerouslySetInnerHTML in templates

## Next Steps

- Phase 4 uses template selector + registry in card editor
- Phase 5 renders selected template in public card viewer
- Landing page (Phase 2) template showcase can use these registry thumbnails

## Unresolved Questions

1. Should templates support Vietnamese diacritical marks in preview? Yes -- ensure font supports Unicode.
2. Do we need separate mobile/desktop template layouts, or should one layout be responsive? Start with single responsive layout per template.
3. Should template preview images be static files or dynamically rendered? Static for speed; generate manually or via screenshot tool.
