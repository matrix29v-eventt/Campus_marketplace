"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Timer } from "lucide-react"
import { ProductCard } from "@/components/ProductCard"
import { Button } from "@/components/ui/button"
import type { ProductData } from "@/lib/types"

export default function RentPage() {
  const [products, setProducts] = useState<ProductData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/products?type=RENT&limit=30")
      .then((r) => r.json())
      .then((d) => setProducts(d.products || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-amber-100 rounded-lg">
          <Timer className="h-6 w-6 text-amber-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Rent Items</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Rent items for short-term use — perfect for one-time needs</p>
        </div>
      </div>

      <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl mb-8 text-sm text-amber-700 dark:text-amber-300">
        <strong>Popular rentals:</strong> Scientific calculators (₹20/day), Lab coats, Drawing boards, Cycles. 
        Rent only for the duration you need!
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="animate-pulse rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4"><div className="aspect-[4/3] bg-gray-200 dark:bg-gray-700 rounded-lg mb-3" /><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" /></div>)}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      ) : (
        <div className="text-center py-16">
          <Timer className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400 mb-2">No rental items listed yet</p>
          <Link href="/marketplace/sell">
            <Button>List an Item for Rent</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
