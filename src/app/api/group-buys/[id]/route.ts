import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const groupBuy = await prisma.groupBuy.findUnique({
      where: { id },
      include: {
        product: {
          include: {
            seller: { select: { id: true, name: true, email: true, department: true, year: true, image: true, greenPoints: true } },
          },
        },
        organizer: { select: { id: true, name: true, email: true, department: true, year: true } },
        participants: {
          include: { user: { select: { id: true, name: true, email: true, department: true, year: true } } },
        },
      },
    })

    if (!groupBuy) {
      return NextResponse.json({ error: "Group buy not found" }, { status: 404 })
    }

    return NextResponse.json(groupBuy)
  } catch (error) {
    console.error("Get group buy error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
