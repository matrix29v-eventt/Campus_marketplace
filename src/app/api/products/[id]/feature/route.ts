import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/auth"
import { FEATURE_COST_POINTS, FEATURE_DURATION_DAYS } from "@/lib/utils"

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
    if (product.sellerId !== payload.userId) {
      return NextResponse.json({ error: "You can only feature your own listings" }, { status: 403 })
    }

    const user = await prisma.user.findUnique({ where: { id: payload.userId } })
    if (!user || user.greenPoints < FEATURE_COST_POINTS) {
      return NextResponse.json(
        { error: `Not enough green points. You need ${FEATURE_COST_POINTS} points.` },
        { status: 400 }
      )
    }

    const [updated] = await prisma.$transaction([
      prisma.product.update({
        where: { id },
        data: {
          isFeatured: true,
          featuredUntil: new Date(Date.now() + FEATURE_DURATION_DAYS * 24 * 60 * 60 * 1000),
        },
      }),
      prisma.user.update({
        where: { id: payload.userId },
        data: { greenPoints: { decrement: FEATURE_COST_POINTS } },
      }),
      prisma.sustainabilityLog.create({
        data: {
          userId: payload.userId,
          action: "FEATURED",
          points: -FEATURE_COST_POINTS,
          itemsCount: 1,
          description: `Featured listing: ${product.title}`,
        },
      }),
    ])

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Feature product error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
