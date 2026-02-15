# Phase 2: Authentication & Layout

## Context Links

- **Parent Plan**: [plan.md](./plan.md)
- **Dependencies**: [Phase 1](./phase-01-project-setup-and-infrastructure.md) (auth config, Prisma, middleware)
- **Research**: [Auth & DB Report](./research/researcher-01-auth-db-report.md)

## Overview

- **Date**: 2026-02-15
- **Priority**: P1
- **Status**: completed
- **Review Status**: pending
- **Description**: Implement Google OAuth login flow, build navbar with auth state, create dashboard layout with auth guard, and redesign landing page with hero/CTA/template showcase.

## Key Insights

- Auth.js v5 `signIn("google")` triggers OAuth flow; `signOut()` clears session
- `auth()` server function returns session with user object (name, email, image)
- Dashboard layout wraps all authenticated pages -- check session server-side
- Landing page must be attractive since it's first touchpoint; showcase card templates
- Navbar: show avatar+name when logged in, "Sign in" when not
- Geist font already configured in root layout; keep it

## Requirements

### Functional
- Google login button redirects to Google OAuth consent screen
- Successful login redirects to `/dashboard`
- Logout clears session and redirects to `/`
- Navbar shows user avatar, name, and logout button when authenticated
- Navbar shows "Sign in with Google" button when unauthenticated
- Dashboard layout requires authentication (redirect to /login if not authed)
- Landing page has hero section, feature highlights, template showcase preview, CTA

### Non-Functional
- Login flow completes in <3s
- Landing page LCP <2s
- Responsive: mobile-first design
- Dark mode support

## Architecture

```
Landing (/) ──→ Login (/login) ──→ Google OAuth ──→ Callback ──→ Dashboard
                                                                    │
Root Layout (fonts, metadata, globals)                              │
  ├── Landing Page (public)                                         │
  ├── Login Page (public)                                           │
  └── Dashboard Layout (auth guard) ────────────────────────────────┘
        ├── Dashboard (/dashboard)
        └── Create Card (/create)
```

## Related Code Files

### Files to Create
- `src/app/(auth)/login/page.tsx` -- Google login page
- `src/components/auth/google-login-button.tsx` -- Reusable login button
- `src/app/(dashboard)/layout.tsx` -- Auth-guarded layout with navbar
- `src/app/(dashboard)/dashboard/page.tsx` -- Dashboard placeholder
- `src/app/(dashboard)/create/page.tsx` -- Create card placeholder
- `src/components/shared/navbar.tsx` -- Nav with auth state

### Files to Modify
- `src/app/layout.tsx` -- Update metadata, keep Geist fonts
- `src/app/page.tsx` -- Complete redesign as landing page
- `src/app/globals.css` -- Add custom theme colors (rose/red for Tet/New Year theme)

## Implementation Steps

### 1. Create Google Login Button Component

`src/components/auth/google-login-button.tsx`:
```tsx
"use client"

import { signIn } from "next-auth/react"

export function GoogleLoginButton() {
  return (
    <button
      onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
      className="flex items-center gap-3 rounded-lg bg-white px-6 py-3
                 text-gray-700 shadow-md hover:shadow-lg transition-shadow
                 border border-gray-200"
    >
      {/* Google SVG icon */}
      <span className="font-medium">Sign in with Google</span>
    </button>
  )
}
```

### 2. Create Login Page

`src/app/(auth)/login/page.tsx`:
- Centered layout with app branding
- GoogleLoginButton component
- Brief description of app
- Redirect to /dashboard if already authenticated (check `auth()` server-side)
- Handle `error` search param from Auth.js (show toast/message)

### 3. Create Navbar Component

`src/components/shared/navbar.tsx`:
- App logo/name (link to `/`)
- When authenticated: user avatar (next/image), name, "Dashboard" link, logout button
- When unauthenticated: "Sign in" link
- Mobile: hamburger menu or simplified layout
- Use `auth()` in server component or `useSession()` in client component
- Recommend: make navbar a server component, pass session data down

