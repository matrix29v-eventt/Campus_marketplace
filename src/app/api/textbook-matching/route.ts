import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const courseCode = searchParams.get("courseCode")
    const department = searchParams.get("department")

    if (!courseCode && !department) {
      return NextResponse.json({ error: "Provide a courseCode or department to search" }, { status: 400 })
    }

    const where: Record<string, unknown> = {
      isAvailable: true,
      type: "SELL",
    }

    if (courseCode) {
      where.courseCode = { contains: courseCode, mode: "insensitive" }
    }
    if (department) {
      where.department = department
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        seller: {
          select: { id: true, name: true, email: true, department: true, year: true, image: true, greenPoints: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ products, total: products.length })
  } catch (error) {
    console.error("Textbook matching error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
