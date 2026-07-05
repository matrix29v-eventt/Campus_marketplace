"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Loader2, ArrowLeft, Package, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AuthGuard } from "@/components/AuthGuard"
import { formatPrice } from "@/lib/utils"
import type { ProductData } from "@/lib/types"

export default function NewBundlePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState<ProductData[]>([])
  const [fetchingProducts, setFetchingProducts] = useState(true)
  const [error, setError] = useState("")
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [form, setForm] = useState({ title: "", description: "", price: "" })

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
      } catch (err) { console.error(err) }
      finally { setFetchingProducts(false) }
    }
    fetchProducts()
  }, [])

  const toggleProduct = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedIds.length < 2) {
      setError("Select at least 2 products")
      return
    }
    setError("")
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) { router.push("/auth/login"); return }
      const res = await fetch("/api/bundles", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          title: form.title,
          description: form.description || undefined,
          price: form.price ? parseFloat(form.price) : null,
          productIds: selectedIds,
        }),
      })
      const data = await res.json()
      if (res.ok) router.push(`/marketplace/bundles/${data.id}`)
      else setError(data.error || "Failed to create bundle")
    } catch { setError("Something went wrong") }
    finally { setLoading(false) }
  }

  return (
    <AuthGuard>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Create Bundle</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Combine multiple items into one bundle deal</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>}

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
            <h2 className="font-semibold text-gray-900 dark:text-white">Bundle Details</h2>
            <Input label="Bundle Title *" type="text" id="title" placeholder="e.g. First Year Engineering Kit" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <textarea rows={2} placeholder="What's included in this bundle?" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none" />
            </div>
            <Input label="Bundle Price (₹) (optional)" type="number" id="price" placeholder="Discounted bundle price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900 dark:text-white">Select Products *</h2>
              <span className="text-sm text-gray-500">{selectedIds.length} selected (min 2)</span>
            </div>
            {fetchingProducts ? (
              <div className="flex items-center gap-2 text-sm text-gray-500"><Loader2 className="h-4 w-4 animate-spin" /> Loading your listings...</div>
            ) : products.length === 0 ? (
              <p className="text-sm text-gray-500">No listings found. Create some listings first.</p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {products.map((product) => {
                  const selected = selectedIds.includes(product.id)
                  return (
                    <button key={product.id} type="button" onClick={() => toggleProduct(product.id)}
                      className={`relative flex items-start gap-3 p-3 rounded-lg border-2 text-left transition-all ${
                        selected ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30" : "border-gray-200 dark:border-gray-600 hover:border-gray-300"
                      }`}>
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                        selected ? "border-emerald-500 bg-emerald-500" : "border-gray-300"
                      }`}>
                        {selected && <Check className="h-3 w-3 text-white" />}
                      </div>
                      <div className="min-w-0">
                        {product.images?.[0] && (
                          <div className="w-12 h-12 rounded mb-1 overflow-hidden relative bg-gray-100">
                            <Image src={product.images[0]} alt="" fill className="object-cover" />
                          </div>
                        )}
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{product.title}</p>
                        <p className="text-xs text-gray-500">{product.price ? formatPrice(product.price) : "Free"}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          <Button type="submit" disabled={loading || selectedIds.length < 2} className="w-full">
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Package className="h-4 w-4 mr-2" />}
            Create Bundle
          </Button>
        </form>
      </div>
    </AuthGuard>
  )
}
