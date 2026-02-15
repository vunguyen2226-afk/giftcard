# Code Review: New Year Greeting Card App - Full Codebase

**Reviewer**: code-reviewer
**Date**: 2026-02-16
**Scope**: Full codebase across 7 implementation phases
**Files Reviewed**: 67 source files (~3,800 LOC)

---

## Overall Assessment

Solid implementation for a v1 product. Auth, validation, ownership checks, and rate limiting are in place across API routes. Component architecture is well-organized with clear separation of concerns. Several security and reliability issues need attention before production deployment, detailed below.

---

## Critical Issues

### C1. XSS via Unsanitized `primaryColor` in OG Image and Templates [CRITICAL]

**File**: `D:\Claudekit\Projects\Gift card\src\app\card\[slug]\opengraph-image.tsx` (lines 62, 78, 91)
**File**: `D:\Claudekit\Projects\Gift card\src\templates\traditional.tsx` (line 70)

The `primaryColor` field from the database is interpolated directly into inline `style` attributes without validation. A malicious user could store a crafted value like `red; position:absolute; background-image:url(javascript:...)` via the card creation API.

While the `PUT /api/cards/[id]` route sets `sanitizedData.primaryColor = body.primaryColor` without any format validation, it only trims text via `sanitizeText` for `senderName` and `message`. `primaryColor`, `fontFamily`, `templateId`, `effect` all pass through unvalidated.

**Impact**: Style injection, potential phishing via OG images, UI defacement.

**Fix**: Validate `primaryColor` is a valid hex color (`/^#[0-9A-Fa-f]{6}$/`), validate `templateId` against known IDs, validate `effect` against enum, validate `fontFamily` against allowed values. Add to `validateCardInput()`:

```typescript
if (data.primaryColor && !/^#[0-9A-Fa-f]{6}$/.test(data.primaryColor)) {
  errors.primaryColor = "Invalid color format"
}
const VALID_EFFECTS = ["fireworks", "snow", "cherry_blossom", "confetti"]
if (data.effect && !VALID_EFFECTS.includes(data.effect)) {
  errors.effect = "Invalid effect"
}
```

### C2. No `images.remotePatterns` in `next.config.ts` [CRITICAL]

**File**: `D:\Claudekit\Projects\Gift card\next.config.ts`

`next/image` is used for user profile images (`session.user.image` in `navbar.tsx`) and template thumbnails, but `next.config.ts` has no `images` configuration. Google profile images (`lh3.googleusercontent.com`) and S3 images will cause runtime errors or be blocked.

Additionally, the `traditional.tsx` template uses raw `<img>` tags for user-uploaded images (`imageUrl`), which bypasses Next.js image optimization entirely.

**Fix**:
```typescript
const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", "pg"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "*.s3.*.amazonaws.com" },
    ],
  },
};
```

### C3. JWT Session Missing `user.id` Propagation [CRITICAL]

**File**: `D:\Claudekit\Projects\Gift card\auth.ts`

With `strategy: "jwt"`, the JWT token does not include `user.id` by default in Auth.js v5. The `session.user.id` used extensively in API routes (`if (!session?.user?.id)`) may be `undefined`, causing every authenticated request to return 401.

**Fix**: Add callbacks to propagate user ID:
```typescript
callbacks: {
  jwt({ token, user }) {
    if (user) token.id = user.id
    return token
  },
  session({ session, token }) {
    if (token.id) session.user.id = token.id as string
    return session
  },
},
```

---

## High Priority

### H1. In-Memory Rate Limiter Ineffective in Serverless [HIGH]

**File**: `D:\Claudekit\Projects\Gift card\src\lib\rate-limit.ts`

The rate limiter uses an in-memory `Map`. In Vercel's serverless model, each function invocation may use a different instance, making the rate limiter essentially useless. The `setInterval` cleanup (line 127) also creates a leak -- it keeps the module alive and never clears.

**Impact**: Rate limiting is decorative only. Abuse of upload, email, and view-tracking endpoints is unmitigated.

**Recommendation**: Use Vercel KV / Upstash Redis for production. The current implementation is fine for development only; add a comment and a TODO for production hardening.

### H2. No CSRF Protection on State-Changing Public Endpoint [HIGH]

**File**: `D:\Claudekit\Projects\Gift card\src\app\api\view\[slug]\track\route.ts`

The view tracking POST endpoint has no authentication and no CSRF token. While rate-limited by IP (ineffectively, per H1), an attacker could inflate view counts via automated requests.

**Impact**: View count manipulation, inaccurate analytics.

**Fix**: Consider using a signed token or fingerprint approach for view tracking.

### H3. S3 Presigned URL Returns Public URL Without Bucket Policy Verification [HIGH]

**File**: `D:\Claudekit\Projects\Gift card\src\lib\s3.ts` (line 22-24)

