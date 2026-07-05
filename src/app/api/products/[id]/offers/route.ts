import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/auth"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const payload = verifyToken(authHeader.split(" ")[1])
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { id } = await params
    const product = await prisma.product.findUnique({ where: { id } })
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }
    if (!product.isAvailable) {
      return NextResponse.json({ error: "Product is not available" }, { status: 400 })
    }
    if (product.sellerId === payload.userId) {
      return NextResponse.json({ error: "Cannot make an offer on your own product" }, { status: 400 })
    }

    if (product.type !== "SELL") {
      return NextResponse.json({ error: "Can only make offers on items for sale" }, { status: 400 })
    }

    const existing = await prisma.offer.findFirst({
      where: {
        productId: id,
        buyerId: payload.userId,
        status: { in: ["PENDING", "COUNTERED"] },
      },
    })
    if (existing) {
      return NextResponse.json({ error: "You already have a pending offer on this item. Wait for a response or withdraw first." }, { status: 400 })
    }

    const body = await request.json()
    const { amount, message } = body

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid offer amount" }, { status: 400 })
    }

    const offer = await prisma.offer.create({
      data: {
        productId: id,
        buyerId: payload.userId,
        sellerId: product.sellerId,
        amount: parseFloat(amount),
        message: message || null,
      },
      include: {
        product: true,
        buyer: { select: { id: true, name: true, email: true } },
      },
    })

    return NextResponse.json(offer, { status: 201 })
  } catch (error) {
    console.error("Create offer error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const payload = verifyToken(authHeader.split(" ")[1])
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { id } = await params
    const product = await prisma.product.findUnique({ where: { id } })
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const offers = await prisma.offer.findMany({
      where: { productId: id },
      include: {
        buyer: { select: { id: true, name: true, email: true, department: true, year: true, image: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(offers)
  } catch (error) {
    console.error("Get offers error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
