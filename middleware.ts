import NextAuth from "next-auth"
import { authConfig } from "./auth.config"

// Use auth config without Prisma adapter for Edge Middleware
const { auth } = NextAuth(authConfig)
export default auth

export const config = {
  matcher: ["/dashboard/:path*", "/create/:path*"],
}
