import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret"

export interface JWTPayload {
  userId: string
  email: string
  name: string
}

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch {
    return null
  }
}

export function isValidCollegeEmail(email: string): boolean {
  const collegeDomains = [
    "cet.ac.in",
    "et.cet.ac.in",
    "mec.ac.in",
    "cec.ac.in",
    "gectcr.ac.in",
    "rit.ac.in",
    "nitc.ac.in",
    "nitcalicut.ac.in",
    "amrita.edu",
    "vit.ac.in",
  ]
  const domain = email.split("@")[1]?.toLowerCase()
  if (!domain) return false
  return collegeDomains.some((d) => domain === d || domain.endsWith("." + d))
}
