import { auth } from "../../../../auth"
import { NextResponse } from "next/server"
import { generatePresignedUploadUrl, getPublicUrl } from "@/lib/s3"
import { nanoid } from "nanoid"
import { validateFileUpload, validateFileExtension } from "@/lib/validation"
import { rateLimit, createUploadKey } from "@/lib/rate-limit"

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Rate limiting: 20 uploads per hour per user
    const uploadKey = createUploadKey(session.user.id)
    const rateLimitResult = rateLimit(uploadKey, 20, 60 * 60 * 1000) // 1 hour

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded. Maximum 20 uploads per hour.",
          resetAt: rateLimitResult.resetAt
        },
        { status: 429 }
      )
    }

    const { contentType, fileName, fileSize } = await request.json()

    if (!contentType || !fileName) {
      return NextResponse.json(
        { error: "Missing contentType or fileName" },
        { status: 400 }
      )
    }

    // Validate file upload
    const validation = validateFileUpload(contentType, fileSize)
    if (!validation.valid) {
      return NextResponse.json(
        { error: "Validation failed", errors: validation.errors },
        { status: 400 }
      )
    }

    // Validate file extension matches content type
    if (!validateFileExtension(fileName, contentType)) {
      return NextResponse.json(
        { error: "File extension does not match content type" },
        { status: 400 }
      )
    }

    const ext = fileName.toLowerCase().split(".").pop()
    const key = `cards/${session.user.id}/${nanoid(10)}.${ext}`
    const uploadUrl = await generatePresignedUploadUrl(key, contentType)
    const publicUrl = getPublicUrl(key)

    return NextResponse.json({ uploadUrl, publicUrl, key })
  } catch (error) {
    console.error("Error generating upload URL:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
