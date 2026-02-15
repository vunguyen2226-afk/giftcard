import { auth } from "../../../auth"
import { redirect } from "next/navigation"
import { Navbar } from "@/components/shared/navbar"
import { Providers } from "@/components/shared/providers"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  // Auth guard: redirect to login if not authenticated
  if (!session?.user) {
    redirect("/login")
  }

  return (
    <Providers>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </Providers>
  )
}
