import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

// Strip sslmode from URL to prevent it from overriding our ssl config
const connectionString = process.env.DATABASE_URL!.replace(/[?&]sslmode=[^&]*/g, "")

const pool = new Pool({
  connectionString,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
})

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  adapter: new PrismaPg(pool),
  log: process.env.NODE_ENV === "development" ? ["query"] : [],
})

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
