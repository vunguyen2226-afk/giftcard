# Phase 1: Project Setup & Infrastructure

## Context Links

- **Parent Plan**: [plan.md](./plan.md)
- **Dependencies**: None (first phase)
- **Research**: [Auth & DB Report](./research/researcher-01-auth-db-report.md)

## Overview

- **Date**: 2026-02-15
- **Priority**: P0 (blocking all other phases)
- **Status**: pending
- **Review Status**: pending
- **Description**: Install all dependencies, configure Prisma schema with Auth.js + app models, set up auth config, create project directory scaffold, and configure environment variables.

## Key Insights

- Auth.js v5 uses `next-auth@beta` package; auto-reads `AUTH_` prefixed env vars
- Google provider: just `Google` import, reads `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET`
- Prisma adapter: `@auth/prisma-adapter` with `PrismaAdapter(prisma)`
- PrismaClient needs singleton pattern for serverless (global cache)
- Aurora PostgreSQL uses standard connection string with `sslmode=require`
- Start with `connection_limit=5`, escalate to Prisma Accelerate if needed
- Next.js 16 may use `proxy.ts` instead of `middleware.ts` -- verify at implementation, fallback to middleware.ts
- Motion v11 renamed from framer-motion; import from `"motion/react"`
- **Validated**: Use JWT sessions (not database sessions) to avoid Aurora cold-start latency per request
<!-- Updated: Validation Session 1 - Changed session strategy from database to JWT -->

## Requirements

### Functional
- All dependencies installed and importable
- Prisma schema valid and migratable
- Auth.js config file exports `auth`, `signIn`, `signOut`, `handlers`
- API route catches Auth.js requests at `/api/auth/[...nextauth]`
- Route protection via middleware/proxy for `/dashboard/*` and `/create/*`
- `.env.local` template with all required vars documented
- Project directories created per spec

### Non-Functional
- PrismaClient singleton avoids connection exhaustion
- Dev server starts without errors after setup
- TypeScript compiles clean

## Architecture

```
Next.js App
├── auth.ts (root) ─── Auth.js config with Google + Prisma adapter
├── middleware.ts ──── Route protection (/dashboard/*, /create/*)
├── src/lib/prisma.ts ── PrismaClient singleton
├── prisma/schema.prisma ── Full schema
└── .env.local ──── All env vars
```

## Related Code Files

### Files to Create
- `prisma/schema.prisma`
- `src/lib/prisma.ts`
- `auth.ts` (project root, per Auth.js v5 convention)
- `src/app/api/auth/[...nextauth]/route.ts`
- `middleware.ts` (or `proxy.ts` if Next.js 16 supports it)
- `src/types/index.ts` (placeholder)
- `src/lib/s3.ts` (placeholder)
- `src/lib/email.ts` (placeholder)
- `src/lib/utils.ts` (placeholder)
- `.env.example` (update existing)

### Files to Modify
- `package.json` (add dependencies)
- `next.config.ts` (external packages for serverless if needed)

### Directories to Create
- `src/components/auth/`
- `src/components/card-editor/`
- `src/components/card-viewer/`
- `src/components/dashboard/`
- `src/components/shared/`
- `src/lib/`
- `src/types/`
- `src/templates/`
- `src/emails/`
- `prisma/`

## Implementation Steps

### 1. Install Dependencies

```bash
npm install next-auth@beta @auth/prisma-adapter prisma @prisma/client
npm install motion @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
npm install resend @react-email/components qrcode.react nanoid
npm install -D @types/qrcode.react
```

### 2. Initialize Prisma

```bash
npx prisma init --datasource-provider postgresql
```

### 3. Write Prisma Schema

