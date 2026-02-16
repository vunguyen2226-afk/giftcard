"use client"

import Link from "next/link"
import { useTranslation } from "@/lib/i18n"

interface LandingContentProps {
  isAuthenticated: boolean
}

export function LandingContent({ isAuthenticated }: LandingContentProps) {
  const { t } = useTranslation()
  const ctaHref = isAuthenticated ? "/create" : "/login"

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="text-center space-y-8">
            {/* Logo */}
            <div className="flex justify-center">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center shadow-xl">
                <svg
                  className="h-10 w-10 text-white"
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
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white">
                {t.landing.heroTitle1}
                <span className="block bg-gradient-to-r from-rose-600 to-amber-500 bg-clip-text text-transparent">
                  {t.landing.heroTitle2}
                </span>
              </h1>
              <p className="mx-auto max-w-2xl text-xl text-gray-600 dark:text-gray-400">
                {t.landing.heroDescription}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href={ctaHref}
                className="rounded-lg bg-rose-600 px-8 py-4 text-lg font-semibold text-white
                         hover:bg-rose-700 transition-all shadow-lg hover:shadow-xl
                         inline-flex items-center gap-2"
              >
                {isAuthenticated ? t.landing.ctaCreate : t.landing.ctaGetStarted}
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
              {!isAuthenticated && (
                <Link
                  href="/login"
                  className="rounded-lg border-2 border-gray-300 dark:border-gray-700 px-8 py-4 text-lg font-semibold
                           text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                >
                  {t.common.signIn}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {t.landing.featuresTitle}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t.landing.featuresSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Feature 1 */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-800">
            <div className="h-12 w-12 rounded-lg bg-rose-100 dark:bg-rose-900/20 flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-rose-600 dark:text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {t.landing.featureTemplates}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {t.landing.featureTemplatesDesc}
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-800">
            <div className="h-12 w-12 rounded-lg bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {t.landing.featureEffects}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {t.landing.featureEffectsDesc}
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-800">
            <div className="h-12 w-12 rounded-lg bg-rose-100 dark:bg-rose-900/20 flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-rose-600 dark:text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {t.landing.featureSharing}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {t.landing.featureSharingDesc}
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-800">
            <div className="h-12 w-12 rounded-lg bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {t.landing.featureTracking}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {t.landing.featureTrackingDesc}
            </p>
          </div>
        </div>
      </div>

      {/* Template Showcase Section */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {t.landing.templatesTitle}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t.landing.templatesSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Template Preview 1 */}
          <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-red-500 to-rose-600 aspect-[4/5] shadow-lg hover:shadow-2xl transition-all">
            <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
              <div className="space-y-4">
                <p className="text-6xl">🧧</p>
                <h3 className="text-2xl font-bold text-white">{t.landing.templateLunar}</h3>
                <p className="text-white/90">{t.landing.templateLunarDesc}</p>
              </div>
            </div>
          </div>

          {/* Template Preview 2 */}
          <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 aspect-[4/5] shadow-lg hover:shadow-2xl transition-all">
            <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
              <div className="space-y-4">
                <p className="text-6xl">🎆</p>
                <h3 className="text-2xl font-bold text-white">{t.landing.templateCelebration}</h3>
                <p className="text-white/90">{t.landing.templateCelebrationDesc}</p>
              </div>
            </div>
          </div>

          {/* Template Preview 3 */}
          <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 aspect-[4/5] shadow-lg hover:shadow-2xl transition-all">
            <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
              <div className="space-y-4">
                <p className="text-6xl">🌸</p>
                <h3 className="text-2xl font-bold text-white">{t.landing.templateCherryBlossom}</h3>
                <p className="text-white/90">{t.landing.templateCherryBlossomDesc}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link
            href={ctaHref}
            className="inline-flex items-center gap-2 text-rose-600 dark:text-rose-400 font-semibold hover:gap-3 transition-all"
          >
            {t.landing.viewAllTemplates}
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 mt-16">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center">
                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">{t.common.appName}</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © 2026 {t.common.appName}. {t.landing.footer}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
