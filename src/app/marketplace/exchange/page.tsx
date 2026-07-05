"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Repeat } from "lucide-react"
import { ProductCard } from "@/components/ProductCard"
import { Button } from "@/components/ui/button"
import type { ProductData } from "@/lib/types"

export default function ExchangePage() {
  const [products, setProducts] = useState<ProductData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/products?type=EXCHANGE&limit=30")
      .then((r) => r.json())
      .then((d) => setProducts(d.products || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Repeat className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Exchange Items</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Trade items directly with other students — no money needed</p>
        </div>
      </div>

      <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl mb-8 text-sm text-blue-700 dark:text-blue-300">
        <strong>How it works:</strong> Find an item you want, propose an exchange with something you have, 
        and connect via chat to arrange the trade.
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
          <Repeat className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400 mb-2">No exchange items listed yet</p>
          <Link href="/marketplace/sell">
            <Button>List an Item for Exchange</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
