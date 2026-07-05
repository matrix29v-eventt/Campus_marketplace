import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/auth"

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

    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [{ buyerId: payload.userId }, { sellerId: payload.userId }],
      },
      include: {
        product: true,
        buyer: { select: { id: true, name: true, email: true, image: true } },
        seller: { select: { id: true, name: true, email: true, image: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(transactions)
  } catch (error) {
    console.error("Get transactions error:", error)
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
    const { productId, type, exchangeProductId, rentalStart, rentalEnd, amount } = body

    const product = await prisma.product.findUnique({ where: { id: productId } })
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }
    if (!product.isAvailable) {
      return NextResponse.json({ error: "Product is no longer available" }, { status: 400 })
    }
    if (product.sellerId === payload.userId) {
      return NextResponse.json({ error: "Cannot transact with yourself" }, { status: 400 })
    }

    const transaction = await prisma.transaction.create({
      data: {
        productId,
        buyerId: payload.userId,
        sellerId: product.sellerId,
        type: type || product.type,
        exchangeProductId: exchangeProductId || null,
        rentalStart: rentalStart ? new Date(rentalStart) : null,
        rentalEnd: rentalEnd ? new Date(rentalEnd) : null,
        amount: amount || product.price,
        status: "PENDING",
      },
      include: {
        product: true,
        buyer: { select: { id: true, name: true, email: true } },
        seller: { select: { id: true, name: true, email: true } },
      },
    })

    return NextResponse.json(transaction, { status: 201 })
  } catch (error) {
    console.error("Create transaction error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
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
    const { transactionId, status } = body

    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: { product: true },
    })
    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    const updated = await prisma.transaction.update({
      where: { id: transactionId },
      data: { status },
    })

    if (status === "COMPLETED") {
      await prisma.product.update({
        where: { id: transaction.productId },
        data: { isAvailable: false },
      })

      await prisma.user.update({
        where: { id: payload.userId },
        data: {
          greenPoints: { increment: 10 },
          itemsReused: { increment: 1 },
          treesSaved: { increment: 0.05 },
          wasteReduced: { increment: 0.5 },
        },
      })

      await prisma.sustainabilityLog.create({
        data: {
          userId: payload.userId,
          action: transaction.type === "DONATE" ? "DONATED" : "PURCHASED",
          points: 10,
          itemsCount: 1,
          description: `Reused: ${transaction.product.title}`,
        },
      })
    }

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Update transaction error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
