---
title: New Year Greeting Card Web App
description: Full-stack greeting card creator with Google auth, animated templates, S3 uploads, email delivery, QR sharing, and public card viewer
status: completed
priority: P1
effort: 5-7 days
branch: master
tags: [next.js, auth.js, prisma, aurora, s3, resend, motion, greeting-card]
created: 2026-02-15
---

# New Year Greeting Card App - Implementation Plan

## Overview

Build a web app where users sign in with Google, create animated New Year greeting cards with customizable templates/effects/music, then share via unique URLs, email, social media, or QR code. Recipients view cards with envelope-opening animation and visual effects without auth.

## Tech Stack

Next.js 16.1.6 | React 19 | TypeScript 5 | Tailwind CSS v4 | Motion (Framer Motion) | Auth.js v5 | Prisma + Aurora PostgreSQL | AWS S3 | Resend | qrcode.react

## Phases

| # | Phase | Status | File |
|---|-------|--------|------|
| 1 | Project Setup & Infrastructure | completed | [phase-01](./phase-01-project-setup-and-infrastructure.md) |
| 2 | Authentication & Layout | completed | [phase-02](./phase-02-authentication-and-layout.md) |
| 3 | Card Templates & Types | completed | [phase-03](./phase-03-card-templates-and-types.md) |
| 4 | Card Editor | completed | [phase-04](./phase-04-card-editor.md) |
| 5 | Card Viewer & Sharing | completed | [phase-05](./phase-05-card-viewer-and-sharing.md) |
| 6 | Dashboard & Management | completed | [phase-06](./phase-06-dashboard-and-management.md) |
| 7 | Polish & Testing | completed | [phase-07](./phase-07-polish-and-testing.md) |

## Post-Launch Enhancements

| Feature | Status | Report |
|---------|--------|--------|
| Internationalization (i18n) & Vietnamese Features | completed | [i18n-report](./reports/fullstack-developer-260216-1407-i18n-vietnamese-features-implementation.md) |

## Dependencies

- Phase 2 depends on Phase 1 (auth config, Prisma)
- Phase 3 depends on Phase 1 (types foundation)
- Phase 4 depends on Phases 2+3 (auth, templates, types)
- Phase 5 depends on Phase 4 (cards must exist to view)
- Phase 6 depends on Phases 4+5 (CRUD, viewer exists)
- Phase 7 depends on all prior phases

## Key Decisions

- Auth.js v5 with **JWT sessions** (avoids Aurora cold-start latency on every request)
- Direct S3 presigned URL uploads (no server proxy)
- Motion v11 for React 19 compat; all animation components "use client"
- nanoid 10-char for slug generation (personalSlug per recipient)
- Resend + React Email for delivery
- OG images: Node.js runtime (not edge) so Prisma works directly
- Envelope: auto-play after 2s delay, click to skip
- Music: muted by default, click to play
- Editor state: useReducer for multi-step wizard
- **i18n**: React Context pattern (no external library) for bilingual EN/VI support
- **Vietnamese features**: 6 cultural SVG decorations + 3 traditional Tet songs

## Research Reports

- [Auth & DB Research](./research/researcher-01-auth-db-report.md)
- [Frontend & Email Research](./research/researcher-02-frontend-email-report.md)

## Database

2 app models (Card, Recipient) + 4 Auth.js models (User, Account, Session, VerificationToken). See Phase 1 for full schema.

## API Surface

13 endpoints total: Auth.js catch-all, 6 card CRUD/management, 2 public viewer, 1 upload. See Phase 1 for route map.

## Validation Log

### Session 1 — 2026-02-15
**Trigger:** Initial plan creation validation
**Questions asked:** 7

#### Questions & Answers

1. **[Architecture]** The plan uses Auth.js v5 database sessions (stores sessions in PostgreSQL). Aurora Serverless v2 has cold-start latency which could slow every auth check. Which session strategy do you prefer?
   - Options: JWT sessions (Recommended) | Database sessions | JWT + DB user lookup
   - **Answer:** JWT sessions (Recommended)
   - **Rationale:** Avoids DB hit on every request. Critical for serverless/Aurora where cold starts add latency. Trade-off: can't revoke sessions instantly, acceptable for MVP.