`getPublicUrl()` constructs a direct S3 URL assuming the bucket has public read access. If the bucket policy doesn't allow public reads, uploaded images will 403. No validation that the upload actually succeeded before returning `publicUrl`.

**Impact**: Broken images if bucket policy is misconfigured. Race condition between presigned upload and URL usage.

**Fix**: Either use CloudFront with signed URLs, or verify upload completion before persisting the URL.

### H4. `fileSize` Validation is Optional and Client-Trusted [HIGH]

**File**: `D:\Claudekit\Projects\Gift card\src\app\api\upload\route.ts` (line 29)
**File**: `D:\Claudekit\Projects\Gift card\src\lib\validation.ts` (line 108)

`fileSize` is sent from the client in the JSON body and checked with `if (fileSize && fileSize > maxSize)`. The actual file is uploaded directly to S3 via presigned URL, so the server never validates the real file size. The presigned URL's `PutObjectCommand` doesn't include `ContentLength` constraints.

**Fix**: Add `ContentLength` to the presigned URL constraints, or add a `Content-Length` condition:
```typescript
const command = new PutObjectCommand({
  Bucket: process.env.AWS_S3_BUCKET!,
  Key: key,
  ContentType: contentType,
  ContentLength: fileSize, // Enforce size
})
```

### H5. Missing `try-catch` in Stats API Route [HIGH]

**File**: `D:\Claudekit\Projects\Gift card\src\app\api\cards\[id]\stats\route.ts`

This route handler has no `try-catch` block (unlike all other API routes). An unhandled Prisma error will crash with a 500 and potentially leak error details.

**Fix**: Wrap in `try-catch` consistent with other routes.

---

## Medium Priority

### M1. `Resend` Client Initialized with Placeholder Key [MEDIUM]

**File**: `D:\Claudekit\Projects\Gift card\src\lib\email.ts` (line 6)

```typescript
export const resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder_key_for_build")
```

This creates a Resend client with a fake key at module load time. If `RESEND_API_KEY` is set at runtime (but not build time), the client still uses the placeholder. The runtime check on line 21 mitigates this partially, but the client object itself is misconfigured.

**Fix**: Lazy-initialize the client or check env at function call time.

### M2. `card-list-item.tsx` Accesses `window.location.origin` at Render Time [MEDIUM]

**File**: `D:\Claudekit\Projects\Gift card\src\components\dashboard\card-list-item.tsx` (line 41)

```typescript
const cardUrl = `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/card/${firstRecipientSlug}`
```

This runs on every render. If SSR runs this component, `window` is undefined and it will crash. While the component is `"use client"`, it could still error during hydration if NEXT_PUBLIC_APP_URL is not set.

**Fix**: Use `useMemo` with a check or default to empty string during SSR.

### M3. `EditorState` Uses Parallel Arrays for Recipients [MEDIUM]

**File**: `D:\Claudekit\Projects\Gift card\src\app\(dashboard)\create\page.tsx` (lines 60-82)

`recipientNames` and `recipientEmails` are maintained as two parallel arrays. This is fragile -- index misalignment bugs are easy to introduce (e.g., if `REMOVE_RECIPIENT` filter has an off-by-one).

**Fix**: Use a single array of `{ name: string; email?: string }` objects instead.

### M4. No Input Length Limit on Client-Side `senderName` Input [MEDIUM]

**File**: `D:\Claudekit\Projects\Gift card\src\components\card-editor\message-editor.tsx`

The sender name input has no `maxLength` attribute. While the server validates 100 char max, the user gets no feedback until submit. The message textarea has a character counter but no `maxLength` attribute either -- user can type beyond 500 and sees red counter but can still proceed.

**Fix**: Add `maxLength={100}` to sender name input, `maxLength={500}` to textarea, and disable Next button when message exceeds limit (already done via `canProceedFromStep`).

### M5. `useEffect` Dependency Warning in `CardStatsModal` [MEDIUM]

**File**: `D:\Claudekit\Projects\Gift card\src\components\dashboard\card-stats-modal.tsx` (line 31-35)

```typescript
useEffect(() => {
  if (isOpen && cardId) {
    fetchStats()
  }
}, [isOpen, cardId])
```

`fetchStats` is not in the dependency array. This is a React lint warning. The function is defined inside the component, so it changes on every render.

**Fix**: Either include `fetchStats` in deps with `useCallback`, or inline the fetch logic.

### M6. Confetti Effect Doesn't Repeat [MEDIUM]

**File**: `D:\Claudekit\Projects\Gift card\src\components\card-viewer\confetti-effect.tsx`

The confetti animation runs once and fades to `opacity: 0`. Fireworks repeat infinitely (`repeat: Infinity`). This inconsistency means confetti viewers see a brief effect then a blank overlay.

**Fix**: Add `repeat: Infinity` and `repeatDelay` to confetti, or remove the effect entirely after animation completes.

### M7. Dashboard Page Returns `null` for Unauthenticated Users [MEDIUM]

