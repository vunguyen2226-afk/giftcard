# Phase 4: Card Editor

## Context Links

- **Parent Plan**: [plan.md](./plan.md)
- **Dependencies**: [Phase 2](./phase-02-authentication-and-layout.md) (auth, dashboard layout), [Phase 3](./phase-03-card-templates-and-types.md) (templates, types)
- **Research**: [Frontend & Email Report](./research/researcher-02-frontend-email-report.md), [Auth & DB Report](./research/researcher-01-auth-db-report.md)

## Overview

- **Date**: 2026-02-15
- **Priority**: P1
- **Status**: completed
- **Review Status**: pending
- **Description**: Build multi-step card creation wizard with template selection, message editing, font/color/effect customization, S3 image upload, music selection, realtime preview, and recipient management. Wire up POST /api/cards and POST /api/upload endpoints.

## Key Insights

- Step wizard pattern: 4 steps (Template -> Customize -> Recipients -> Preview & Send)
- Realtime preview: desktop shows 2-column (editor left, preview right); mobile uses tab toggle
- S3 presigned URLs: server generates PUT URL, client uploads directly -- avoids server memory/bandwidth
- EditorState managed with **useReducer** (validated); actions like SET_TEMPLATE, SET_MESSAGE keep state changes explicit
<!-- Updated: Validation Session 1 - Confirmed useReducer for editor state management -->
- Auto-fill sender name from session user name
- nanoid for slug generation: 10-char alphanumeric, collision-resistant for expected volume
- Keep each editor sub-component under 200 LOC; main create page orchestrates state

## Requirements

### Functional
- 4-step wizard with progress indicator and back/next navigation
- **Step 1 - Template**: Grid of template cards; click to select; shows name + preview
- **Step 2 - Customize**: Message textarea with greeting suggestions dropdown, font picker (5 options), color picker (presets + custom hex), effect selector (4 effects), image uploader (S3), music selector (presets)
- **Step 3 - Recipients**: Add recipient name + optional email; bulk add; remove individual recipients
- **Step 4 - Preview & Send**: Full card preview with selected template, confirm details, "Create Card" button
- Realtime preview updates as user edits (Step 2)
- POST /api/cards creates card + recipients in DB, returns card with slugs
- POST /api/upload returns S3 presigned PUT URL
- After card creation, redirect to dashboard or share page
- Sender name auto-fills from session user name (editable)

### Non-Functional
- Image upload max 5MB, types: jpg/png/webp/gif
- Preview re-renders debounced (300ms) on text input
- Form validates required fields before allowing next step
- Responsive layout: 2-col desktop, stacked/tabbed mobile

## Architecture

```
/create (page.tsx) -- "use client", orchestrates EditorState
├── StepIndicator (progress bar showing current step)
├── Step 1: TemplateSelector
├── Step 2: Customization Panel
│   ├── MessageEditor (textarea + suggestions)
│   ├── FontPicker (radio group / select)
│   ├── ColorPicker (preset swatches + hex input)
│   ├── EffectSelector (visual cards for each effect)
│   ├── ImageUploader (drag-drop + file input -> S3)
│   └── MusicSelector (preset list with preview play)
├── Step 3: RecipientManager (add/remove list)
├── Step 4: CardPreview (full template render + confirm)
└── Sidebar: LivePreview (always visible on desktop, tab on mobile)

API:
POST /api/cards         -> Validate, create Card + Recipients, return data
POST /api/upload        -> Generate S3 presigned PUT URL, return URL
```

## Related Code Files

### Files to Create
- `src/app/(dashboard)/create/page.tsx` -- Replace placeholder from Phase 2
- `src/components/card-editor/step-indicator.tsx`
- `src/components/card-editor/template-selector.tsx`
- `src/components/card-editor/message-editor.tsx`
- `src/components/card-editor/font-picker.tsx`
- `src/components/card-editor/color-picker.tsx`
- `src/components/card-editor/effect-selector.tsx`
- `src/components/card-editor/image-uploader.tsx`
- `src/components/card-editor/music-selector.tsx`
- `src/components/card-editor/recipient-manager.tsx`
- `src/components/card-editor/card-preview.tsx`
- `src/app/api/cards/route.ts`
- `src/app/api/upload/route.ts`
- `src/lib/s3.ts` -- Replace placeholder with real S3 client

### Files to Modify
- `src/types/index.ts` -- Add any missing editor-specific types if needed

