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

    const { searchParams } = new URL(request.url)
    const statusParam = searchParams.get("status")
    const validStatuses = ["PENDING", "COUNTERED", "ACCEPTED", "REJECTED", "WITHDRAWN"]
    const status = statusParam && validStatuses.includes(statusParam)
      ? (statusParam as "PENDING" | "COUNTERED" | "ACCEPTED" | "REJECTED" | "WITHDRAWN")
      : undefined

    const [madeOffers, receivedOffers] = await Promise.all([
      prisma.offer.findMany({
        where: { buyerId: payload.userId, ...(status ? { status } : {}) },
        include: {
          product: {
            include: {
              seller: { select: { id: true, name: true, email: true, image: true } },
            },
          },
          seller: { select: { id: true, name: true, email: true, image: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.offer.findMany({
        where: { sellerId: payload.userId, ...(status ? { status } : {}) },
        include: {
          product: true,
          buyer: { select: { id: true, name: true, email: true, image: true, department: true, year: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
    ])

    return NextResponse.json({ madeOffers, receivedOffers })
  } catch (error) {
    console.error("Get my offers error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
