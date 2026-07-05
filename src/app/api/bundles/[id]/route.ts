import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/auth"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const bundle = await prisma.bundle.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              include: {
                seller: { select: { id: true, name: true, email: true, department: true, year: true, image: true } },
              },
            },
          },
        },
        seller: { select: { id: true, name: true, email: true, department: true, year: true, image: true, greenPoints: true } },
      },
    })

    if (!bundle) {
      return NextResponse.json({ error: "Bundle not found" }, { status: 404 })
    }

    return NextResponse.json(bundle)
  } catch (error) {
    console.error("Get bundle error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
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
    const bundle = await prisma.bundle.findUnique({ where: { id } })
    if (!bundle) {
      return NextResponse.json({ error: "Bundle not found" }, { status: 404 })
    }
    if (bundle.sellerId !== payload.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    await prisma.bundleItem.deleteMany({ where: { bundleId: id } })
    await prisma.bundle.delete({ where: { id } })

    return NextResponse.json({ message: "Bundle deleted" })
  } catch (error) {
    console.error("Delete bundle error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
