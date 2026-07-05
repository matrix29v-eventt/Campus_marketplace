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

    const wishlist = await prisma.wishlist.findMany({
      where: { userId: payload.userId },
      include: {
        product: {
          include: {
            seller: {
              select: { id: true, name: true, department: true, year: true, image: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(wishlist)
  } catch (error) {
    console.error("Get wishlist error:", error)
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

    const { productId } = await request.json()

    const existing = await prisma.wishlist.findUnique({
      where: { userId_productId: { userId: payload.userId, productId } },
    })
    if (existing) {
      await prisma.wishlist.delete({ where: { id: existing.id } })
      return NextResponse.json({ message: "Removed from wishlist" })
    }

    const wishlist = await prisma.wishlist.create({
      data: { userId: payload.userId, productId },
    })

    return NextResponse.json(wishlist, { status: 201 })
  } catch (error) {
    console.error("Wishlist error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
