"use client"

import { Leaf, TreePine, Trash2, Recycle, Award } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { SustainabilityData } from "@/lib/types"

interface Props {
  data: SustainabilityData | null
  loading?: boolean
}

const impactStats = [
  { label: "Items Reused", key: "itemsReused", icon: Recycle, color: "text-blue-600", bg: "bg-blue-100" },
  { label: "Trees Saved", key: "treesSaved", icon: TreePine, color: "text-emerald-600", bg: "bg-emerald-100", suffix: "" },
  { label: "Waste Reduced", key: "wasteReduced", icon: Trash2, color: "text-amber-600", bg: "bg-amber-100", suffix: "kg" },
  { label: "Green Points", key: "totalPoints", icon: Award, color: "text-purple-600", bg: "bg-purple-100" },
]

export function SustainabilityDashboard({ data, loading }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-5">
              <div className="animate-pulse space-y-3">
                <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700" />
                <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {impactStats.map((stat) => {
          const value = data ? Number(data[stat.key as keyof SustainabilityData]) : 0
          const displayValue = typeof value === "number" ? (Number.isInteger(value) ? value : value.toFixed(1)) : value
          return (
            <Card key={stat.key}>
              <CardContent className="p-5">
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-3", stat.bg)}>
                  <stat.icon className={cn("h-5 w-5", stat.color)} />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {displayValue}{stat.suffix || ""}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {data?.logs && data.logs.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <h3 className="font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.logs.map((log) => (
                <div key={log.id} className="flex items-center gap-3 text-sm">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    log.action === "DONATED" ? "bg-emerald-100 dark:bg-emerald-900/30" : "bg-blue-100 dark:bg-blue-900/30"
                  )}>
                    <Leaf className={cn("h-4 w-4", log.action === "DONATED" ? "text-emerald-600" : "text-blue-600")} />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 dark:text-white">{log.description || `${log.action} ${log.itemsCount} item(s)`}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(log.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className="text-emerald-600 font-medium">+{log.points} pts</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
