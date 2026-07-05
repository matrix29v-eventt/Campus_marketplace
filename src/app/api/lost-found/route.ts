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
    const { title, description, category, location, date, images, contactInfo } = body

    if (!title || !description || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const item = await prisma.lostFoundItem.create({
      data: {
        title,
        description,
        category,
        location: location || null,
        date: date ? new Date(date) : null,
        images: images || [],
        contactInfo: contactInfo || null,
        status: category === "LOST" ? "LOST" : "FOUND",
        reporterId: payload.userId,
      },
      include: {
        reporter: { select: { id: true, name: true, email: true, department: true, year: true } },
      },
    })

    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    console.error("Create lost-found error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const category = searchParams.get("category")
    const search = searchParams.get("search")

    const where: Record<string, unknown> = {}

    if (status) where.status = status
    if (category) where.category = category
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
      ]
    }

    const items = await prisma.lostFoundItem.findMany({
      where,
      include: {
        reporter: { select: { id: true, name: true, email: true, department: true, year: true, image: true } },
        claimant: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(items)
  } catch (error) {
    console.error("Get lost-found error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
