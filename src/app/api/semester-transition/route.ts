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

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { department: true, year: true },
    })

    if (!user || !user.department || !user.year) {
      return NextResponse.json({ error: "Complete your profile to see semester transition items" }, { status: 400 })
    }

    const seniorYear = user.year - 1

    const [itemsForYou, yourItemsForJuniors] = await Promise.all([
      prisma.product.findMany({
        where: {
          isAvailable: true,
          department: user.department,
          year: user.year,
          sellerId: { not: payload.userId },
          type: { in: ["SELL", "EXCHANGE", "DONATE", "RENT"] },
        },
        include: {
          seller: {
            select: { id: true, name: true, email: true, department: true, year: true, image: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
      prisma.product.findMany({
        where: {
          isAvailable: true,
          department: user.department,
          year: seniorYear > 0 ? seniorYear : 0,
          sellerId: { not: payload.userId },
          type: { in: ["SELL", "EXCHANGE", "DONATE", "RENT"] },
        },
        include: {
          seller: {
            select: { id: true, name: true, email: true, department: true, year: true, image: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
    ])

    return NextResponse.json({
      yourYear: user.year,
      department: user.department,
      itemsForYou,
      yourItemsForJuniors,
      transitionMessage: seniorYear > 0
        ? `Seniors from year ${seniorYear} have items perfect for your current semester!`
        : "Welcome! Check out items from seniors above.",
    })
  } catch (error) {
    console.error("Semester transition error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
