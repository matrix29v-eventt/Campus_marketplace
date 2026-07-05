"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Search, Plus, Loader2, MapPin, CalendarDays, AlertCircle, CheckCircle2, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { LostFoundData } from "@/lib/types"

const statusTabs = [
  { value: "", label: "All" },
  { value: "LOST", label: "Lost" },
  { value: "FOUND", label: "Found" },
  { value: "CLAIMED", label: "Claimed" },
  { value: "RESOLVED", label: "Resolved" },
]

const categoryLabels: Record<string, string> = {
  LOST: "Lost",
  FOUND: "Found",
  ELECTRONICS: "Electronics",
  BOOKS: "Books",
  ID_CARD: "ID Card",
  BAG: "Bag",
  BOTTLE: "Bottle",
  UMBRELLA: "Umbrella",
  OTHER: "Other",
}

export default function LostFoundPage() {
  const [items, setItems] = useState<LostFoundData[]>([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState("")
  const [search, setSearch] = useState("")

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (status) params.set("status", status)
        if (search) params.set("search", search)
        const res = await fetch(`/api/lost-found?${params}`)
        const data = await res.json()
        setItems(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchItems()
  }, [status, search])

  const getStatusIcon = (s: string) => {
    switch (s) {
      case "LOST": return <AlertCircle className="h-4 w-4 text-red-500" />
      case "FOUND": return <CheckCircle2 className="h-4 w-4 text-emerald-500" />
      default: return <HelpCircle className="h-4 w-4 text-gray-400" />
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Lost & Found</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Report or find lost items on campus</p>
        </div>
        <Link href="/lost-found/report">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Report Item
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search lost & found items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:border-emerald-500 focus:outline-none w-full"
          />
        </div>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatus(tab.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              status === tab.value
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <Link key={item.id} href={`/lost-found/${item.id}`}>
              <Card hover className="h-full">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(item.status)}
                      <Badge variant={item.status === "LOST" ? "danger" : item.status === "FOUND" ? "success" : item.status === "CLAIMED" ? "warning" : "default"}>
                        {item.status}
                      </Badge>
                    </div>
                    <span className="text-xs text-gray-400">{categoryLabels[item.category] || item.category}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">{item.description}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
                    {item.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {item.location}
                      </span>
                    )}
                    {item.date && (
                      <span className="flex items-center gap-1">
                        <CalendarDays className="h-3 w-3" /> {new Date(item.date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                    Reported by {item.reporter?.name} • {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <HelpCircle className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No items found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">Report a lost or found item to help your campus community!</p>
          <Link href="/lost-found/report">
            <Button>Report Item</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
