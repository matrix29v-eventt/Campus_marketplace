"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  LayoutDashboard, ShoppingBag, Leaf, Gift,
  TrendingUp, BookOpen, Loader2, Sparkles, Trash2, Check
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { AuthGuard } from "@/components/AuthGuard"
import { SustainabilityDashboard } from "@/components/SustainabilityDashboard"
import { Badge } from "@/components/ui/badge"
import { formatPrice, getTypeLabel, FEATURE_COST_POINTS } from "@/lib/utils"
import type { SustainabilityData, TransactionData, ProductData, UserData } from "@/lib/types"

interface SemesterTransitionData {
  yourYear: number
  department: string
  itemsForYou: ProductData[]
  yourItemsForJuniors: ProductData[]
  transitionMessage: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [sustainability, setSustainability] = useState<SustainabilityData | null>(null)
  const [transactions, setTransactions] = useState<TransactionData[]>([])
  const [listings, setListings] = useState<ProductData[]>([])
  const [semesterItems, setSemesterItems] = useState<SemesterTransitionData | null>(null)
  const [tab, setTab] = useState("overview")
  const [featuringId, setFeaturingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return

    const fetchAll = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` }

        const [userRes, sustainRes, transRes, listRes, semesterRes] = await Promise.all([
          fetch("/api/users/me", { headers }),
          fetch("/api/sustainability", { headers }),
          fetch("/api/transactions", { headers }),
          fetch("/api/users/me/products", { headers }),
          fetch("/api/semester-transition", { headers }),
        ])

        const userData = await userRes.json()
        if (!userData.error) setUser(userData)

        const sustainData = await sustainRes.json()
        if (!sustainData.error) setSustainability(sustainData)

        const transData = await transRes.json()
        if (Array.isArray(transData)) setTransactions(transData)

        const listData = await listRes.json()
        if (Array.isArray(listData)) setListings(listData)

        const semesterData = await semesterRes.json()
        if (!semesterData.error) setSemesterItems(semesterData)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [])

  const handleFeature = async (productId: string) => {
    const token = localStorage.getItem("token")
    if (!token) return
    setFeaturingId(productId)
    try {
      const res = await fetch(`/api/products/${productId}/feature`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        setListings((prev) =>
          prev.map((p) => (p.id === productId ? { ...p, isFeatured: true } : p))
        )
        setUser((prev) =>
          prev ? { ...prev, greenPoints: prev.greenPoints - FEATURE_COST_POINTS } : prev
        )
      }
    } catch (err) {
      console.error(err)
    } finally {
      setFeaturingId(null)
    }
  }

  const handleDelete = async (productId: string) => {
    if (!confirm("Delete this listing permanently?")) return
    const token = localStorage.getItem("token")
    if (!token) return
    setDeletingId(productId)
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) setListings((prev) => prev.filter((p) => p.id !== productId))
    } catch (err) {
      console.error(err)
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <AuthGuard>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      </AuthGuard>
    )
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "sustainability", label: "Sustainability", icon: Leaf },
    { id: "transactions", label: "Transactions", icon: ShoppingBag },
    { id: "listings", label: "My Listings", icon: BookOpen },
    { id: "semester", label: "Semester Transition", icon: TrendingUp },
  ]

  return (
    <AuthGuard>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-emerald-100 flex items-center justify-center">
              <span className="text-xl font-bold text-emerald-700">{user?.name?.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user?.name}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email} • {user?.department || "Student"}</p>
            </div>
          </div>
          <Link href="/marketplace/sell">
            <Button className="gap-2">
              <ShoppingBag className="h-4 w-4" />
              List Item
            </Button>
          </Link>
        </div>

        <div className="flex gap-6">
          <div className="w-56 shrink-0">
            <nav className="space-y-1">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    tab === t.id
                      ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <t.icon className="h-4 w-4" />
                  {t.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex-1 min-w-0">
            {tab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: "Green Points", value: user?.greenPoints || 0, icon: Leaf, color: "text-emerald-600", bg: "bg-emerald-100" },
                    { label: "Items Reused", value: user?.itemsReused || 0, icon: Gift, color: "text-blue-600", bg: "bg-blue-100" },
                    { label: "Trees Saved", value: user?.treesSaved || 0, icon: Leaf, color: "text-green-600", bg: "bg-green-100" },
                    { label: "Waste Reduced", value: `${user?.wasteReduced || 0}kg`, icon: Leaf, color: "text-amber-600", bg: "bg-amber-100" },
                  ].map((stat) => (
                    <Card key={stat.label}>
                      <CardContent className="p-5">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${stat.bg}`}>
                          <stat.icon className={`h-5 w-5 ${stat.color}`} />
                        </div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {semesterItems && semesterItems.itemsForYou?.length > 0 && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-emerald-600" />
                          <h3 className="font-semibold text-gray-900 dark:text-white">Semester Transition</h3>
                        </div>
                        <Link href="/marketplace?type=SELL">
                          <Button variant="ghost" size="sm">View All</Button>
                        </Link>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{semesterItems.transitionMessage}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {semesterItems.itemsForYou.slice(0, 4).map((item: ProductData) => (
                          <Link key={item.id} href={`/marketplace/${item.id}`}
                            className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600 transition-colors">
                            <p className="font-medium text-sm text-gray-900 dark:text-white truncate">{item.title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.price ? formatPrice(item.price) : "Free"}</p>
                          </Link>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {transactions.length > 0 && (
                  <Card>
                    <CardHeader>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {transactions.slice(0, 5).map((t) => (
                          <div key={t.id} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-3">
                              <Badge variant={t.status === "COMPLETED" ? "success" : t.status === "PENDING" ? "warning" : "default"}>
                                {t.status}
                              </Badge>
                              <span className="text-gray-900 dark:text-white">{t.product?.title || "Item"}</span>
                            </div>
                            <span className="text-gray-500 text-xs">
                              {new Date(t.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {tab === "sustainability" && (
              <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Environmental Impact</h2>
                <SustainabilityDashboard data={sustainability} />
              </div>
            )}

            {tab === "transactions" && (
              <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Transaction History</h2>
                {transactions.length > 0 ? (
                  <Card>
                    <CardContent className="p-0">
                      <div className="divide-y divide-gray-100 dark:divide-gray-700">
                        {transactions.map((t) => (
                          <div key={t.id} className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Badge variant={t.status === "COMPLETED" ? "success" : t.status === "PENDING" ? "warning" : "default"}>
                                {t.status}
                              </Badge>
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{t.product?.title}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {t.type === "DONATE" ? "Donation" : getTypeLabel(t.type)}
                                  {t.amount ? ` • ${formatPrice(t.amount)}` : ""}
                                </p>
                              </div>
                            </div>
                            <p className="text-xs text-gray-400 dark:text-gray-500">{new Date(t.createdAt).toLocaleDateString()}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm py-8 text-center">No transactions yet</p>
                )}
              </div>
            )}

            {tab === "listings" && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">My Listings</h2>
                {listings.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {listings.map((item) => (
                      <div key={item.id}>
                        <Link href={`/marketplace/${item.id}`}>
                          <Card hover>
                            <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-700 rounded-t-xl overflow-hidden relative">
                              <Image src={item.images?.[0] || ""} alt={item.title}
                                fill
                                className="object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = `https://placehold.co/400x300/e2e8f0/64748b?text=Item`
                                }} />
                              <div className="absolute top-2 left-2 flex gap-1.5">
                                {!item.isAvailable && (
                                  <Badge variant="success">
                                    <Check className="h-3 w-3 mr-1" /> Sold
                                  </Badge>
                                )}
                                {item.isFeatured && (
                                  <Badge variant="warning">
                                    <Sparkles className="h-3 w-3 mr-1" /> Featured
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <CardContent className="p-3">
                              <p className="font-medium text-sm text-gray-900 dark:text-white truncate">{item.title}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{getTypeLabel(item.type)}{item.price ? ` • ${formatPrice(item.price)}` : ""}</p>
                            </CardContent>
                          </Card>
                        </Link>
                        <div className="flex gap-2 mt-2">
                          {item.isAvailable && !item.isFeatured && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleFeature(item.id)}
                              disabled={featuringId === item.id || (user?.greenPoints ?? 0) < FEATURE_COST_POINTS}
                              className="flex-1 gap-1 text-xs"
                            >
                              {featuringId === item.id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Sparkles className="h-3 w-3" />
                              )}
                              Feature ({FEATURE_COST_POINTS} pts)
                            </Button>
                          )}
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(item.id)}
                            disabled={deletingId === item.id}
                            className={item.isAvailable && !item.isFeatured ? "w-8" : "w-full"}
                          >
                            {deletingId === item.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Trash2 className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <ShoppingBag className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400 mb-3">No listings yet</p>
                    <Link href="/marketplace/sell">
                      <Button>List Your First Item</Button>
                    </Link>
                  </div>
                )}
              </div>
            )}

            {tab === "semester" && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Semester Transition Marketplace</h2>
                <div className="p-4 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-950/40 dark:to-blue-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl mb-6">
                  <p className="text-sm text-emerald-700 dark:text-emerald-300">
                    <strong>Smart Transition:</strong> As you move to the next semester, items needed by juniors are automatically highlighted. 
                    Seniors can sell their used books and equipment directly to the next batch!
                  </p>
                </div>

                {semesterItems ? (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white mb-3">Items for Your Semester</h3>
                      {semesterItems.itemsForYou?.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          {semesterItems.itemsForYou.map((item: ProductData) => (
                            <Link key={item.id} href={`/marketplace/${item.id}`}>
                              <Card hover>
                                <CardContent className="p-4">
                                  <p className="font-medium text-sm text-gray-900 truncate">{item.title}</p>
                                  <p className="text-xs text-gray-500">{item.price ? formatPrice(item.price) : "Free"}</p>
                                  <p className="text-xs text-gray-400 mt-1">by {item.seller?.name}</p>
                                </CardContent>
                              </Card>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400">No items found for your semester yet</p>
                      )}
                    </div>

                    {semesterItems.yourItemsForJuniors?.length > 0 && (
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white mb-3">Items from Seniors</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          {semesterItems.yourItemsForJuniors.map((item: ProductData) => (
                            <Link key={item.id} href={`/marketplace/${item.id}`}>
                              <Card hover>
                                <CardContent className="p-4">
                                  <p className="font-medium text-sm text-gray-900 dark:text-white truncate">{item.title}</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.price ? formatPrice(item.price) : "Free"}</p>
                                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">by {item.seller?.name}</p>
                                </CardContent>
                              </Card>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">Complete your profile (department & year) to see semester-specific items</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
