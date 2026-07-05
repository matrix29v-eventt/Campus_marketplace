import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/auth"
import { Prisma } from "@prisma/client"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const type = searchParams.get("type")
    const department = searchParams.get("department")
    const year = searchParams.get("year")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const search = searchParams.get("search")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")

    const where: Prisma.ProductWhereInput = { isAvailable: true }

    if (category) where.category = category as Prisma.ProductWhereInput["category"]
    if (type) where.type = type as Prisma.ProductWhereInput["type"]
    if (department) where.department = department
    if (year) where.year = parseInt(year)
    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseFloat(minPrice)
      if (maxPrice) where.price.lte = parseFloat(maxPrice)
    }
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ]
    }

    // Auto-unfeature expired listings
    await prisma.product.updateMany({
      where: { isFeatured: true, featuredUntil: { lte: new Date() } },
      data: { isFeatured: false, featuredUntil: null },
    })

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          seller: {
            select: { id: true, name: true, email: true, department: true, year: true, image: true },
          },
        },
        orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ])

    return NextResponse.json({
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error("Get products error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

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
    const { title, description, price, category, condition, type, images, department, year, rentalPrice, rentalPeriod } = body

    if (!title || !category || !condition || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!images || images.length === 0) {
      return NextResponse.json({ error: "At least one image is required" }, { status: 400 })
    }

    const product = await prisma.product.create({
      data: {
        title,
        description: description || "",
        price: price ? parseFloat(price) : null,
        category,
        condition,
        type,
        images,
        department: department || null,
        year: year ? parseInt(year) : null,
        rentalPrice: rentalPrice ? parseFloat(rentalPrice) : null,
        rentalPeriod: rentalPeriod || null,
        sellerId: payload.userId,
      },
      include: {
        seller: {
          select: { id: true, name: true, email: true, department: true, year: true, image: true },
        },
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error("Create product error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
