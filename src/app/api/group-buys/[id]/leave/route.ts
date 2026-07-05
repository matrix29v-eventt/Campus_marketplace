import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/auth"

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
    const groupBuy = await prisma.groupBuy.findUnique({ where: { id } })
    if (!groupBuy) {
      return NextResponse.json({ error: "Group buy not found" }, { status: 404 })
    }
    if (groupBuy.organizerId === payload.userId) {
      return NextResponse.json({ error: "Organizer cannot leave. Cancel the group buy instead." }, { status: 400 })
    }

    const participant = await prisma.groupBuyParticipant.findUnique({
      where: { groupBuyId_userId: { groupBuyId: id, userId: payload.userId } },
    })
    if (!participant) {
      return NextResponse.json({ error: "You are not a participant" }, { status: 400 })
    }

    await prisma.groupBuyParticipant.delete({
      where: { groupBuyId_userId: { groupBuyId: id, userId: payload.userId } },
    })

    return NextResponse.json({ message: "Left group buy" })
  } catch (error) {
    console.error("Leave group buy error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
