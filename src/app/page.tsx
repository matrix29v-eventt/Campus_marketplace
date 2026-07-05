"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Hero } from "@/components/Hero"
import { CategoryGrid } from "@/components/CategoryGrid"
import { ProductCard } from "@/components/ProductCard"
import { SearchBar } from "@/components/SearchBar"
import { Button } from "@/components/ui/button"
import { ArrowRight, Recycle, GraduationCap, TrendingUp } from "lucide-react"
import type { ProductData } from "@/lib/types"

export default function Home() {
  const [featured, setFeatured] = useState<ProductData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/products/featured")
      .then((res) => res.json())
      .then((data) => setFeatured(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <Hero />

      <section className="py-12 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">What are you looking for?</h2>
          <div className="flex justify-center">
            <SearchBar />
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Featured Items</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Recently listed by your campus peers</p>
            </div>
            <Link href="/marketplace">
              <Button variant="ghost" className="gap-2">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 animate-pulse">
                  <div className="aspect-[4/3] bg-gray-200 dark:bg-gray-700 rounded-lg mb-3" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : featured.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <p>No items listed yet. Be the first to list something!</p>
              <Link href="/marketplace/sell">
                <Button className="mt-4">Start Selling</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      <CategoryGrid />

      <section className="py-16 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { icon: GraduationCap, title: "Semester Transition", desc: "Automatically find items you need as you move to the next semester" },
              { icon: Recycle, title: "Sustainability", desc: "Track your environmental impact with every reused item" },
              { icon: TrendingUp, title: "Smart Recommendations", desc: "AI-powered suggestions based on your department and semester" },
            ].map((item) => (
              <div key={item.title} className="p-6">
                <item.icon className="h-10 w-10 mx-auto mb-4 text-emerald-200" />
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-emerald-100 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">How It Works</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            Join your campus marketplace in three simple steps
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Sign Up", desc: "Register with your college email to join the trusted campus network" },
              { step: "02", title: "List or Browse", desc: "Post items you no longer need or find what you are looking for" },
              { step: "03", title: "Connect & Trade", desc: "Chat directly with peers and complete the transaction on campus" },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="text-5xl font-bold text-emerald-100 dark:text-emerald-900/40 mb-4">{item.step}</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
