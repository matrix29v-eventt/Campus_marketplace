"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Users, Tag, Calendar, Loader2, Check, X, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import type { GroupBuyData } from "@/lib/types"

export default function GroupBuyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [groupBuy, setGroupBuy] = useState<GroupBuyData | null>(null)
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [id, setId] = useState<string>("")

  useEffect(() => {
    params.then(({ id: pid }) => setId(pid))
  }, [params])

  useEffect(() => {
    if (!id) return
    const fetchGroupBuy = async () => {
      try {
        const [res, userRes] = await Promise.all([
          fetch(`/api/group-buys/${id}`),
          fetch("/api/users/me", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }).catch(() => null),
        ])
        const data = await res.json()
        setGroupBuy(data)
        if (userRes?.ok) {
          const userData = await userRes.json()
          if (!userData.error) setCurrentUserId(userData.id)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchGroupBuy()
  }, [id])

  const handleJoin = async () => {
    const token = localStorage.getItem("token")
    if (!token) { router.push("/auth/login"); return }
    setJoining(true)
    try {
      const res = await fetch(`/api/group-buys/${id}/join`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const [gbRes] = await Promise.all([fetch(`/api/group-buys/${id}`)])
        setGroupBuy(await gbRes.json())
      }
    } catch (err) {
      console.error(err)
    } finally {
      setJoining(false)
    }
  }

  const handleLeave = async () => {
    const token = localStorage.getItem("token")
    if (!token) return
    setLeaving(true)
    try {
      const res = await fetch(`/api/group-buys/${id}/leave`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const [gbRes] = await Promise.all([fetch(`/api/group-buys/${id}`)])
        setGroupBuy(await gbRes.json())
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLeaving(false)
    }
  }

  if (loading) {
    return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-emerald-600" /></div>
  }

  if (!groupBuy) {
    return <div className="max-w-7xl mx-auto px-4 py-8"><p>Group deal not found</p></div>
  }

  const participantCount = groupBuy._count?.participants ?? groupBuy.participants?.length ?? 0
  const progress = Math.min((participantCount / groupBuy.minParticipants) * 100, 100)
  const isOrganizer = currentUserId === groupBuy.organizerId
  const isParticipant = groupBuy.participants?.some((p) => p.userId === currentUserId)
  const savings = groupBuy.product?.price ? groupBuy.product.price - groupBuy.dealPrice : 0

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-6">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden relative">
          {groupBuy.product?.images?.[0] ? (
            <Image src={groupBuy.product.images[0]} alt={groupBuy.product.title} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="warning" className="gap-1">
                <Tag className="h-3 w-3" /> {groupBuy.discountPercent}% OFF
              </Badge>
              <Badge variant={groupBuy.status === "ACTIVE" ? "success" : "default"}>{groupBuy.status}</Badge>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{groupBuy.product?.title}</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                {groupBuy.product?.price ? formatPrice(groupBuy.product.price) : ""}
              </span>
              <span className="text-3xl font-bold text-emerald-600">{formatPrice(groupBuy.dealPrice)}</span>
              <span className="text-sm text-emerald-600 font-medium">Save {formatPrice(savings)}</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3">
            <h3 className="font-semibold text-gray-900 dark:text-white">Progress</h3>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1 text-gray-500">
                <Users className="h-4 w-4" /> {participantCount}/{groupBuy.minParticipants} joined
              </span>
              <span className="text-gray-500">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div className="bg-emerald-500 h-3 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
            {groupBuy.maxParticipants && (
              <p className="text-xs text-gray-400">Maximum {groupBuy.maxParticipants} participants</p>
            )}
            {groupBuy.expiresAt && (
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Expires {new Date(groupBuy.expiresAt).toLocaleDateString()}
              </p>
            )}
          </div>

          {groupBuy.status === "ACTIVE" && (
            <div className="flex gap-3">
              {isOrganizer ? (
                <p className="text-sm text-gray-500">You are the organizer of this group deal</p>
              ) : isParticipant ? (
                <Button variant="danger" onClick={handleLeave} disabled={leaving} className="flex-1">
                  {leaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <X className="h-4 w-4 mr-2" />}
                  Leave Group Deal
                </Button>
              ) : (
                <Button onClick={handleJoin} disabled={joining} className="flex-1">
                  {joining ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Check className="h-4 w-4 mr-2" />}
                  Join Group Deal
                </Button>
              )}
            </div>
          )}

          {participantCount >= groupBuy.minParticipants && groupBuy.status === "ACTIVE" && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl">
              <p className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">
                🎉 Target reached! All participants can now purchase at {formatPrice(groupBuy.dealPrice)}.
              </p>
            </div>
          )}
        </div>
      </div>

      {groupBuy.participants && groupBuy.participants.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Participants ({participantCount})</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {groupBuy.participants.map((p) => (
              <Card key={p.id}>
                <CardContent className="p-3 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                    <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                      {p.user?.name?.charAt(0) || "?"}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{p.user?.name}</p>
                    <p className="text-xs text-gray-500">{p.user?.department || "Student"}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
