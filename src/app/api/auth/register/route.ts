import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hashPassword, generateToken, isValidCollegeEmail } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { name, email, password, department, year } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!isValidCollegeEmail(email)) {
      return NextResponse.json({ error: "Please use a valid college email address" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 })
    }

    const hashedPassword = await hashPassword(password)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        department: department || null,
        year: year ? parseInt(year) : null,
      },
    })

    const token = generateToken({ userId: user.id, email: user.email, name: user.name })

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        department: user.department,
        year: user.year,
        isVerified: user.isVerified,
        greenPoints: user.greenPoints,
      },
    })
  } catch (error) {
    console.error("Register error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
