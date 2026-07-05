"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Search, SlidersHorizontal, X, Loader2 } from "lucide-react"
import { ProductCard } from "@/components/ProductCard"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { ProductData } from "@/lib/types"

const categories = [
  { value: "", label: "All Categories" },
  { value: "TEXTBOOKS", label: "Textbooks" },
  { value: "LAB_RECORDS", label: "Lab Records" },
  { value: "CALCULATORS", label: "Calculators" },
  { value: "DRAWING_INSTRUMENTS", label: "Drawing" },
  { value: "FURNITURE", label: "Furniture" },
  { value: "ELECTRONICS", label: "Electronics" },
  { value: "CLOTHING", label: "Clothing" },
  { value: "STATIONERY", label: "Stationery" },
  { value: "CYCLES", label: "Cycles" },
  { value: "OTHER", label: "Other" },
]

const types = [
  { value: "", label: "All Types" },
  { value: "SELL", label: "For Sale" },
  { value: "EXCHANGE", label: "Exchange" },
  { value: "DONATE", label: "Free/Donate" },
  { value: "RENT", label: "For Rent" },
]

const conditions = [
  { value: "", label: "Any Condition" },
  { value: "NEW", label: "New" },
  { value: "LIKE_NEW", label: "Like New" },
  { value: "GOOD", label: "Good" },
  { value: "FAIR", label: "Fair" },
]

function MarketplaceContent() {
  const searchParams = useSearchParams()

  const [products, setProducts] = useState<ProductData[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    type: searchParams.get("type") || "",
    condition: searchParams.get("condition") || "",
    department: searchParams.get("department") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
  })

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (filters.search) params.set("search", filters.search)
        if (filters.category) params.set("category", filters.category)
        if (filters.type) params.set("type", filters.type)
        if (filters.condition) params.set("condition", filters.condition)
        if (filters.department) params.set("department", filters.department)
        if (filters.minPrice) params.set("minPrice", filters.minPrice)
        if (filters.maxPrice) params.set("maxPrice", filters.maxPrice)
        params.set("page", page.toString())

        const res = await fetch(`/api/products?${params}`)
        const data = await res.json()
        setProducts(data.products || [])
        setTotal(data.total || 0)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [filters, page])

  const updateFilter = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPage(1)
  }

  const clearFilters = () => {
    setFilters({ search: "", category: "", type: "", condition: "", department: "", minPrice: "", maxPrice: "" })
    setPage(1)
  }

  const hasActiveFilters = Object.values(filters).some((v) => v !== "")

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Marketplace</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{total} items available</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search items..."
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
              className="pl-9 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 w-full sm:w-64"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      <div className="flex gap-6">
        {showFilters && (
          <div className="w-64 shrink-0 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white">Filters</h3>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="text-xs text-emerald-600 hover:text-emerald-700">
                  Clear all
                </button>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Category</label>
              <select
                value={filters.category}
                onChange={(e) => updateFilter("category", e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Type</label>
              <select
                value={filters.type}
                onChange={(e) => updateFilter("type", e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                {types.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Condition</label>
              <select
                value={filters.condition}
                onChange={(e) => updateFilter("condition", e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                {conditions.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Department</label>
              <select
                value={filters.department}
                onChange={(e) => updateFilter("department", e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="">All Departments</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Electronics">Electronics</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Civil">Civil</option>
                <option value="Electrical">Electrical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Price Range</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => updateFilter("minPrice", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                />
                <span className="text-gray-400 dark:text-gray-500">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => updateFilter("maxPrice", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex-1">
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mb-4">
              {Object.entries(filters).map(([key, value]) => {
                if (!value) return null
                return (
                  <Badge key={key} variant="default" className="gap-1">
                    {key === "search" ? `"${value}"` : `${key}: ${value}`}
                    <button onClick={() => updateFilter(key, "")} className="ml-1">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )
              })}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 animate-pulse">
                  <div className="aspect-[4/3] bg-gray-200 dark:bg-gray-700 rounded-lg mb-3" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              {total > 20 && (
                <div className="flex justify-center gap-3 mt-8">
                  <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>
                    Previous
                  </Button>
                  <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">Page {page}</span>
                  <Button variant="outline" size="sm" disabled={page * 20 >= total} onClick={() => setPage(page + 1)}>
                    Next
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">No items found</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mb-4">Try adjusting your filters or list something new!</p>
              <Button onClick={clearFilters}>Clear Filters</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function MarketplacePage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-emerald-600" /></div>}>
      <MarketplaceContent />
    </Suspense>
  )
}
