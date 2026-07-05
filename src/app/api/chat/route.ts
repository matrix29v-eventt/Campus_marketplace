import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/auth"
import { Prisma } from "@prisma/client"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payload = verifyToken(authHeader.split(" ")[1])
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const otherUserId = searchParams.get("userId")
    const productId = searchParams.get("productId")

    const where: Prisma.MessageWhereInput = {
      OR: [{ senderId: payload.userId }, { receiverId: payload.userId }],
    }
    if (otherUserId) {
      where.OR = [
        { senderId: payload.userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: payload.userId },
      ]
    }
    if (productId) {
      where.productId = productId
    }

    const messages = await prisma.message.findMany({
      where,
      include: {
        sender: { select: { id: true, name: true, image: true } },
        receiver: { select: { id: true, name: true, image: true } },
      },
      orderBy: { createdAt: "asc" },
      take: 100,
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error("Get messages error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payload = verifyToken(authHeader.split(" ")[1])
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const body = await request.json()
    const { receiverId, productId, content, image } = body

    if (!receiverId || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const message = await prisma.message.create({
      data: {
        senderId: payload.userId,
        receiverId,
        productId: productId || null,
        content,
        image: image || null,
      },
      include: {
        sender: { select: { id: true, name: true, image: true } },
        receiver: { select: { id: true, name: true, image: true } },
      },
    })

    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    console.error("Send message error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
