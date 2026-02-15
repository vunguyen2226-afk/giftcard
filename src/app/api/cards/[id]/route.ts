import { auth } from "../../../../../auth"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sanitizeText, validateEnumField } from "@/lib/validation"

type RouteContext = {
  params: Promise<{ id: string }>
}

// PUT: Update card
export async function PUT(request: Request, context: RouteContext) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await context.params
    const body = await request.json()

    // Verify card ownership
    const existingCard = await prisma.card.findUnique({
      where: { id },
      select: { userId: true },
    })

    if (!existingCard) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 })
    }

    if (existingCard.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Validate and sanitize inputs
    if (body.message && body.message.length > 500) {
      return NextResponse.json(
        { error: "Message exceeds maximum length of 500 characters" },
        { status: 400 }
      )
    }

    if (body.senderName && body.senderName.length > 100) {
      return NextResponse.json(
        { error: "Sender name exceeds maximum length of 100 characters" },
        { status: 400 }
      )
    }

    // Validate enum fields
    for (const field of ["templateId", "effect", "fontFamily", "primaryColor"] as const) {
      if (body[field] !== undefined) {
        const err = validateEnumField(field, body[field])
        if (err) {
          return NextResponse.json({ error: `${field}: ${err}` }, { status: 400 })
        }
      }
    }

    // Sanitize text inputs
    const sanitizedData: Record<string, any> = {}

    if (body.templateId !== undefined) sanitizedData.templateId = body.templateId
    if (body.senderName !== undefined) sanitizedData.senderName = sanitizeText(body.senderName, 100)
    if (body.message !== undefined) sanitizedData.message = sanitizeText(body.message, 500)
    if (body.fontFamily !== undefined) sanitizedData.fontFamily = body.fontFamily
    if (body.primaryColor !== undefined) sanitizedData.primaryColor = body.primaryColor
    if (body.effect !== undefined) sanitizedData.effect = body.effect
    if (body.imageUrl !== undefined) sanitizedData.imageUrl = body.imageUrl
    if (body.backgroundMusic !== undefined) sanitizedData.backgroundMusic = body.backgroundMusic

    // Update card
    const updatedCard = await prisma.card.update({
      where: { id },
      data: sanitizedData,
      include: {
        recipients: true,
      },
    })

    return NextResponse.json({ card: updatedCard })
  } catch (error) {
    console.error("Error updating card:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// DELETE: Delete card
export async function DELETE(request: Request, context: RouteContext) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await context.params

    // Verify card ownership
    const existingCard = await prisma.card.findUnique({
      where: { id },
      select: { userId: true },
    })

    if (!existingCard) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 })
    }

    if (existingCard.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Delete card (cascade deletes recipients)
    await prisma.card.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting card:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
