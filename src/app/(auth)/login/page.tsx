import { auth } from "../../../../auth"
import { redirect } from "next/navigation"
import { LoginContent } from "@/components/auth/login-content"

export default async function LoginPage() {
  const session = await auth()

  // Redirect to dashboard if already authenticated
  if (session?.user) {
    redirect("/dashboard")
  }

  return <LoginContent />
}