## Implementation Steps

### 1. Implement S3 Utility

`src/lib/s3.ts`:

```typescript
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export async function generatePresignedUploadUrl(key: string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: key,
    ContentType: contentType,
  })
  const url = await getSignedUrl(s3, command, { expiresIn: 300 }) // 5 min
  return url
}

export function getPublicUrl(key: string) {
  return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
}
```

### 2. Create Upload API Route

`src/app/api/upload/route.ts`:

```typescript
import { auth } from "@/../../auth"
import { NextResponse } from "next/server"
import { generatePresignedUploadUrl, getPublicUrl } from "@/lib/s3"
import { nanoid } from "nanoid"

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { contentType, fileName } = await request.json()

  // Validate content type
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"]
  if (!allowed.includes(contentType)) {
    return NextResponse.json({ error: "Invalid file type" }, { status: 400 })
  }

  const ext = fileName.split(".").pop()
  const key = `cards/${session.user.id}/${nanoid(10)}.${ext}`
  const uploadUrl = await generatePresignedUploadUrl(key, contentType)
  const publicUrl = getPublicUrl(key)

  return NextResponse.json({ uploadUrl, publicUrl, key })
}
```

### 3. Create Cards API Route

`src/app/api/cards/route.ts`:

```typescript
// GET: List user's cards (with recipient counts)
// POST: Create new card + recipients

// POST body:
// { templateId, senderName, message, fontFamily, primaryColor, effect, imageUrl?, backgroundMusic?, recipients: [{ name, email? }] }

// Steps:
// 1. Validate session
// 2. Validate input (required fields, string lengths)
// 3. Generate card slug (nanoid 10)
// 4. Generate personalSlug for each recipient (nanoid 10)
// 5. prisma.card.create({ data: { ...cardData, slug, recipients: { create: [...] } } })
// 6. Return created card with recipients
```

### 4. Build Step Indicator

`src/components/card-editor/step-indicator.tsx`:
- 4 steps shown horizontally with labels
- Current step highlighted, completed steps show checkmark
- Clickable to jump to completed steps (not forward to uncompleted)

### 5. Build Template Selector (Step 1)

`src/components/card-editor/template-selector.tsx`:
- Import TEMPLATES from registry
- Grid of template cards (2 cols mobile, 3 cols desktop)
- Each card: thumbnail image, name, description, category badge
- Selected state: ring border with primaryColor
- On select: update editorState.templateId, set default color/font from template metadata

### 6. Build Message Editor

`src/components/card-editor/message-editor.tsx`:
- Textarea with character count (max 500 chars)
- "Suggestions" dropdown/popover with GREETING_SUGGESTIONS
- Filter suggestions by language (en/vi toggle)
- Click suggestion to insert into textarea
- Auto-fill sender name from session (editable text input)

### 7. Build Font Picker

`src/components/card-editor/font-picker.tsx`:
- 5 font options displayed as styled preview text
- Radio group or segmented control
- Each option shows font name + sample text in that font
- Fonts: Sans-serif, Serif, Cursive (script), Monospace, Handwriting

### 8. Build Color Picker

`src/components/card-editor/color-picker.tsx`:
- Row of 8-10 preset color swatches (rose, red, amber, emerald, sky, violet, pink, neutral)
- Selected swatch shows checkmark
- Custom hex input field below presets
- Live preview of selected color on a small sample element

### 9. Build Effect Selector

`src/components/card-editor/effect-selector.tsx`:
- 4 effect options as visual cards
- Each card: icon/emoji representation, name, brief description
- Fireworks, Snow, Cherry Blossom, Confetti
- Selected state: highlighted border
- Optional: small CSS animation preview on hover

### 10. Build Image Uploader

`src/components/card-editor/image-uploader.tsx`:
- Drag-and-drop zone + file input button
- Shows upload progress (percentage)
- Flow: select file -> validate (type, 5MB max) -> POST /api/upload -> get presigned URL -> PUT to S3 -> store publicUrl in editorState
- Preview uploaded image with remove button
- Error states: file too large, invalid type, upload failed

### 11. Build Music Selector

`src/components/card-editor/music-selector.tsx`:
- List of 4-5 preset music options (festive, calm, playful, traditional, none)
- Each option: name, play/pause preview button (HTML5 Audio)
- Selected state highlighted
- "No music" option at top
- Music files stored in public/music/ (royalty-free short loops)

