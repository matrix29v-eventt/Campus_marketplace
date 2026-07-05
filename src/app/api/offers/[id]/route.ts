import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/auth"

export async function PATCH(
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
    const offer = await prisma.offer.findUnique({
      where: { id },
      include: { product: true },
    })

    if (!offer) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 })
    }
    if (offer.sellerId !== payload.userId) {
      return NextResponse.json({ error: "Only the seller can respond to offers" }, { status: 403 })
    }
    if (offer.status !== "PENDING" && offer.status !== "COUNTERED") {
      return NextResponse.json({ error: "Offer has already been responded to" }, { status: 400 })
    }

    const body = await request.json()
    const { action, counterAmount, counterMessage } = body

    if (action === "accept") {
      await prisma.$transaction(async (tx) => {
        await tx.offer.update({
          where: { id },
          data: { status: "ACCEPTED" },
        })
        await tx.product.update({
          where: { id: offer.productId },
          data: { isAvailable: false },
        })
        await tx.transaction.create({
          data: {
            productId: offer.productId,
            buyerId: offer.buyerId,
            sellerId: offer.sellerId,
            type: "SELL",
            status: "COMPLETED",
            amount: offer.amount,
          },
        })
      })
      return NextResponse.json({ message: "Offer accepted!" })
    }

    if (action === "reject") {
      await prisma.offer.update({
        where: { id },
        data: { status: "REJECTED" },
      })
      return NextResponse.json({ message: "Offer rejected" })
    }

    if (action === "counter") {
      if (!counterAmount || counterAmount <= 0) {
        return NextResponse.json({ error: "Invalid counter amount" }, { status: 400 })
      }
      await prisma.offer.update({
        where: { id },
        data: {
          status: "COUNTERED",
          counterAmount: parseFloat(counterAmount),
          counterMessage: counterMessage || null,
        },
      })
      return NextResponse.json({ message: "Counter offer sent" })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Update offer error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