2. **[Architecture]** The plan assumes edge runtime for OG image generation (opengraph-image.tsx), but Prisma doesn't work on edge. How should we handle dynamic OG images?
   - Options: Node.js runtime OG (Recommended) | Fetch internal API | Static fallback
   - **Answer:** Node.js runtime OG (Recommended)
   - **Rationale:** Simplest approach. Prisma works directly in Node.js runtime. Slightly slower than edge but avoids extra API hop complexity.

3. **[Architecture]** Card viewer URL structure: should /card/[slug] use the recipient's personalSlug or the card's slug?
   - Options: personalSlug (Recommended) | Card slug + query param | Card slug only
   - **Answer:** personalSlug (Recommended)
   - **Rationale:** Enables per-recipient personalization and individual view tracking. Each person gets unique URL with their name on the card.

4. **[Scope]** The plan includes background music with a toggle. Browser autoplay policies require user interaction first. How should music behave?
   - Options: Muted + click to play (Recommended) | Auto-attempt + graceful fallback | Skip music for MVP
   - **Answer:** Muted + click to play (Recommended)
   - **Rationale:** Most reliable cross-browser. No autoplay policy issues. Clear UX with visible toggle.

5. **[UX]** Envelope opening animation: should it auto-play or require user click to open?
   - Options: Auto-play after 2s delay (Recommended) | Click to open | No envelope, direct reveal
   - **Answer:** Auto-play after 2s delay (Recommended)
   - **Rationale:** Builds anticipation. Click-to-skip available for impatient users. 2s gives enough time to see the envelope.

6. **[Architecture]** The plan uses nanoid for slug generation (10 chars). What about slug readability vs collision resistance?
   - Options: nanoid 10 chars (Recommended) | nanoid 8 chars | Human-readable words
   - **Answer:** nanoid 10 chars (Recommended)
   - **Rationale:** ~1 trillion combinations, excellent collision resistance. Short enough for URLs. URL-safe by default.

7. **[Architecture]** For the card editor state management: useReducer vs React state (useState) vs form library?
   - Options: useReducer (Recommended) | Multiple useState | React Hook Form
   - **Answer:** useReducer (Recommended)
   - **Rationale:** Clean for complex multi-field state with step wizard. Actions like SET_TEMPLATE, SET_MESSAGE keep state changes explicit and traceable.

#### Confirmed Decisions
- **Session strategy**: JWT — avoids Aurora cold-start latency per request
- **OG image runtime**: Node.js — Prisma works directly, simplest approach
- **URL structure**: personalSlug per recipient — enables personalization + tracking
- **Music UX**: Muted + click to play — reliable cross-browser
- **Envelope**: Auto-play 2s delay — builds anticipation
- **Slug format**: nanoid 10 chars — good balance of length vs collision resistance
- **Editor state**: useReducer — clean for multi-step wizard

#### Action Items
- [x] Update plan.md Key Decisions section with validated choices
- [ ] Update Phase 1: Change session strategy from "database" to "jwt" in auth.ts config
- [ ] Update Phase 5: Change OG image runtime from "edge" to "nodejs"
- [ ] Update Phase 5: Confirm envelope auto-play after 2s, music muted by default

#### Impact on Phases
- Phase 1: Auth.js config must use `session: { strategy: "jwt" }` instead of `"database"`. Session/VerificationToken models still needed for Prisma adapter but sessions won't be stored in DB.
- Phase 5: OG image file must use `export const runtime = "nodejs"` (not "edge"). Prisma queries work directly.
- Phase 5: Envelope animation auto-plays after 2s. Music starts muted with visible toggle.
- Phase 4: Editor state managed with useReducer pattern (already suggested in plan, now confirmed).
