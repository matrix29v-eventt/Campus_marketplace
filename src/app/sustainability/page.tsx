"use client"

import { useEffect, useState } from "react"
import { Leaf, TreePine, Recycle, Award, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { SustainabilityData } from "@/lib/types"

export default function SustainabilityPage() {
  const [data, setData] = useState<SustainabilityData | null>(null)
  const [totalImpact, setTotalImpact] = useState<{
    totalItems: number
    estimatedTrees: string
    estimatedWaste: string
  } | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      fetch("/api/sustainability", { headers: { Authorization: `Bearer ${token}` } })
        .then((r) => r.json())
        .then((d) => { if (!d.error) setData(d) })
        .catch(() => {})
    }
    fetch("/api/products?limit=1")
      .then(() => fetch("/api/products/featured"))
      .then((r) => r.json())
      .then((products) => {
        if (Array.isArray(products)) {
          setTotalImpact({
            totalItems: products.length * 3,
            estimatedTrees: (products.length * 3 * 0.05).toFixed(1),
            estimatedWaste: (products.length * 3 * 0.5).toFixed(1),
          })
        }
      })
      .catch(() => {})
  }, [])

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-3 mb-2">
        <Leaf className="h-8 w-8 text-emerald-600" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Sustainability</h1>
      </div>
      <p className="text-gray-600 dark:text-gray-400 mb-8">Track your environmental impact. Every reused item makes a difference.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Items Reused", value: data?.itemsReused || totalImpact?.totalItems || 0, icon: Recycle, color: "text-blue-600", bg: "bg-blue-100" },
          { label: "Trees Saved", value: data?.treesSaved || totalImpact?.estimatedTrees || 0, icon: TreePine, color: "text-emerald-600", bg: "bg-emerald-100" },
          { label: "Waste Reduced (kg)", value: data?.wasteReduced || totalImpact?.estimatedWaste || 0, icon: Leaf, color: "text-amber-600", bg: "bg-amber-100" },
          { label: "Green Points Earned", value: data?.totalPoints || 0, icon: Award, color: "text-purple-600", bg: "bg-purple-100" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {typeof stat.value === "number" ? (Number.isInteger(stat.value) ? stat.value : stat.value.toFixed(1)) : stat.value}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/40 dark:to-green-950/40 rounded-xl p-8 mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { step: 1, title: "List or Buy", desc: "Post used items instead of throwing them away, or buy from peers instead of buying new." },
            { step: 2, title: "Complete Transaction", desc: "Every completed sale, exchange, or donation earns Green Points." },
            { step: 3, title: "Track Impact", desc: "Watch your dashboard show trees saved, waste reduced, and total items reused." },
          ].map((item) => (
            <div key={item.step}>
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm font-bold mb-2">
                {item.step}
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{item.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <p className="text-gray-600 dark:text-gray-400 mb-4">Sign in to track your personal sustainability impact.</p>
        <Link href="/dashboard">
          <Button className="gap-2">View Your Dashboard <ArrowRight className="h-4 w-4" /></Button>
        </Link>
      </div>
    </div>
  )
}
