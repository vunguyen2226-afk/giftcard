import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/shared/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Gift Card - Create Beautiful Greeting Cards",
    template: "%s | Gift Card",
  },
  description: "Create and share stunning New Year greeting cards with animations, music, and personalized messages. Design beautiful digital cards for Tet, holidays, and special occasions.",
  keywords: [
    "greeting card",
    "new year card",
    "Tet card",
    "digital card",
    "animated greeting card",
    "personalized card",
    "holiday card",
    "e-card"
  ],
  authors: [{ name: "Gift Card Team" }],
  creator: "Gift Card",
  publisher: "Gift Card",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL?.trim() || "https://giftcard.example.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Gift Card",
    title: "Gift Card - Create Beautiful Greeting Cards",
    description: "Create and share stunning greeting cards with animations and personalized messages",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Gift Card - Create Beautiful Greeting Cards",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gift Card - Create Beautiful Greeting Cards",
    description: "Create and share stunning greeting cards with animations and personalized messages",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Dancing+Script&family=Kalam&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