### 4. Create Dashboard Layout

`src/app/(dashboard)/layout.tsx`:
```tsx
import { auth } from "@/../../auth"
import { redirect } from "next/navigation"
import { Navbar } from "@/components/shared/navbar"

export default async function DashboardLayout({ children }) {
  const session = await auth()
  if (!session?.user) redirect("/login")

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar user={session.user} />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
```

### 5. Create Dashboard Page (Placeholder)

`src/app/(dashboard)/dashboard/page.tsx`:
- Welcome message with user name
- Empty state: "No cards yet. Create your first card!" with CTA button
- Will be replaced with full card list in Phase 6

### 6. Create Card Creation Page (Placeholder)

`src/app/(dashboard)/create/page.tsx`:
- Page title "Create a Greeting Card"
- Placeholder for step wizard (Phase 4)
- Back to dashboard link

### 7. Redesign Landing Page

`src/app/page.tsx`:
- **Hero section**: Large headline ("Create Beautiful New Year Greeting Cards"), subtext, CTA button ("Get Started" -> /login or /dashboard)
- **Feature highlights**: 3-4 cards showing key features (animated templates, personalized messages, easy sharing, view tracking)
- **Template showcase**: Grid of 3-5 template previews (use placeholder images initially, replaced with real templates in Phase 3)
- **Footer**: Simple footer with app name and links
- Check auth state: if logged in, CTA goes to /create; if not, goes to /login

### 8. Update Root Layout

`src/app/layout.tsx`:
- Update metadata: title "Gift Card - Create Beautiful Greeting Cards", description
- Keep Geist fonts
- Wrap with SessionProvider if needed (for `useSession` in client components)
- Add `<SessionProvider>` from `next-auth/react` if any client component needs session

### 9. Update Global CSS

`src/app/globals.css`:
- Add Tet/New Year theme colors to @theme inline block
- Primary: rose-600 (#e11d48), accent: amber-500
- Ensure dark mode vars are set

## Todo List

- [x] Create GoogleLoginButton component
- [x] Create login page with branding and error handling
- [x] Create Navbar component with auth state
- [x] Create dashboard layout with auth guard
- [x] Create dashboard page (placeholder with empty state)
- [x] Create card creation page (placeholder)
- [x] Redesign landing page (hero, features, template showcase, footer)
- [x] Update root layout metadata
- [x] Update globals.css with theme colors
- [x] Wrap app with SessionProvider if needed
- [ ] Test login flow end-to-end (Google -> callback -> dashboard)
- [ ] Test logout flow (dashboard -> / )
- [ ] Test redirect behavior (unauthenticated -> /login)
- [ ] Verify responsive design on mobile/tablet/desktop
- [ ] Verify dark mode rendering

## Success Criteria

- Google OAuth login works end-to-end
- Authenticated users see avatar and name in navbar
- Unauthenticated access to /dashboard redirects to /login
- Landing page renders with hero, features, template previews
- All pages responsive and dark-mode compatible
- No TypeScript errors

## Risk Assessment

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| SessionProvider hydration mismatch | Medium | Use server components for auth checks where possible |
| Google OAuth redirect URI mismatch | Medium | Document exact URI in .env.example + Google Console setup |
| Route group (auth)/(dashboard) conflicts | Low | Test routing thoroughly |

## Security Considerations

- Never expose session token to client-side JavaScript
- Validate session server-side in dashboard layout (defense in depth with middleware)
- Login page should handle Auth.js error callbacks gracefully (no stack traces)
- CSRF protection handled by Auth.js automatically

## Next Steps

- Phase 3: Create actual card templates to replace landing page placeholder previews
- Phase 4: Replace create page placeholder with full step wizard editor

## Unresolved Questions

1. Should navbar be a server or client component? Server is simpler but limits interactivity (dropdown menus). Consider hybrid: server wrapper + client dropdown.
2. Do we need SessionProvider at root level, or can we rely entirely on server-side `auth()` calls? If all auth checks are server components, SessionProvider may be unnecessary.
