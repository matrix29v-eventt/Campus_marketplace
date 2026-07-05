"use client"

import Link from "next/link"
import { ArrowRight, Leaf, Shield, Zap, Recycle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-emerald-50 dark:from-emerald-950/30 dark:via-gray-950 dark:to-emerald-950/30">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-100/40 via-transparent to-transparent dark:from-emerald-900/20" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 relative">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-full text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-6">
            <Leaf className="h-4 w-4" />
            Student-only Campus Marketplace
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
            Buy, Sell, Exchange, and{" "}
            <span className="text-emerald-600">Donate</span> on Campus
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl">
            The trusted marketplace for college students. Save money, reduce waste, and 
            find everything you need — from textbooks to hostel furniture — all within your campus.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/marketplace">
              <Button size="lg" className="gap-2">
                Browse Items <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/marketplace/sell">
              <Button variant="outline" size="lg">
                Start Selling
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-16">
            {[
              { icon: Shield, label: "Verified", desc: "College email" },
              { icon: Zap, label: "Affordable", desc: "Student prices" },
              { icon: Recycle, label: "Sustainable", desc: "Reduce waste" },
              { icon: Leaf, label: "Green Points", desc: "Earn rewards" },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-3">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg">
                  <item.icon className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{item.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