Create `prisma/schema.prisma` with full schema:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Auth.js required models
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
  cards         Card[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model VerificationToken {
  identifier String
  token      String
  expires    DateTime
  @@unique([identifier, token])
}

// App models
model Card {
  id              String      @id @default(cuid())
  slug            String      @unique
  templateId      String
  senderName      String
  message         String      @db.Text
  fontFamily      String      @default("sans-serif")
  primaryColor    String      @default("#e11d48")
  backgroundMusic String?
  effect          String      @default("confetti")
  imageUrl        String?
  userId          String
  user            User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  recipients      Recipient[]
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  @@index([userId])
  @@index([slug])
}

model Recipient {
  id            String    @id @default(cuid())
  name          String
  email         String?
  personalSlug  String    @unique
  cardId        String
  card          Card      @relation(fields: [cardId], references: [id], onDelete: Cascade)
  viewCount     Int       @default(0)
  firstViewedAt DateTime?
  createdAt     DateTime  @default(now())
  @@index([cardId])
  @@index([personalSlug])
}
```

### 4. Create PrismaClient Singleton

`src/lib/prisma.ts`:
```typescript
import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } },
  log: process.env.NODE_ENV === "development" ? ["query"] : [],
})

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
```

### 5. Create Auth.js Config

`auth.ts` (project root):
```typescript
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Google],
  session: { strategy: "jwt" }, // Validated: JWT avoids Aurora cold-start latency per request
  pages: { signIn: "/login" },
})
```

### 6. Create Auth API Route

`src/app/api/auth/[...nextauth]/route.ts`:
```typescript
import { handlers } from "@/../../auth"
export const { GET, POST } = handlers
```
Note: path may need adjustment based on root `auth.ts` import alias.

### 7. Create Middleware

`middleware.ts`:
```typescript
export { auth as middleware } from "./auth"

export const config = {
  matcher: ["/dashboard/:path*", "/create/:path*"],
}
```

### 8. Create Directory Structure

Create all empty directories and placeholder files per project structure spec.

### 9. Update .env.example

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/giftcard?sslmode=require&connection_limit=5"

# Auth.js
AUTH_SECRET="generate-with-openssl-rand-base64-32"
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"
AUTH_URL="http://localhost:3000"

# AWS S3
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_REGION="ap-southeast-1"
AWS_S3_BUCKET="your-bucket-name"

# Resend
RESEND_API_KEY="re_your-api-key"
RESEND_FROM_EMAIL="cards@yourdomain.com"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 10. Update next.config.ts (if needed)

Add `serverExternalPackages` for Prisma if bundling issues occur:
```typescript
const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client"],
}
```

### 11. Run Prisma Generate + Verify

```bash
npx prisma generate
npm run dev  # verify no errors
```

## Todo List

- [ ] Install all npm dependencies
- [ ] Initialize Prisma and write full schema
- [ ] Create PrismaClient singleton (`src/lib/prisma.ts`)
- [ ] Create Auth.js config (`auth.ts`)
- [ ] Create Auth API route handler
- [ ] Create middleware for route protection
- [ ] Create all project directories
- [ ] Create placeholder lib files (s3.ts, email.ts, utils.ts)
- [ ] Create types/index.ts placeholder
- [ ] Update .env.example with all vars
- [ ] Update next.config.ts if needed
- [ ] Run `prisma generate` and verify dev server starts clean
- [ ] Verify TypeScript compiles without errors

## Success Criteria

- `npm run dev` starts without errors
- `npx prisma generate` completes successfully
- All directories exist per project structure
- Auth.js config file exports correctly
- Middleware protects dashboard/create routes
- `.env.example` documents all required vars
- TypeScript compilation clean

## Risk Assessment

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| Next.js 16 proxy.ts breaking change | Medium | Fallback to standard middleware.ts |
| Auth.js v5 beta breaking changes | Low | Pin version in package.json |
| Prisma + Aurora connection issues | Low | Start with direct URL, add connection_limit |
| Motion v11 React 19 incompatibility | Low | Already confirmed v11 supports React 19 |

## Security Considerations

- AUTH_SECRET must be cryptographically random (openssl rand -base64 32)
- Never commit .env.local to git (.gitignore already covers it)
- Database URL contains credentials -- env var only
- S3 credentials should use IAM with minimal permissions (PutObject only on specific bucket)

## Next Steps

- Phase 2 (Authentication & Layout) depends on auth.ts and middleware being configured
- Phase 3 (Templates & Types) depends on types/index.ts existing
- Must verify Prisma migration runs against Aurora before proceeding

## Unresolved Questions

1. Does Next.js 16.1.6 use `proxy.ts` or still `middleware.ts`? Need to verify at implementation.
2. Should we use `nanoid` v3 (CJS) or v5 (ESM)? Next.js 16 supports ESM -- use v5.
3. Do we need `@types/qrcode.react` or does v4 bundle types? Check at install time.
