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

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { department: true, year: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const where: Prisma.ProductWhereInput = {
      isAvailable: true,
      sellerId: { not: payload.userId },
    }

    if (user.department) where.department = user.department
    if (user.year) {
      where.year = user.year
    }

    const recommendations = await prisma.product.findMany({
      where,
      include: {
        seller: {
          select: { id: true, name: true, email: true, department: true, year: true, image: true },
        },
      },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      take: 12,
    })

    return NextResponse.json(recommendations)
  } catch (error) {
    console.error("Get recommendations error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
