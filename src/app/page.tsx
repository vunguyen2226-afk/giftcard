import { auth } from "../../auth"
import { LandingContent } from "@/components/landing/landing-content"

export default async function LandingPage() {
  const session = await auth()
  return <LandingContent isAuthenticated={!!session?.user} />
}
