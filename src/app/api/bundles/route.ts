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
    const { title, description, price, productIds } = body

    if (!title || !productIds || !Array.isArray(productIds) || productIds.length < 2) {
      return NextResponse.json({ error: "Bundle must have a title and at least 2 products" }, { status: 400 })
    }

    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, sellerId: payload.userId },
    })

    if (products.length !== productIds.length) {
      return NextResponse.json({ error: "Some products not found or not owned by you" }, { status: 400 })
    }

    const bundle = await prisma.bundle.create({
      data: {
        title,
        description: description || null,
        price: price ? parseFloat(price) : null,
        sellerId: payload.userId,
        items: {
          create: productIds.map((productId: string) => ({ productId })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        seller: { select: { id: true, name: true, email: true, department: true, year: true, image: true } },
      },
    })

    return NextResponse.json(bundle, { status: 201 })
  } catch (error) {
    console.error("Create bundle error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sellerId = searchParams.get("sellerId")

    const where: Record<string, unknown> = { isAvailable: true }
    if (sellerId) where.sellerId = sellerId

    const bundles = await prisma.bundle.findMany({
      where,
      include: {
        items: {
          include: {
            product: true,
          },
        },
        seller: { select: { id: true, name: true, email: true, department: true, year: true, image: true, greenPoints: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(bundles)
  } catch (error) {
    console.error("Get bundles error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
