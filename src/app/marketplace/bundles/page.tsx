"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Package, Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import type { BundleData } from "@/lib/types"

export default function BundlesPage() {
  const [bundles, setBundles] = useState<BundleData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBundles = async () => {
      try {
        const res = await fetch("/api/bundles")
        const data = await res.json()
        setBundles(data)
      } catch (err) { console.error(err) }
      finally { setLoading(false) }
    }
    fetchBundles()
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Trade Bundles</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Pre-packed deals combining multiple items</p>
        </div>
        <Link href="/marketplace/bundles/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Bundle
          </Button>
        </Link>
      </div>

      <div className="p-4 bg-gradient-to-r from-orange-50 to-rose-50 dark:from-orange-950/40 dark:to-rose-950/40 border border-orange-200 dark:border-orange-800 rounded-xl mb-8">
        <p className="text-sm text-orange-700 dark:text-orange-300">
          <strong>Bundle Deals:</strong> Combine related items you no longer need into a single bundle. 
          Perfect for semester-end clearouts - textbooks, lab records, and instruments all together!
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-emerald-600" /></div>
      ) : bundles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bundles.map((bundle) => (
            <Link key={bundle.id} href={`/marketplace/bundles/${bundle.id}`}>
              <Card hover className="h-full">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Package className="h-5 w-5 text-orange-500" />
                    <Badge variant="info">{bundle.items?.length || 0} items</Badge>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{bundle.title}</h3>
                  {bundle.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">{bundle.description}</p>
                  )}
                  <div className="flex items-center justify-between">
                    {bundle.price ? (
                      <span className="font-bold text-emerald-600">{formatPrice(bundle.price)}</span>
                    ) : (
                      <span className="text-sm text-gray-500">Price not set</span>
                    )}
                    <span className="text-xs text-gray-400">by {bundle.seller?.name}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <Package className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No bundles yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">Create a bundle with multiple items from your listings!</p>
          <Link href="/marketplace/bundles/new"><Button>Create Bundle</Button></Link>
        </div>
      )}
    </div>
  )
}
