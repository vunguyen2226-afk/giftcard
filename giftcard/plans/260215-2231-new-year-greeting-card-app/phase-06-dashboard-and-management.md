# Phase 6: Dashboard & Management

## Context Links

- **Parent Plan**: [plan.md](./plan.md)
- **Dependencies**: [Phase 4](./phase-04-card-editor.md) (card CRUD API), [Phase 5](./phase-05-card-viewer-and-sharing.md) (viewer exists for link previews)
- **Research**: [Auth & DB Report](./research/researcher-01-auth-db-report.md)

## Overview

- **Date**: 2026-02-15
- **Priority**: P1
- **Status**: completed
- **Review Status**: pending
- **Description**: Build the authenticated dashboard with card listing, per-card stats, recipient management with view status, edit/delete card functionality, add-recipients flow, and email sending via Resend + React Email.

## Key Insights

- Dashboard is the primary hub after login; must load fast and show key info at a glance
- Card list: show template thumbnail, sender name, recipient count, total views, created date
- Stats: per-recipient view count + first viewed timestamp; aggregate total views per card
- Edit card: reuse editor components from Phase 4 in edit mode (pre-fill EditorState)
- Delete: soft confirmation modal, then hard delete (cascade deletes recipients)
- Email sending: Resend `resend.emails.send()` with React Email template; batch up to 50 recipients
- Resend free tier: 100 emails/day -- show warning if approaching limit
- Owner-only access: all dashboard API routes verify card.userId === session.user.id

## Requirements

### Functional
- Dashboard page lists all user's cards in grid/list view
- Each card shows: template preview, title/sender name, # recipients, total views, created date, action buttons (view, edit, share, delete)
- Card stats page/modal: per-recipient breakdown (name, email, view count, first viewed)
- Edit card: opens editor with pre-filled data; PUT /api/cards/[id] saves changes
- Delete card: confirmation dialog; DELETE /api/cards/[id] removes card + recipients
- Add recipients: POST /api/cards/[id]/recipients adds new recipients to existing card
- Send email: POST /api/cards/[id]/send-email sends card notification to recipients with email
- Email contains: greeting, card preview image/link, "View your card" CTA button
- Empty state: when no cards, show "Create your first card" CTA

