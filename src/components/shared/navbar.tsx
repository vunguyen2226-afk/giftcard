"use client"

import Link from "next/link"
import Image from "next/image"
import { signOut, useSession } from "next-auth/react"
import { useState } from "react"
import { useTranslation } from "@/lib/i18n"
import { LanguageSwitcher } from "./language-switcher"

export function Navbar() {
  const { data: session } = useSession()
  const { t } = useTranslation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center">
                <svg
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                {t.common.appName}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-6">
            {session?.user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-gray-700 dark:text-gray-300 hover:text-rose-600 dark:hover:text-rose-400 font-medium transition-colors"
                >
                  {t.nav.dashboard}
                </Link>
                <Link
                  href="/create"
                  className="text-gray-700 dark:text-gray-300 hover:text-rose-600 dark:hover:text-rose-400 font-medium transition-colors"
                >
                  {t.nav.createCard}
                </Link>

                {/* User Profile */}
                <div className="flex items-center gap-3 border-l border-gray-200 dark:border-gray-700 pl-6">
                  <div className="flex items-center gap-2">
                    {session.user.image && (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    )}
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {session.user.name}
                    </span>
                  </div>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300
                             hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    {t.common.signOut}
                  </button>
                </div>
              </>
            ) : (
              <Link
                href="/login"
                className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white
                         hover:bg-rose-700 transition-colors"
              >
                {t.common.signIn}
              </Link>
            )}
            <LanguageSwitcher />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg
              className="h-6 w-6 text-gray-700 dark:text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {session?.user ? (
              <>
                <Link
                  href="/dashboard"
                  className="block px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300
                           hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t.nav.dashboard}
                </Link>
                <Link
                  href="/create"
                  className="block px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300
                           hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t.nav.createCard}
                </Link>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                  <div className="flex items-center gap-2 px-4 py-2">
                    {session.user.image && (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    )}
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {session.user.name}
                    </span>
                  </div>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full text-left px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300
                             hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    {t.common.signOut}
                  </button>
                </div>
              </>
            ) : (
              <Link
                href="/login"
                className="block px-4 py-2 rounded-lg bg-rose-600 text-white text-center font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.common.signIn}
              </Link>
            )}
            <div className="px-4 pt-2">
              <LanguageSwitcher />
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
