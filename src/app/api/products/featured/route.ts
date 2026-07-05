import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Auto-unfeature expired listings
    await prisma.product.updateMany({
      where: { isFeatured: true, featuredUntil: { lte: new Date() } },
      data: { isFeatured: false, featuredUntil: null },
    })

    const products = await prisma.product.findMany({
      where: { isAvailable: true },
      include: {
        seller: {
          select: { id: true, name: true, email: true, department: true, year: true, image: true },
        },
      },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      take: 8,
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error("Get featured products error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
