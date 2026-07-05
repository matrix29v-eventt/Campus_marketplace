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
    const groupBuy = await prisma.groupBuy.findUnique({
      where: { id },
      include: { _count: { select: { participants: true } } },
    })

    if (!groupBuy) {
      return NextResponse.json({ error: "Group buy not found" }, { status: 404 })
    }
    if (groupBuy.status !== "ACTIVE") {
      return NextResponse.json({ error: "Group buy is no longer active" }, { status: 400 })
    }
    if (groupBuy.organizerId === payload.userId) {
      return NextResponse.json({ error: "You are already the organizer" }, { status: 400 })
    }
    if (groupBuy.maxParticipants && groupBuy._count.participants >= groupBuy.maxParticipants) {
      return NextResponse.json({ error: "Group buy is full" }, { status: 400 })
    }

    const existing = await prisma.groupBuyParticipant.findUnique({
      where: { groupBuyId_userId: { groupBuyId: id, userId: payload.userId } },
    })
    if (existing) {
      return NextResponse.json({ error: "Already joined this group buy" }, { status: 400 })
    }

    const participant = await prisma.groupBuyParticipant.create({
      data: { groupBuyId: id, userId: payload.userId },
      include: { user: { select: { id: true, name: true, email: true } } },
    })

    return NextResponse.json(participant, { status: 201 })
  } catch (error) {
    console.error("Join group buy error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
