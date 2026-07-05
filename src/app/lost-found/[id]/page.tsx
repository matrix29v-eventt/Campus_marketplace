"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { MapPin, CalendarDays, ArrowLeft, Loader2, CheckCircle, User, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { LostFoundData } from "@/lib/types"

export default function LostFoundDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [item, setItem] = useState<LostFoundData | null>(null)
  const [loading, setLoading] = useState(true)
  const [claiming, setClaiming] = useState(false)
  const [resolving, setResolving] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [id, setId] = useState<string>("")

  useEffect(() => { params.then(({ id: pid }) => setId(pid)) }, [params])

  useEffect(() => {
    if (!id) return
    const fetchItem = async () => {
      try {
        const [res, userRes] = await Promise.all([
          fetch(`/api/lost-found/${id}`),
          fetch("/api/users/me", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }).catch(() => null),
        ])
        const data = await res.json()
        setItem(data)
        if (userRes?.ok) {
          const userData = await userRes.json()
          if (!userData.error) setCurrentUserId(userData.id)
        }
      } catch (err) { console.error(err) }
      finally { setLoading(false) }
    }
    fetchItem()
  }, [id])

  const handleClaim = async () => {
    const token = localStorage.getItem("token")
    if (!token) { router.push("/auth/login"); return }
    setClaiming(true)
    try {
      const res = await fetch(`/api/lost-found/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ action: "claim" }),
      })
      if (res.ok) {
        const data = await res.json()
        setItem(data)
      }
    } catch (err) { console.error(err) }
    finally { setClaiming(false) }
  }

  const handleResolve = async () => {
    const token = localStorage.getItem("token")
    if (!token) return
    setResolving(true)
    try {
      const res = await fetch(`/api/lost-found/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ action: "resolve" }),
      })
      if (res.ok) {
        const [refetch] = await Promise.all([fetch(`/api/lost-found/${id}`)])
        setItem(await refetch.json())
      }
    } catch (err) { console.error(err) }
    finally { setResolving(false) }
  }

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-emerald-600" /></div>
  if (!item) return <div className="max-w-3xl mx-auto px-4 py-8"><p>Item not found</p></div>

  const isReporter = currentUserId === item.reporterId
  const canClaim = item.status === "FOUND" && !isReporter && currentUserId !== item.claimantId

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-6">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden relative">
          {item.images?.[0] ? (
            <Image src={item.images[0]} alt={item.title} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl text-gray-300 dark:text-gray-600">
              {item.category === "LOST" ? "🔍" : "📦"}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={item.status === "LOST" ? "danger" : item.status === "FOUND" ? "success" : item.status === "CLAIMED" ? "warning" : "default"}>
                {item.status}
              </Badge>
              <span className="text-sm text-gray-500">{item.category}</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{item.title}</h1>
          </div>

          <p className="text-gray-700 dark:text-gray-300">{item.description}</p>

          <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
            {item.location && (
              <p className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {item.location}</p>
            )}
            {item.date && (
              <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4" /> {new Date(item.date).toLocaleDateString()}</p>
            )}
            <p className="flex items-center gap-2"><User className="h-4 w-4" /> Reported by {item.reporter?.name}</p>
            {item.contactInfo && (
              <p className="flex items-center gap-2"><Phone className="h-4 w-4" /> Contact: {item.contactInfo}</p>
            )}
          </div>

          {item.status === "FOUND" && canClaim && (
            <Button onClick={handleClaim} disabled={claiming} className="w-full">
              {claiming ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />}
              Claim This Item
            </Button>
          )}

          {isReporter && item.status !== "RESOLVED" && (
            <div className="space-y-3">
              {item.status === "CLAIMED" && item.claimant && (
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 rounded-lg text-sm">
                  <p className="text-blue-700 dark:text-blue-300">
                    Claimed by {item.claimant.name}. Contact them to coordinate return.
                  </p>
                </div>
              )}
              <Button variant="outline" onClick={handleResolve} disabled={resolving}>
                {resolving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Mark as Resolved
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