**File**: `D:\Claudekit\Projects\Gift card\src\app\(dashboard)\dashboard\page.tsx` (line 9)

```typescript
if (!session?.user?.id) {
  return null
}
```

The layout already redirects unauthenticated users, but if `session.user.id` is undefined (related to C3), authenticated users get a blank page.

**Fix**: Use `redirect("/login")` instead of `return null`.

---

## Low Priority

### L1. Duplicate SVG Icons Across Components [LOW]

Check, close, gift-box SVGs are duplicated across ~10 components instead of using a shared icon component or lucide-react consistently.

### L2. `GREETING_SUGGESTIONS` Import Unused Variable [LOW]

**File**: `D:\Claudekit\Projects\Gift card\src\components\card-editor\message-editor.tsx` (line 2)

`GREETING_SUGGESTIONS` is imported but only `getGreetingsByLanguage` is used.

### L3. `MusicPlayer` has `onEnded` with `loop` [LOW]

**File**: `D:\Claudekit\Projects\Gift card\src\components\card-viewer\music-player.tsx` (lines 42-43)

The audio element has `loop` prop, so `onEnded` never fires. The `onEnded={() => setIsPlaying(false)}` handler is dead code.

### L4. No Loading States for Card Viewer Page [LOW]

**File**: `D:\Claudekit\Projects\Gift card\src\app\card\[slug]\page.tsx`

The `generateMetadata` and default export both query the database independently for the same recipient. This results in two identical Prisma queries per page load.

**Fix**: Use React cache or consolidate the query.

### L5. Template Image Uses `<img>` Instead of `next/image` [LOW]

**File**: `D:\Claudekit\Projects\Gift card\src\templates\traditional.tsx` (line 89)

User-uploaded images use raw `<img>` tags, missing optimization, lazy loading, and CORS protections that `next/image` provides.

---

## Positive Observations

- **Auth ownership checks** are consistent across all protected API routes (card CRUD, stats, email, recipients)
- **Input validation** is centralized in `D:\Claudekit\Projects\Gift card\src\lib\validation.ts` with clear interfaces
- **Text sanitization** is applied to user-facing text fields (senderName, message, recipient names)
- **Rate limiting infrastructure** exists for upload, email, and view tracking endpoints
- **Proper use of Prisma cascade deletes** for cards -> recipients cleanup
- **Good TypeScript type definitions** in `D:\Claudekit\Projects\Gift card\src\types\index.ts`
- **Responsive design** with desktop 2-column and mobile single-column layouts in the editor
- **Good UX patterns**: step wizard, live preview, bulk recipient add, email masking in stats
- **Error boundaries** at both app and dashboard level
- **OG image generation** for social sharing with proper metadata
- **Clean component structure**: editor, viewer, dashboard, shared are well-separated

---

## Recommended Actions (Priority Order)

1. **[CRITICAL]** Fix JWT `user.id` propagation in `auth.ts` -- without this, all API routes return 401 for authenticated users
2. **[CRITICAL]** Add `images.remotePatterns` to `next.config.ts` for Google profile pics and S3
3. **[CRITICAL]** Validate `primaryColor`, `templateId`, `effect`, `fontFamily` against allowed values in both create and update routes
4. **[HIGH]** Add `try-catch` to stats route
5. **[HIGH]** Add `ContentLength` constraint to S3 presigned URL
6. **[HIGH]** Document that in-memory rate limiter needs Redis for production
7. **[MEDIUM]** Fix Resend client lazy initialization
8. **[MEDIUM]** Refactor parallel arrays to object array for recipients in editor state
9. **[MEDIUM]** Add `maxLength` attributes to form inputs

---

## Metrics

| Metric | Value |
|--------|-------|
| Files reviewed | 67 |
| LOC (approx) | ~3,800 |
| Critical issues | 3 |
| High issues | 5 |
| Medium issues | 7 |
| Low issues | 5 |
| Test coverage | 0% (no tests found) |
| Type coverage | Good (TypeScript throughout, interfaces defined) |

---

## Confirmed Asset Issues

- **Music files MISSING**: `/public/music/` directory does not exist. The music selector references `festive.mp3`, `calm.mp3`, `playful.mp3`, `traditional.mp3` -- all will 404. Users who select background music will hear nothing.
- **Template thumbnails OK**: All 5 preview PNGs exist in `/public/templates/`.
- **OG image MISSING**: `/public/og-image.png` referenced in root layout metadata does not exist.
- **No Prisma migrations**: Only `schema.prisma` found, no `/prisma/migrations/` directory. Database setup requires `prisma db push` or generating migrations first.

## Unresolved Questions

1. Is the S3 bucket configured for public read access? The `getPublicUrl()` function assumes it is.
2. The `next-auth` version is `5.0.0-beta.30` -- is this stable enough for production? Auth.js v5 has had breaking changes between beta releases.
3. What is the deployment target? The in-memory rate limiter only works for single-process deployments (not Vercel serverless).
