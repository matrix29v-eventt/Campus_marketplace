import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/auth"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const item = await prisma.lostFoundItem.findUnique({
      where: { id },
      include: {
        reporter: { select: { id: true, name: true, email: true, department: true, year: true, image: true } },
        claimant: { select: { id: true, name: true, email: true } },
      },
    })

    if (!item) {
      return NextResponse.json({ error: "Lost/found item not found" }, { status: 404 })
    }

    return NextResponse.json(item)
  } catch (error) {
    console.error("Get lost-found item error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(
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
    const item = await prisma.lostFoundItem.findUnique({ where: { id } })
    if (!item) {
      return NextResponse.json({ error: "Lost/found item not found" }, { status: 404 })
    }

    const body = await request.json()
    const { action } = body

    if (action === "claim") {
      if (item.status !== "FOUND") {
        return NextResponse.json({ error: "This item is not available for claiming" }, { status: 400 })
      }
      const updated = await prisma.lostFoundItem.update({
        where: { id },
        data: { status: "CLAIMED", claimantId: payload.userId },
        include: {
          reporter: { select: { id: true, name: true, email: true } },
          claimant: { select: { id: true, name: true, email: true } },
        },
      })
      return NextResponse.json(updated)
    }

    if (action === "resolve") {
      if (item.reporterId !== payload.userId) {
        return NextResponse.json({ error: "Only the reporter can resolve this" }, { status: 403 })
      }
      const updated = await prisma.lostFoundItem.update({
        where: { id },
        data: { status: "RESOLVED" },
      })
      return NextResponse.json(updated)
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Update lost-found error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
