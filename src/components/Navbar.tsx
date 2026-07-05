"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Menu, X, ShoppingBag, LogOut, Leaf, MessageSquare, LayoutDashboard, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/ThemeProvider"
import type { UserData } from "@/lib/types"

export function Navbar() {
  const [user, setUser] = useState<UserData | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      fetch("/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (!data.error) setUser(data)
        })
        .catch(() => {})
    }
  }, [pathname])

  const handleLogout = () => {
    localStorage.removeItem("token")
    setUser(null)
    router.push("/")
  }

  const navLinks = [
    { href: "/marketplace", label: "Marketplace" },
    { href: "/marketplace?type=SELL", label: "Buy" },
    { href: "/marketplace?type=EXCHANGE", label: "Exchange" },
    { href: "/marketplace?type=DONATE", label: "Donate" },
    { href: "/marketplace?type=RENT", label: "Rent" },
    { href: "/marketplace/group-buy", label: "Group Buy" },
    { href: "/lost-found", label: "Lost & Found" },
    { href: "/marketplace/bundles", label: "Bundles" },
    { href: "/textbook-matching", label: "Textbooks" },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Leaf className="h-7 w-7 text-emerald-600" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">CampusKart</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-emerald-600",
                  pathname === link.href || pathname.startsWith(link.href.split("?")[0])
                    ? "text-emerald-600"
                    : "text-gray-600 dark:text-gray-400"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/marketplace/sell">
              <Button size="sm" className="gap-1.5">
                <ShoppingBag className="h-4 w-4" />
                Sell
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
              aria-label="Toggle dark mode"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                    <span className="text-sm font-semibold text-emerald-700">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300">{user.name?.split(" ")[0]}</span>
                </button>

                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                      </div>
                      <div className="px-4 py-2 flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30">
                        <Leaf className="h-4 w-4" />
                        <span>{user.greenPoints} Green Points</span>
                      </div>
                      <Link
                        href="/dashboard"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>
                      <Link
                        href="/chat"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <MessageSquare className="h-4 w-4" />
                        Messages
                      </Link>
                      <Link
                        href="/marketplace/sell"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <ShoppingBag className="h-4 w-4" />
                        Sell Item
                      </Link>
                      <hr className="my-1 border-gray-100 dark:border-gray-700" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 w-full"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm">Register</Button>
                </Link>
              </div>
            )}

            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100 dark:border-gray-800 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-emerald-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/marketplace/sell"
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2.5 text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg mt-1"
            >
              <ShoppingBag className="h-4 w-4 inline mr-1.5" />
              Sell
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
