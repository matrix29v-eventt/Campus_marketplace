"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AuthGuard } from "@/components/AuthGuard"
import type { ProductData } from "@/lib/types"

export default function NewGroupBuyPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState<ProductData[]>([])
  const [fetchingProducts, setFetchingProducts] = useState(true)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    productId: "",
    minParticipants: "3",
    maxParticipants: "",
    discountPercent: "10",
    dealPrice: "",
    expiresAt: "",
  })

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem("token")
      if (!token) return
      try {
        const res = await fetch("/api/users/me/products", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        setProducts(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error(err)
      } finally {
        setFetchingProducts(false)
      }
    }
    fetchProducts()
  }, [])

  const selectedProduct = products.find((p) => p.id === form.productId)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target
    setForm((prev) => ({ ...prev, [id]: value }))
    if (id === "productId" && value) {
      const product = products.find((p) => p.id === value)
      if (product && product.price) {
        const suggestedDeal = Math.round(product.price * 0.9)
        setForm((prev) => ({
          ...prev,
          productId: value,
          dealPrice: suggestedDeal.toString(),
          discountPercent: "10",
        }))
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const token = localStorage.getItem("token")
      if (!token) { router.push("/auth/login"); return }

      const res = await fetch("/api/group-buys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          minParticipants: parseInt(form.minParticipants),
          maxParticipants: form.maxParticipants ? parseInt(form.maxParticipants) : null,
          discountPercent: parseFloat(form.discountPercent),
          dealPrice: parseFloat(form.dealPrice),
        }),
      })

      const data = await res.json()
      if (res.ok) {
        router.push(`/marketplace/group-buy/${data.id}`)
      } else {
        setError(data.error || "Failed to create group deal")
      }
    } catch {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthGuard>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Create Group Deal</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Offer a bulk discount on one of your listings</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600">{error}</div>
          )}

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
            <h2 className="font-semibold text-gray-900 dark:text-white">Select Product</h2>
            {fetchingProducts ? (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading your listings...
              </div>
            ) : products.filter(p => p.price && p.type === "SELL").length === 0 ? (
              <p className="text-sm text-gray-500">No sell listings with price found. Create a sell listing first.</p>
            ) : (
              <select
                id="productId"
                value={form.productId}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="">Select a product</option>
                {products.filter(p => p.price && p.type === "SELL").map((p) => (
                  <option key={p.id} value={p.id}>{p.title} - ₹{p.price}</option>
                ))}
              </select>
            )}
          </div>

          {selectedProduct && (
            <>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
                <h2 className="font-semibold text-gray-900 dark:text-white">Deal Settings</h2>

                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg text-sm flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                  <Info className="h-4 w-4 shrink-0" />
                  Original price: <strong>₹{selectedProduct.price}</strong>
                </div>

                <Input label="Discount Percentage *" type="number" id="discountPercent" placeholder="10" value={form.discountPercent} onChange={handleChange} required min="1" max="99" />
                <Input label="Deal Price (₹) *" type="number" id="dealPrice" placeholder="450" value={form.dealPrice} onChange={handleChange} required />
                <Input label="Minimum Participants *" type="number" id="minParticipants" placeholder="3" value={form.minParticipants} onChange={handleChange} required min="2" />
                <Input label="Maximum Participants (optional)" type="number" id="maxParticipants" placeholder="20" value={form.maxParticipants} onChange={handleChange} min={parseInt(form.minParticipants)} />
                <Input label="Expires At (optional)" type="date" id="expiresAt" value={form.expiresAt} onChange={handleChange} />
              </div>

              <Button type="submit" disabled={loading || !selectedProduct} className="w-full">
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Create Group Deal
              </Button>
            </>
          )}
        </form>
      </div>
    </AuthGuard>
  )
}
