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
      select: {
        greenPoints: true,
        itemsReused: true,
        treesSaved: true,
        wasteReduced: true,
      },
    })

    const logs = await prisma.sustainabilityLog.findMany({
      where: { userId: payload.userId },
      orderBy: { createdAt: "desc" },
      take: 20,
    })

    return NextResponse.json({
      totalPoints: user?.greenPoints || 0,
      itemsReused: user?.itemsReused || 0,
      treesSaved: user?.treesSaved || 0,
      wasteReduced: user?.wasteReduced || 0,
      logs,
    })
  } catch (error) {
    console.error("Get sustainability error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
