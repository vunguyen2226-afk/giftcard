# Research Report: Auth.js v5 + Prisma + Aurora PostgreSQL + S3

**Date**: 2026-02-15 | **Researcher**: researcher-01

---

## 1. Auth.js v5 with Next.js 16 App Router

### Package & Installation
- Package: `next-auth@beta` (still beta as of Feb 2026; the `@auth/nextjs` name is not yet canonical)
- Install: `npm install next-auth@beta @auth/prisma-adapter prisma @prisma/client`
- Auth.js v5 auto-detects env vars prefixed `AUTH_` (e.g., `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`)

### Core Config (`auth.ts` at project root)
```ts
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google, // auto-reads AUTH_GOOGLE_ID & AUTH_GOOGLE_SECRET
  ],
  session: { strategy: "database" }, // or "jwt"
})
```

### Route Handler (`app/api/auth/[...nextauth]/route.ts`)
```ts
import { handlers } from "@/auth"
export const { GET, POST } = handlers
```

### Middleware / Proxy (Next.js 16)
Next.js 16 renames `middleware.ts` to `proxy.ts`:
```ts
export { auth as proxy } from "@/auth"
```
For Next.js 15, use `export { auth as middleware } from "@/auth"`.

Add `matcher` in config to protect routes:
```ts
export const config = { matcher: ["/dashboard/:path*", "/api/cards/:path*"] }
```

### Session Strategy
- **JWT** (default): No DB hits per request; stateless. Good for serverless.
- **Database sessions**: Stores session in DB via adapter; enables revocation. Requires `adapter` + `session: { strategy: "database" }`.
- Recommendation for this app: **database sessions** since we already have Prisma adapter and need user-linked data.

---

## 2. Prisma with AWS Aurora PostgreSQL

### Connection String Format
```
postgresql://USER:PASSWORD@your-cluster.cluster-xxxx.region.rds.amazonaws.com:5432/dbname?schema=public&sslmode=require
```
Aurora Serverless v2 uses standard PostgreSQL protocol on port 5432. Always use `sslmode=require`.

### Connection Pooling Options
| Option | Notes |
|--------|-------|
| **RDS Proxy** | AWS-native; but Prisma uses prepared statements so benefits limited |
| **Prisma Accelerate** | Managed pooling + caching; easiest for serverless Next.js |
| **PgBouncer** | Self-hosted; set `pgbouncer=true` in connection string |
| **Direct + low limit** | `?connection_limit=5` for serverless; simplest starting point |

Recommendation: Start with **direct connection + `connection_limit=5`**. Move to Prisma Accelerate if connection exhaustion occurs under load.

### Prisma Client Singleton (`lib/prisma.ts`)
```ts
import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
```

### Schema (User/Card/Recipient + Auth.js required models)
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
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
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
  @@unique([identifier, token])
}

// App-specific models
model Card {
  id          String      @id @default(cuid())
  userId      String
  title       String
  message     String
  imageUrl    String?
  templateId  String?
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  user        User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  recipients  Recipient[]
}

model Recipient {
  id        String   @id @default(cuid())
  cardId    String
  name      String
  email     String
  sentAt    DateTime?
  viewedAt  DateTime?
  card      Card     @relation(fields: [cardId], references: [id], onDelete: Cascade)
}
```

---

## 3. AWS S3 Presigned URL Upload

### Packages
```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

### Server-side: Generate Presigned URL (`app/api/upload/route.ts`)
```ts
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { auth } from "@/auth"

const s3 = new S3Client({ region: process.env.AWS_REGION })

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { filename, contentType } = await req.json()
  const key = `uploads/${session.user.id}/${Date.now()}-${filename}`

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  })

  const url = await getSignedUrl(s3, command, { expiresIn: 600 })
  return Response.json({ url, key })
}
```

### Client-side: Direct Upload to S3
```ts
async function uploadFile(file: File) {
  const res = await fetch("/api/upload", {
    method: "POST",
    body: JSON.stringify({ filename: file.name, contentType: file.type }),
  })
  const { url, key } = await res.json()

  await fetch(url, { method: "PUT", body: file, headers: { "Content-Type": file.type } })
  return key // store in DB as imageUrl
}
```

### S3 Bucket CORS Config
```json
[{
  "AllowedHeaders": ["*"],
  "AllowedMethods": ["PUT"],
  "AllowedOrigins": ["https://yourdomain.com"],
  "ExposeHeaders": ["ETag"],
  "MaxAgeSeconds": 3600
}]
```

---

## Unresolved Questions

1. **Next.js 16 proxy.ts**: Is `proxy.ts` stable in Next.js 16, or still experimental? Need to verify before committing to this pattern vs `middleware.ts`.
2. **Auth.js v5 stable release**: Package is still `next-auth@beta`; should we pin a specific beta version for stability?
3. **Aurora Serverless v2 cold start**: How does cold start latency affect auth flows with database sessions? May need to benchmark JWT vs DB sessions.
4. **S3 bucket policy**: Need to define IAM role/policy for the Next.js server (Lambda or ECS) to generate presigned URLs.
