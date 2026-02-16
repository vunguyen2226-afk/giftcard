import { auth } from "../../../../auth"
import { NextResponse } from "next/server"
import { nanoid } from "nanoid"
import { rateLimit, createUploadKey } from "@/lib/rate-limit"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Rate limiting: 20 uploads per hour per user
    const uploadKey = createUploadKey(session.user.id)
    const rateLimitResult = rateLimit(uploadKey, 20, 60 * 60 * 1000)

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded. Maximum 20 uploads per hour.",
          resetAt: rateLimitResult.resetAt
        },
        { status: 429 }
      )
    }

    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: JPG, PNG, WEBP, GIF." },
        { status: 400 }
      )
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5MB." },
        { status: 400 }
      )
    }

    const ext = file.name.toLowerCase().split(".").pop() || "jpg"
    const fileName = `${nanoid(10)}.${ext}`

    // Save to public/uploads/
    const uploadDir = join(process.cwd(), "public", "uploads")
    await mkdir(uploadDir, { recursive: true })

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(join(uploadDir, fileName), buffer)

    const publicUrl = `/uploads/${fileName}`
    return NextResponse.json({ publicUrl })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
