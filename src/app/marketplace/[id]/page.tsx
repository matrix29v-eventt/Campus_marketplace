"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, MapPin, Calendar, MessageSquare, Heart, Loader2, Check, Leaf, Sparkles, Star, Trash2, Send, X, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatPrice, getCategoryEmoji, getConditionLabel, getTypeLabel, FEATURE_COST_POINTS } from "@/lib/utils"
import type { ProductData, UserData, OfferData } from "@/lib/types"

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [product, setProduct] = useState<ProductData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [purchasing, setPurchasing] = useState(false)
  const [purchased, setPurchased] = useState(false)
  const [currentUser, setCurrentUser] = useState<UserData | null>(null)
  const [inWishlist, setInWishlist] = useState(false)
  const [featuring, setFeaturing] = useState(false)
  const [featureMsg, setFeatureMsg] = useState("")

  const [offers, setOffers] = useState<OfferData[]>([])
  const [offerAmount, setOfferAmount] = useState("")
  const [offerMessage, setOfferMessage] = useState("")
  const [submittingOffer, setSubmittingOffer] = useState(false)
  const [offerSubmitted, setOfferSubmitted] = useState(false)
  const [responding, setResponding] = useState<Record<string, boolean>>({})
  const [counterAmounts, setCounterAmounts] = useState<Record<string, string>>({})
  const [counterMessages, setCounterMessages] = useState<Record<string, string>>({})

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      fetch("/api/users/me", { headers: { Authorization: `Bearer ${token}` } })
        .then((r) => r.json())
        .then((d) => { if (!d.error) setCurrentUser(d) })
        .catch(() => {})
    }
  }, [])

  useEffect(() => {
    if (!id) return
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          router.push("/marketplace")
          return
        }
        setProduct(data)
      })
      .catch(() => router.push("/marketplace"))
      .finally(() => setLoading(false))
  }, [id, router])

  const handleTransaction = async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/auth/login")
      return
    }

    setPurchasing(true)
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: id, type: product?.type }),
      })
      if (res.ok) {
        setPurchased(true)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setPurchasing(false)
    }
  }

  const handleChat = () => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/auth/login")
      return
    }
    router.push(`/chat?userId=${product?.sellerId}&productId=${id}`)
  }

  const handleWishlist = async () => {
    const token = localStorage.getItem("token")
    if (!token) return
    await fetch("/api/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ productId: id }),
    })
    setInWishlist(!inWishlist)
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this listing? This cannot be undone.")) return
    const token = localStorage.getItem("token")
    if (!token) return
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) router.push("/marketplace")
    } catch (err) {
      console.error(err)
    }
  }

  const handleFeature = async () => {
    const token = localStorage.getItem("token")
    if (!token) return
    setFeaturing(true)
    setFeatureMsg("")
    try {
      const res = await fetch(`/api/products/${id}/feature`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (res.ok) {
        setProduct({ ...product!, isFeatured: true })
        setFeatureMsg("Featured! Your listing is now promoted.")
      } else {
        setFeatureMsg(data.error || "Failed to feature listing")
      }
    } catch {
      setFeatureMsg("Something went wrong")
    } finally {
      setFeaturing(false)
    }
  }

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  const fetchOffers = useCallback(async () => {
    if (!token) return
    try {
      const res = await fetch(`/api/products/${id}/offers`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setOffers(data)
      }
    } catch (err) {
      console.error("Failed to load offers:", err)
    }
  }, [id, token])

  useEffect(() => {
    if (!currentUser || !product) return
    if (currentUser.id === product.sellerId && product.type === "SELL") {
      const doFetch = async () => {
        if (!token) return
        try {
          const res = await fetch(`/api/products/${id}/offers`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          if (res.ok) {
            const data = await res.json()
            setOffers(data)
          }
        } catch (err) {
          console.error("Failed to load offers:", err)
        }
      }
      doFetch()
    }
  }, [currentUser?.id, product?.sellerId, product?.type, id, token, currentUser, product])

  const handleMakeOffer = async () => {
    const t = localStorage.getItem("token")
    if (!t) { router.push("/auth/login"); return }
    if (!offerAmount || parseFloat(offerAmount) <= 0) return
    setSubmittingOffer(true)
    try {
      const res = await fetch(`/api/products/${id}/offers`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${t}` },
        body: JSON.stringify({ amount: parseFloat(offerAmount), message: offerMessage || undefined }),
      })
      if (res.ok) {
        setOfferSubmitted(true)
        setOfferAmount("")
        setOfferMessage("")
      } else {
        const data = await res.json()
        alert(data.error || "Failed to submit offer")
      }
    } catch {
      alert("Something went wrong")
    } finally {
      setSubmittingOffer(false)
    }
  }

  const handleRespond = async (offerId: string, action: string) => {
    const t = localStorage.getItem("token")
    if (!t) return
    setResponding((prev) => ({ ...prev, [offerId]: true }))
    try {
      const body: Record<string, unknown> = { action }
      if (action === "counter") {
        const amt = counterAmounts[offerId]
        if (!amt || parseFloat(amt) <= 0) { alert("Enter a valid counter amount"); setResponding((prev) => ({ ...prev, [offerId]: false })); return }
        body.counterAmount = parseFloat(amt)
        body.counterMessage = counterMessages[offerId] || null
      }
      const res = await fetch(`/api/offers/${offerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${t}` },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (res.ok) {
        fetchOffers()
      } else {
        alert(data.error || "Failed to respond")
      }
    } catch {
      alert("Something went wrong")
    } finally {
      setResponding((prev) => ({ ...prev, [offerId]: false }))
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING": return <Badge variant="warning">Pending</Badge>
      case "COUNTERED": return <Badge variant="info">Countered</Badge>
      case "ACCEPTED": return <Badge variant="success">Accepted</Badge>
      case "REJECTED": return <Badge variant="danger">Rejected</Badge>
      case "WITHDRAWN": return <Badge variant="default">Withdrawn</Badge>
      default: return <Badge>{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  if (!product) return null

  const isOwner = currentUser?.id === product.sellerId

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-700 relative">
            {product.images?.[selectedImage] ? (
              <Image
                src={product.images[selectedImage]}
                alt={product.title}
                fill
                className="object-cover"
                onError={(e) => {
                  e.currentTarget.src = `https://placehold.co/600x400/e2e8f0/64748b?text=${encodeURIComponent(product.title.substring(0, 20))}`
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl">
                {getCategoryEmoji(product.category)}
              </div>
            )}
          </div>
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === i ? "border-emerald-500" : "border-gray-200"
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge>{getTypeLabel(product.type)}</Badge>
                <Badge variant="info">{getConditionLabel(product.condition)}</Badge>
                <span className="text-lg">{getCategoryEmoji(product.category)}</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{product.title}</h1>
            </div>
            <button onClick={handleWishlist} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <Heart className={`h-5 w-5 ${inWishlist ? "text-red-500 fill-red-500" : "text-gray-400"}`} />
            </button>
          </div>

          {product.department && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {product.department}{product.year ? ` • Year ${product.year}` : ""}
            </p>
          )}

          <div className="mb-6">
            {product.type === "DONATE" ? (
              <div className="text-3xl font-bold text-emerald-600">Free</div>
            ) : product.type === "RENT" && product.rentalPrice ? (
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {formatPrice(product.rentalPrice)}<span className="text-lg text-gray-500 dark:text-gray-400 font-normal">/day</span>
              </div>
            ) : product.price ? (
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{formatPrice(product.price)}</div>
            ) : null}
          </div>

          <div className="prose prose-sm text-gray-600 dark:text-gray-300 mb-6">
            <p>{product.description || "No description provided."}</p>
          </div>

          {product.type === "RENT" && product.rentalPeriod && (
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
              <Calendar className="h-4 w-4" />
              Rental period: {product.rentalPeriod}
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
            <MapPin className="h-4 w-4" />
            Campus • Listed {new Date(product.createdAt).toLocaleDateString()}
          </div>

          {product.seller && (
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl mb-6">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Sold by</p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <span className="font-semibold text-emerald-700">
                    {product.seller.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{product.seller.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {product.seller.department || "Student"}
                    {product.seller.year ? ` • Year ${product.seller.year}` : ""}
                  </p>
                </div>
                <div className="ml-auto flex items-center gap-1 text-emerald-600 text-sm">
                  <Leaf className="h-4 w-4" />
                  {product.seller.greenPoints || 0}
                </div>
              </div>
            </div>
          )}

          {product.isAvailable && !isOwner ? (
            <div className="flex gap-3">
              <Button onClick={handleTransaction} disabled={purchasing || purchased} className="flex-1 gap-2">
                {purchasing ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {purchased ? (
                  <><Check className="h-4 w-4" /> Request Sent</>
                ) : product.type === "DONATE" ? (
                  "Claim This Item"
                ) : product.type === "EXCHANGE" ? (
                  "Propose Exchange"
                ) : product.type === "RENT" ? (
                  "Rent Now"
                ) : (
                  "Buy Now"
                )}
              </Button>
              <Button variant="outline" onClick={handleChat} className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Chat
              </Button>
            </div>
          ) : isOwner && product.isAvailable ? (
            <div className="space-y-3">
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl text-sm text-amber-700 dark:text-amber-300">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  You are listing this item
                  {product.isFeatured && (
                    <Badge variant="success" className="ml-auto">
                      <Sparkles className="h-3 w-3 mr-1" /> Featured
                    </Badge>
                  )}
                </div>
              </div>
              {!product.isFeatured && (
                <Button
                  variant="outline"
                  onClick={handleFeature}
                  disabled={featuring || (currentUser?.greenPoints ?? 0) < FEATURE_COST_POINTS}
                  className="w-full gap-2"
                >
                  {featuring ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  Promote to Featured ({FEATURE_COST_POINTS} pts)
                </Button>
              )}
              {featureMsg && (
                <p className={`text-sm ${featureMsg.startsWith("Featured") ? "text-emerald-600" : "text-red-500"}`}>
                  {featureMsg}
                </p>
              )}
              {!product.isFeatured && (currentUser?.greenPoints ?? 0) < FEATURE_COST_POINTS && (
                <p className="text-xs text-gray-400">
                  You need {FEATURE_COST_POINTS} green points. You have {currentUser?.greenPoints || 0}.
                </p>
              )}
              <Button variant="danger" onClick={handleDelete} className="w-full gap-2">
                <Trash2 className="h-4 w-4" />
                Delete Listing
              </Button>
            </div>
          ) : isOwner ? (
            <div className="space-y-3">
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  This item has been sold
                </div>
              </div>
              <Button variant="danger" onClick={handleDelete} className="w-full gap-2">
                <Trash2 className="h-4 w-4" />
                Delete Listing
              </Button>
            </div>
          ) : (
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-500 dark:text-gray-400">
              This item is no longer available
            </div>
          )}

          {product.isAvailable && !isOwner && product.type === "SELL" && (
            <div className="mt-6 p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-emerald-600" />
                Make an Offer
              </h3>
              {offerSubmitted ? (
                <div className="text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                  <Check className="h-4 w-4" /> Offer submitted! The seller will review it.
                  <button onClick={() => setOfferSubmitted(false)} className="text-gray-400 hover:text-gray-600 ml-auto">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Your offer (₹)</label>
                    <input
                      type="number"
                      value={offerAmount}
                      onChange={(e) => setOfferAmount(e.target.value)}
                      placeholder={`Enter amount (listed at ${product.price ? formatPrice(product.price) : "N/A"})`}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Message (optional)</label>
                    <textarea
                      value={offerMessage}
                      onChange={(e) => setOfferMessage(e.target.value)}
                      placeholder="Explain why you're offering this amount..."
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                    />
                  </div>
                  <Button onClick={handleMakeOffer} disabled={submittingOffer || !offerAmount || parseFloat(offerAmount) <= 0} className="w-full gap-2">
                    {submittingOffer ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    Submit Offer
                  </Button>
                </div>
              )}
            </div>
          )}

          {isOwner && product.type === "SELL" && (
            <div className="mt-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-emerald-600" />
                Offers ({offers.length})
              </h3>
              {offers.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">No offers yet.</p>
              ) : (
                <div className="space-y-3">
                  {offers.map((offer) => (
                    <div key={offer.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                              <span className="font-semibold text-emerald-700 text-sm">
                                {offer.buyer?.name?.charAt(0).toUpperCase() || "?"}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-sm text-gray-900 dark:text-white">{offer.buyer?.name}</p>
                              <p className="text-xs text-gray-500">
                                {offer.buyer?.department || "Student"}
                                {offer.buyer?.year ? ` • Year ${offer.buyer.year}` : ""}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900 dark:text-white">{formatPrice(offer.amount)}</p>
                          {getStatusBadge(offer.status)}
                        </div>
                      </div>

                      {offer.message && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 bg-gray-50 dark:bg-gray-800/50 p-2 rounded">
                          &ldquo;{offer.message}&rdquo;
                        </p>
                      )}

                      {offer.status === "COUNTERED" && offer.counterAmount && (
                        <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-sm">
                          <span className="font-medium text-blue-700 dark:text-blue-300">Your counter: </span>
                          <span className="text-blue-700 dark:text-blue-300 font-bold">{formatPrice(offer.counterAmount)}</span>
                          {offer.counterMessage && <p className="text-blue-600 dark:text-blue-400 mt-1">{offer.counterMessage}</p>}
                        </div>
                      )}

                      {(offer.status === "PENDING" || offer.status === "COUNTERED") && (
                        <div className="mt-3 space-y-2">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => handleRespond(offer.id, "accept")}
                              disabled={responding[offer.id]}
                              className="flex-1 gap-1"
                            >
                              {responding[offer.id] ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => handleRespond(offer.id, "reject")}
                              disabled={responding[offer.id]}
                              className="flex-1 gap-1"
                            >
                              {responding[offer.id] ? <Loader2 className="h-3 w-3 animate-spin" /> : <X className="h-3 w-3" />}
                              Reject
                            </Button>
                          </div>
                          <details className="text-sm">
                            <summary className="cursor-pointer text-emerald-600 hover:text-emerald-700 font-medium">
                              Counter Offer
                            </summary>
                            <div className="mt-2 space-y-2 p-2 bg-gray-50 dark:bg-gray-800/50 rounded">
                              <input
                                type="number"
                                value={counterAmounts[offer.id] || ""}
                                onChange={(e) => setCounterAmounts((prev) => ({ ...prev, [offer.id]: e.target.value }))}
                                placeholder="Your counter amount (₹)"
                                className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                              />
                              <textarea
                                value={counterMessages[offer.id] || ""}
                                onChange={(e) => setCounterMessages((prev) => ({ ...prev, [offer.id]: e.target.value }))}
                                placeholder="Message (optional)"
                                rows={1}
                                className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                              />
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => handleRespond(offer.id, "counter")}
                                disabled={responding[offer.id]}
                                className="w-full gap-1"
                              >
                                {responding[offer.id] ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
                                Send Counter
                              </Button>
                            </div>
                          </details>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
