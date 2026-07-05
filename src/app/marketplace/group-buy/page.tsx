"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Users, Tag, TrendingDown, Loader2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import type { GroupBuyData } from "@/lib/types"

export default function GroupBuyPage() {
  const [groupBuys, setGroupBuys] = useState<GroupBuyData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGroupBuys = async () => {
      try {
        const res = await fetch("/api/group-buys?status=ACTIVE")
        const data = await res.json()
        setGroupBuys(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchGroupBuys()
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Group Buying</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Bulk deals for students from the same department</p>
        </div>
        <Link href="/marketplace/group-buy/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Group Deal
          </Button>
        </Link>
      </div>

      <div className="p-4 bg-gradient-to-r from-purple-50 to-emerald-50 dark:from-purple-950/40 dark:to-emerald-950/40 border border-purple-200 dark:border-purple-800 rounded-xl mb-8">
        <p className="text-sm text-purple-700 dark:text-purple-300">
          <strong>Bulk Deals:</strong> Team up with classmates to buy items at discounted prices. 
          When enough students join, everyone gets the lower price!
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      ) : groupBuys.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groupBuys.map((gb) => {
            const participantCount = gb._count?.participants ?? gb.participants?.length ?? 0
            const progress = Math.min((participantCount / gb.minParticipants) * 100, 100)
            return (
              <Link key={gb.id} href={`/marketplace/group-buy/${gb.id}`}>
                <Card hover className="h-full">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant="warning" className="gap-1">
                        <Tag className="h-3 w-3" />
                        {gb.discountPercent}% OFF
                      </Badge>
                      <Badge variant={gb.status === "ACTIVE" ? "success" : "default"}>
                        {gb.status}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {gb.product?.title || "Product"}
                    </h3>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                        {gb.product?.price ? formatPrice(gb.product.price) : ""}
                      </span>
                      <span className="text-lg font-bold text-emerald-600">
                        {formatPrice(gb.dealPrice)}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {participantCount}/{gb.minParticipants} joined
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingDown className="h-4 w-4" />
                          Save {formatPrice((gb.product?.price ?? 0) - gb.dealPrice)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                    {gb.expiresAt && (
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
                        Expires {new Date(gb.expiresAt).toLocaleDateString()}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-20">
          <Tag className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No active group deals</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">Start a group deal on one of your listings!</p>
          <Link href="/marketplace/group-buy/new">
            <Button>Create Group Deal</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