### 12. Build Recipient Manager (Step 3)

`src/components/card-editor/recipient-manager.tsx`:
- Input row: name (required) + email (optional) + "Add" button
- List of added recipients with remove button
- Minimum 1 recipient required to proceed
- Bulk paste: textarea mode to paste multiple names (one per line)
- Show count: "X recipients added"

### 13. Build Card Preview (Step 4)

`src/components/card-editor/card-preview.tsx`:
- Renders selected template component with current editorState data
- Shows first recipient's name as preview recipient
- Summary panel: template name, effect, # recipients, has music, has image
- "Create Card" submit button (triggers API call)
- Loading state during API call
- Success: show success message + redirect to share/dashboard

### 14. Build Create Page (Orchestrator)

`src/app/(dashboard)/create/page.tsx`:
- "use client" -- manages EditorState with useReducer
- Renders StepIndicator + current step component + LivePreview sidebar
- Desktop: 2-column grid (editor 60%, preview 40%)
- Mobile: single column with "Preview" tab toggle
- Step navigation: validate current step before allowing next
- On final submit: POST to /api/cards, handle response

### 15. Add LivePreview Sidebar

Part of create page layout:
- Renders the selected template with current editorState in real-time
- Scaled down (transform: scale) to fit sidebar width
- Debounced updates on text input (300ms)
- Shows placeholder state when no template selected

## Todo List

- [x] Implement `src/lib/s3.ts` with presigned URL generation
- [x] Create POST /api/upload route
- [x] Create GET + POST /api/cards route
- [x] Build StepIndicator component
- [x] Build TemplateSelector (Step 1)
- [x] Build MessageEditor with greeting suggestions
- [x] Build FontPicker
- [x] Build ColorPicker with presets + custom hex
- [x] Build EffectSelector
- [x] Build ImageUploader with S3 presigned URL flow
- [x] Build MusicSelector with audio preview
- [x] Build RecipientManager (Step 3)
- [x] Build CardPreview + submit flow (Step 4)
- [x] Build create page orchestrator with EditorState
- [x] Implement 2-column desktop / tabbed mobile layout
- [x] Wire up LivePreview sidebar with debounced updates
- [ ] Test full create flow: template -> customize -> recipients -> submit
- [ ] Test S3 upload flow end-to-end
- [ ] Verify API creates card + recipients in DB correctly
- [ ] Verify slug uniqueness

## Success Criteria

- Full 4-step wizard navigable forward and backward
- Template selection updates preview in realtime
- Message, font, color, effect changes reflect in preview immediately
- Image upload to S3 works (presigned URL PUT)
- Card creation writes correct data to DB
- Each recipient gets unique personalSlug
- Responsive: 2-col desktop, stacked mobile
- All editor components under 200 LOC each
- No TypeScript errors

## Risk Assessment

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| S3 CORS blocks client-side upload | High | Must configure S3 bucket CORS policy; document in Phase 1 env setup |
| Presigned URL expires before upload completes | Low | 5-min expiry is generous; show progress bar |
| Large state object causes re-render perf issues | Medium | Use useReducer; memoize sub-components with React.memo |
| Music files increase bundle/load time | Low | Audio files lazy-loaded only when play clicked |
| nanoid slug collision | Very Low | 10-char nanoid has ~1 trillion combinations |

## Security Considerations

- Validate session on all API routes (cards, upload)
- S3 presigned URLs scoped to specific key + content type
- Image upload: validate file type server-side (not just client)
- Card creation: sanitize message text (React auto-escapes, but validate length)
- Rate limit card creation (e.g., max 50 cards per user per day) -- implement in Phase 7
- Recipient email validation if provided (basic format check)

## Next Steps

- Phase 5 needs cards to exist in DB to build the public viewer
- Phase 6 needs card CRUD endpoints for dashboard management
- Music files (public/music/) need to be sourced (royalty-free)

## Unresolved Questions

1. Should we use `useReducer` or `useState` for EditorState? useReducer is cleaner for complex state with many fields -- recommend useReducer.
2. Music files: where to source royalty-free short loops? Options: freesound.org, pixabay audio, or generate with AI. Decide before implementation.
3. Should card creation be a single API call (card + recipients together) or separate calls? Single call is simpler and atomic -- recommend single call with Prisma nested create.
4. Max recipients per card? Set a reasonable limit (e.g., 50) to prevent abuse.
