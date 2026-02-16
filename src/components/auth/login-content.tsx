"use client"

import { useTranslation } from "@/lib/i18n"
import { GoogleLoginButton } from "@/components/auth/google-login-button"

export function LoginContent() {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-50 to-amber-50 dark:from-gray-950 dark:to-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6">
          {/* App Branding */}
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center">
                <svg
                  className="h-8 w-8 text-white"
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t.common.appName}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t.login.subtitle}
            </p>
          </div>

          {/* Login Button */}
          <div className="flex flex-col items-center space-y-4 pt-4">
            <GoogleLoginButton />
          </div>
        </div>

        {/* Footer Note */}
        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}
