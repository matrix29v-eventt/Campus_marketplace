"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Package, Loader2, ArrowLeft, Trash2, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ProductCard } from "@/components/ProductCard"
import { formatPrice } from "@/lib/utils"
import type { BundleData } from "@/lib/types"

export default function BundleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [bundle, setBundle] = useState<BundleData | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [id, setId] = useState<string>("")

  useEffect(() => { params.then(({ id: pid }) => setId(pid)) }, [params])

  useEffect(() => {
    if (!id) return
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/bundles/${id}`)
        const data = await res.json()
        setBundle(data)

        const token = localStorage.getItem("token")
        if (token) {
          const userRes = await fetch("/api/users/me", {
            headers: { Authorization: `Bearer ${token}` },
          })
          if (userRes.ok) {
            const userData = await userRes.json()
            if (!userData.error) setCurrentUserId(userData.id)
          }
        }
      } catch (err) { console.error(err) }
      finally { setLoading(false) }
    }
    fetchData()
  }, [id])

  const handleDelete = async () => {
    if (!confirm("Delete this bundle?")) return
    const token = localStorage.getItem("token")
    if (!token) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/bundles/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) router.push("/marketplace/bundles")
    } catch (err) { console.error(err) }
    finally { setDeleting(false) }
  }

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-emerald-600" /></div>
  if (!bundle) return <div className="max-w-4xl mx-auto px-4 py-8"><p>Bundle not found</p></div>

  const isOwner = currentUserId === bundle.sellerId

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Package className="h-5 w-5 text-orange-500" />
            <Badge variant="info">{bundle.items?.length || 0} items in bundle</Badge>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{bundle.title}</h1>
          {bundle.description && <p className="text-gray-500 dark:text-gray-400 mt-1">{bundle.description}</p>}
          <div className="flex items-center gap-4 mt-3">
            {bundle.price && (
              <span className="text-2xl font-bold text-emerald-600">{formatPrice(bundle.price)}</span>
            )}
            <span className="flex items-center gap-1 text-sm text-gray-500">
              <User className="h-4 w-4" /> {bundle.seller?.name}
            </span>
          </div>
        </div>
        {isOwner && (
          <Button variant="danger" size="sm" onClick={handleDelete} disabled={deleting}>
            {deleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
            Delete
          </Button>
        )}
      </div>

      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Items in this Bundle</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {bundle.items?.map((item) => (
          item.product ? <ProductCard key={item.id} product={item.product} /> : null
        ))}
      </div>
    </div>
  )
}
