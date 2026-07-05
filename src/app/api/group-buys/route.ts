import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/auth"

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
    const { productId, minParticipants, maxParticipants, discountPercent, dealPrice, expiresAt } = body

    if (!productId || !minParticipants || !discountPercent || !dealPrice) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const product = await prisma.product.findUnique({ where: { id: productId } })
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }
    if (product.sellerId !== payload.userId) {
      return NextResponse.json({ error: "You can only create group buys for your own products" }, { status: 403 })
    }

    if (dealPrice >= product.price!) {
      return NextResponse.json({ error: "Deal price must be lower than the original price" }, { status: 400 })
    }

    const groupBuy = await prisma.groupBuy.create({
      data: {
        productId,
        organizerId: payload.userId,
        minParticipants,
        maxParticipants: maxParticipants || null,
        discountPercent,
        dealPrice,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        participants: {
          create: { userId: payload.userId },
        },
      },
      include: {
        product: true,
        participants: { include: { user: { select: { id: true, name: true, email: true } } } },
        organizer: { select: { id: true, name: true, email: true } },
      },
    })

    return NextResponse.json(groupBuy, { status: 201 })
  } catch (error) {
    console.error("Create group buy error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") || "ACTIVE"
    const productId = searchParams.get("productId")

    const where: Record<string, unknown> = { status }
    if (productId) where.productId = productId

    const groupBuys = await prisma.groupBuy.findMany({
      where,
      include: {
        product: {
          include: {
            seller: { select: { id: true, name: true, email: true, department: true, year: true, image: true } },
          },
        },
        organizer: { select: { id: true, name: true, email: true } },
        _count: { select: { participants: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(groupBuys)
  } catch (error) {
    console.error("Get group buys error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
