# Research Report: Framer Motion, Resend Email, QR Code, OG Images for Next.js 16

## 1. Motion (formerly Framer Motion) with React 19 + Next.js 16

### Package Status
- **Rebranded**: Framer Motion is now **Motion** (independent from Framer). Package: `motion`
- **Install**: `npm install motion`
- **Import change**: `import { motion, AnimatePresence } from "motion/react"` (not `framer-motion`)
- `framer-motion` npm still exists as legacy; new projects should use `motion`
- Motion v11+ supports React 19 and concurrent rendering

### Animation Patterns for Greeting Cards

```tsx
"use client"; // Required - animations need client components

import { motion, AnimatePresence } from "motion/react";

// Envelope opening - scale + rotate on Y axis
<motion.div
  initial={{ rotateX: 0 }}
  animate={{ rotateX: -180 }}
  transition={{ duration: 1.2, ease: "easeInOut" }}
  style={{ transformOrigin: "top", perspective: 800 }}
/>

// Fireworks/particles - use staggerChildren + random positions
<motion.div
  initial={{ scale: 0, opacity: 1 }}
  animate={{ scale: [0, 1.5], opacity: [1, 0], y: [0, -200] }}
  transition={{ duration: 1.5, ease: "easeOut" }}
/>

// Snow falling - infinite repeat with random x drift
<motion.div
  animate={{ y: [0, 800], x: [0, 30, -20, 10] }}
  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
/>

// Cherry blossom - combine rotation + falling + swaying
<motion.div
  animate={{ y: [0, 600], x: [0, 50, -30, 20], rotate: [0, 360] }}
  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
/>

// Confetti - array of colored divs with staggered random trajectories
// Use variants with staggerChildren for burst effect
```

### Performance Best Practices
- Use `will-change: transform` and GPU-accelerated properties (transform, opacity only)
- Limit simultaneous animated elements to ~50 for particles/confetti
- Use `useReducedMotion()` hook for accessibility
- Wrap animations in `"use client"` components; keep data-fetching in server components
- Use `AnimatePresence` with `mode="wait"` for page transitions
- Use `layout` prop sparingly; expensive for many elements

### SSR / App Router
- All `motion.*` components must be in `"use client"` files
- Server components can import client animation wrappers
- `AnimatePresence` works with App Router route changes via `usePathname()`

## 2. Resend + React Email

### Setup
```bash
npm install resend @react-email/components
```

### API Route (App Router)
```ts
// app/api/send-notification/route.ts
import { Resend } from "resend";
import { CardNotificationEmail } from "@/emails/card-notification";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { to, senderName, cardUrl, message } = await req.json();

  const { data, error } = await resend.emails.send({
    from: "Greeting Cards <noreply@yourdomain.com>",
    to: [to],
    subject: `${senderName} sent you a greeting card!`,
    react: CardNotificationEmail({ senderName, cardUrl, message }),
  });

  if (error) return Response.json({ error }, { status: 400 });
  return Response.json({ id: data?.id });
}
```

### Email Template Pattern
```tsx
// emails/card-notification.tsx
import { Html, Head, Body, Container, Text, Button, Img } from "@react-email/components";

export function CardNotificationEmail({ senderName, cardUrl, message }) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: "sans-serif", background: "#f9f9f9" }}>
        <Container style={{ maxWidth: 480, margin: "0 auto", padding: 20 }}>
          <Text>{senderName} sent you a greeting card!</Text>
          <Text>{message}</Text>
          <Button href={cardUrl} style={{ background: "#e11d48", color: "#fff", padding: "12px 24px" }}>
            View Your Card
          </Button>
        </Container>
      </Body>
    </Html>
  );
}
```

### Free Tier Limits
- 100 emails/day, 3,000 emails/month
- Single sender domain (need DNS verification for custom domain, or use `onboarding@resend.dev` for testing)

## 3. QR Code Generation

### Package: `qrcode.react`
```bash
npm install qrcode.react
```
- Latest v4.x; exports `QRCodeSVG` and `QRCodeCanvas`
- Works with React 19 (peer dep is `react ^16.8 || ^17 || ^18 || ^19`)

### Usage Pattern
```tsx
"use client";
import { QRCodeSVG, QRCodeCanvas } from "qrcode.react";

// Display QR code
<QRCodeSVG value={`https://yourapp.com/cards/${cardId}`} size={200} level="H" />

// Download QR as image
function downloadQR() {
  const canvas = document.querySelector("canvas");
  const url = canvas?.toDataURL("image/png");
  const link = document.createElement("a");
  link.href = url!;
  link.download = "greeting-card-qr.png";
  link.click();
}

// Use QRCodeCanvas when download is needed (canvas supports toDataURL)
<QRCodeCanvas value={cardUrl} size={256} level="H" id="qr-canvas" />
```

## 4. Open Graph / Social Sharing

### Dynamic OG Image (Next.js App Router)
```tsx
// app/cards/[id]/opengraph-image.tsx
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({ params }: { params: { id: string } }) {
  const card = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/cards/${params.id}`).then(r => r.json());

  return new ImageResponse(
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", width: "100%", height: "100%",
      background: "linear-gradient(135deg, #e11d48, #f97316)", color: "#fff" }}>
      <div style={{ fontSize: 60 }}>You received a greeting card!</div>
      <div style={{ fontSize: 32, marginTop: 20 }}>From: {card.senderName}</div>
    </div>,
    { ...size }
  );
}
```

### Meta Tags (layout or page)
```tsx
// app/cards/[id]/layout.tsx
export async function generateMetadata({ params }) {
  const card = await getCard(params.id);
  return {
    title: `Greeting Card from ${card.senderName}`,
    description: card.message?.substring(0, 150),
    openGraph: {
      title: `Greeting Card from ${card.senderName}`,
      description: "Open to view your greeting card!",
      type: "website",
      // OG image auto-detected from opengraph-image.tsx
    },
    other: {
      "og:image:width": "1200",
      "og:image:height": "630",
    },
  };
}
```

### Platform Preview Notes
- **Facebook/Messenger**: Uses `og:title`, `og:description`, `og:image`. Caches aggressively (use FB Sharing Debugger to refresh).
- **Zalo**: Follows OG protocol; supports `og:image`, `og:title`, `og:description`.
- **WhatsApp**: Reads OG tags; image must be >300x200px, URL must be HTTPS.
- All platforms: OG image should be 1200x630px. HTTPS required. Use absolute URLs.

## Unresolved Questions
- `motion` v11 exact sub-version tested with Next.js 16 specifically (Next.js 16 is very new; v15 confirmed working)
- `qrcode.react` v4 explicit React 19 peer dep confirmation (v3.x supports up to React 18; v4 likely supports 19 but verify at install time)
- Resend free tier may change; verify current limits at signup
