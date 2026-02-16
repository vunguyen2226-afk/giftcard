"use client"

import { SessionProvider } from "next-auth/react"
import { LanguageProvider } from "@/lib/i18n"
import { ReactNode } from "react"

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <LanguageProvider>{children}</LanguageProvider>
    </SessionProvider>
  )
}