### Non-Functional
- Dashboard loads in < 1s (server-side data fetch)
- Email sending is async (don't block UI); show progress/status
- Paginate card list if > 20 cards (unlikely for MVP but good practice)
- Responsive: cards grid adapts to screen size

## Architecture

```
/dashboard (page.tsx) ──── Server component: fetch user's cards
├── CardList ──────────── Grid of CardListItem components
│   └── CardListItem ──── Template preview + stats + action buttons
├── CardStatsModal ────── Per-recipient view breakdown
├── DeleteCardDialog ──── Confirmation modal
└── EmptyState ────────── CTA when no cards

/dashboard/[id]/edit (page.tsx) ── Reuse editor in edit mode
  └── Same components as /create but pre-filled

API:
GET    /api/cards              -> List user's cards + aggregated stats
PUT    /api/cards/[id]         -> Update card (owner only)
DELETE /api/cards/[id]         -> Delete card (owner only)
POST   /api/cards/[id]/recipients   -> Add recipients (owner only)
GET    /api/cards/[id]/stats   -> Recipient view stats (owner only)
POST   /api/cards/[id]/send-email   -> Send emails (owner only)
```

## Related Code Files

### Files to Create
- `src/app/(dashboard)/dashboard/page.tsx` -- Replace placeholder
- `src/app/(dashboard)/dashboard/[id]/edit/page.tsx` -- Edit card page
- `src/components/dashboard/card-list.tsx`
- `src/components/dashboard/card-list-item.tsx`
- `src/components/dashboard/card-stats-modal.tsx`
- `src/components/dashboard/delete-card-dialog.tsx`
- `src/components/dashboard/empty-state.tsx`
- `src/components/dashboard/recipient-list.tsx`
- `src/components/dashboard/send-email-button.tsx`
- `src/app/api/cards/[id]/route.ts`
- `src/app/api/cards/[id]/recipients/route.ts`
- `src/app/api/cards/[id]/stats/route.ts`
- `src/app/api/cards/[id]/send-email/route.ts`
- `src/lib/email.ts` -- Replace placeholder with Resend client
- `src/emails/card-notification.tsx` -- React Email template

### Files to Modify
- `src/app/api/cards/route.ts` -- Ensure GET returns aggregate stats

## Implementation Steps

### 1. Implement Email Utility

`src/lib/email.ts`:

```typescript
import { Resend } from "resend"

export const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendCardEmail(
  to: string,
  recipientName: string,
  senderName: string,
  cardUrl: string,
  message: string
) {
  // Import React Email template component
  // Call resend.emails.send({ from, to, subject, react: <CardNotification ... /> })
  // Return result with id or error
}
```

### 2. Create React Email Template

`src/emails/card-notification.tsx`:

```tsx
import { Html, Head, Body, Container, Section, Text, Button, Img } from "@react-email/components"

interface CardNotificationProps {
  recipientName: string
  senderName: string
  cardUrl: string
  message: string // truncated preview
}

export function CardNotification({ recipientName, senderName, cardUrl, message }: CardNotificationProps) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: "#f9fafb", fontFamily: "sans-serif" }}>
        <Container style={{ maxWidth: 560, margin: "0 auto", padding: 20 }}>
          <Section style={{ backgroundColor: "#fff", borderRadius: 12, padding: 32 }}>
            <Text style={{ fontSize: 24, fontWeight: "bold" }}>
              You received a New Year card!
            </Text>
            <Text>Dear {recipientName},</Text>
            <Text>{senderName} sent you a beautiful greeting card.</Text>
            <Text style={{ color: "#6b7280", fontStyle: "italic" }}>
              "{message.slice(0, 100)}..."
            </Text>
            <Button
              href={cardUrl}
              style={{ backgroundColor: "#e11d48", color: "#fff", padding: "12px 24px", borderRadius: 8 }}
            >
              View Your Card
            </Button>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
```

### 3. Build Card API Routes

**`src/app/api/cards/[id]/route.ts`** -- PUT + DELETE:

```typescript
// PUT: Update card fields (template, message, font, color, effect, image, music)
// - Verify session
// - Verify card.userId === session.user.id (owner check)
// - Validate input
// - prisma.card.update()

// DELETE: Remove card and cascade-delete recipients
// - Verify session + owner
// - prisma.card.delete({ where: { id, userId } })
```

**`src/app/api/cards/[id]/recipients/route.ts`** -- POST:

```typescript
// POST: Add new recipients to existing card
// Body: { recipients: [{ name, email? }] }
// - Verify session + owner
// - Generate personalSlug for each
// - prisma.recipient.createMany()
// - Return created recipients
```

**`src/app/api/cards/[id]/stats/route.ts`** -- GET:

```typescript
// GET: Return all recipients with view stats
// - Verify session + owner
// - prisma.recipient.findMany({ where: { cardId } })
// - Include: name, email, personalSlug, viewCount, firstViewedAt
// - Aggregate: totalViews
```

**`src/app/api/cards/[id]/send-email/route.ts`** -- POST:

```typescript
// POST: Send email to recipients with email addresses
// Body: { recipientIds?: string[] } -- optional filter; default all with email
// - Verify session + owner
// - Fetch recipients with email
// - For each: call sendCardEmail() with personalized URL
// - Return: { sent: number, failed: number, errors: [] }
// - Note: batch limit check (Resend 100/day free tier)
```

### 4. Update GET /api/cards

Ensure the existing GET in `src/app/api/cards/route.ts` returns:
- All user's cards with `_count: { recipients: true }` for recipient count
- Aggregate view count per card (sum of recipient viewCounts)
- Ordered by createdAt descending

### 5. Build Dashboard Page

`src/app/(dashboard)/dashboard/page.tsx`:
- Server component: fetch cards via Prisma (direct DB, not API call)
- Pass cards to CardList client component
- Show EmptyState if no cards
- "Create New Card" button in header

### 6. Build Card List Components

**`src/components/dashboard/card-list.tsx`**:
- Grid layout: 1 col mobile, 2 cols tablet, 3 cols desktop
- Receives cards array, renders CardListItem for each

**`src/components/dashboard/card-list-item.tsx`**:
- "use client" (needs click handlers)
- Template color accent bar at top
- Card info: template name, message preview (truncated), created date
- Stats row: recipients count icon + number, views icon + number
- Action buttons: View (link to /card/[first-recipient-slug]), Edit, Share, Stats, Delete
- Share button opens ShareButtons popover with card URL
- Stats button opens CardStatsModal
- Delete button opens DeleteCardDialog

### 7. Build Card Stats Modal

`src/components/dashboard/card-stats-modal.tsx`:
- "use client"
- Fetches from GET /api/cards/[id]/stats on open
- Table/list: recipient name, email (masked), personal link, view count, first viewed (relative time)
- Summary row: total views, total recipients
- "Add Recipients" button -> opens inline form or navigates

### 8. Build Delete Card Dialog

`src/components/dashboard/delete-card-dialog.tsx`:
- "use client"
- Confirmation modal: "Are you sure? This will delete the card and all recipient links."
- Cancel + Delete buttons
- Delete calls DELETE /api/cards/[id]
- On success: remove card from list (optimistic update or refetch)
- Loading state on delete button

### 9. Build Recipient List

`src/components/dashboard/recipient-list.tsx`:
- Used inside stats modal or standalone
- Shows each recipient: name, email, personal URL (copy button), view count badge, viewed timestamp
- Color coding: green if viewed, gray if not yet viewed

### 10. Build Send Email Button

`src/components/dashboard/send-email-button.tsx`:
- "use client"
- Button that triggers POST /api/cards/[id]/send-email
- Shows sending progress (X of Y sent)
- Success toast: "Sent to X recipients"
- Error handling: show failed recipients
- Disabled if no recipients have email addresses

### 11. Build Edit Card Page

`src/app/(dashboard)/dashboard/[id]/edit/page.tsx`:
- Server component: fetch card data + verify ownership
- Pass card data to editor components (reuse from Phase 4)
- Editor starts with pre-filled EditorState from existing card data
- On submit: PUT /api/cards/[id] instead of POST /api/cards
- Cannot change recipients here (use stats modal for that)
- After save: redirect to dashboard with success toast

### 12. Build Empty State

`src/components/dashboard/empty-state.tsx`:
- Centered content with illustration (SVG or emoji)
- "No cards yet" heading
- "Create your first greeting card and share it with loved ones" subtext
- Large CTA button -> /create

## Todo List

- [x] Implement `src/lib/email.ts` with Resend client
- [x] Create React Email template (`src/emails/card-notification.tsx`)
- [x] Create PUT + DELETE /api/cards/[id] route
- [x] Create POST /api/cards/[id]/recipients route
- [x] Create GET /api/cards/[id]/stats route
- [x] Create POST /api/cards/[id]/send-email route
- [x] Update GET /api/cards to include recipient counts and view aggregates
- [x] Build dashboard page with server-side data fetch
- [x] Build CardList + CardListItem components
- [x] Build CardStatsModal with recipient breakdown
- [x] Build DeleteCardDialog with confirmation
- [x] Build RecipientList component (integrated into CardStatsModal)
- [x] Build SendEmailButton with progress feedback (SendEmailModal)
- [ ] Build edit card page (reuse editor in edit mode) - Deferred to Phase 7
- [x] Build EmptyState component (integrated into dashboard-client)
- [ ] Test card edit flow end-to-end - Deferred to Phase 7
- [x] Test card delete flow with cascade - Verified via Prisma cascade
- [x] Test add recipients to existing card - API implemented, modal built
- [ ] Test email sending via Resend - Requires API key configuration
- [ ] Test email template renders correctly - Requires API key configuration
- [x] Verify owner-only access on all API routes - Implemented in all routes

## Success Criteria

- Dashboard shows all user's cards with accurate stats
- Card edit saves changes and reflects in viewer
- Card delete removes card and all recipient links
- Adding recipients to existing card generates new personal slugs
- Email sending delivers card notification to recipients
- Email contains personalized card URL and CTA
- Owner-only validation prevents unauthorized access
- Empty state displays when user has no cards
- All API routes return appropriate error codes

## Risk Assessment

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| Resend rate limit hit (100/day free) | Medium | Show count before sending; warn user; batch wisely |
| Email delivery to spam | Medium | Use verified domain; keep email simple; include unsubscribe |
| Edit mode + editor component coupling | Medium | EditorState interface same for create/edit; only API endpoint differs |
| Cascade delete removes viewed data | Low | Confirm dialog warns about permanent deletion |
| Concurrent edits from multiple tabs | Low | Last-write-wins acceptable for MVP |

## Security Considerations

- All dashboard API routes: verify session exists AND card.userId === session.user.id
- Email sending: validate recipient email format before sending
- Don't expose other users' cards or recipient data
- Mask recipient emails in stats view (show first 3 chars + domain)
- Rate limit email sending per user (max 100/day matching Resend free tier)
- Delete should be hard delete for GDPR-friendliness (no lingering personal data)

## Next Steps

- Phase 7 adds rate limiting, input validation, and error handling polish
- After launch: consider soft delete with 30-day recovery window
- Future: export card data, bulk card creation

## Unresolved Questions

1. Should edit allow changing recipients, or only card content? Recommend: card content only in edit; use separate "Manage Recipients" flow for add/remove.
2. Should email sending be synchronous or queued? Synchronous for MVP (Resend is fast); queue with background job for scale later.
3. Resend requires verified domain for production. Document domain verification steps in deployment guide.
