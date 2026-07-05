"use client"

import Link from "next/link"
import Image from "next/image"
import { MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { formatPrice, getCategoryEmoji, getConditionLabel, getTypeLabel } from "@/lib/utils"
import type { ProductData } from "@/lib/types"

interface ProductCardProps {
  product: ProductData
}

export function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.images?.[0] || "/placeholder.svg"

  return (
    <Link href={`/marketplace/${product.id}`}>
      <div className="group rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden">
        <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-700 relative overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.currentTarget.src = `https://placehold.co/400x300/e2e8f0/64748b?text=${encodeURIComponent(product.title.substring(0, 20))}`
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">
              {getCategoryEmoji(product.category)}
            </div>
          )}
          <div className="absolute top-2 left-2 flex gap-1.5">
            <Badge variant={product.type === "DONATE" ? "success" : product.type === "EXCHANGE" ? "info" : product.type === "RENT" ? "warning" : "default"}>
              {getTypeLabel(product.type)}
            </Badge>
            {product.condition && (
              <Badge variant="default">{getConditionLabel(product.condition)}</Badge>
            )}
          </div>
          {product.isFeatured && (
            <div className="absolute top-2 right-2">
              <Badge variant="warning">Featured</Badge>
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between mb-1">
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-1 flex-1">{product.title}</h3>
          </div>
          {product.department && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{product.department}{product.year ? ` • Year ${product.year}` : ""}</p>
          )}
          <div className="flex items-center justify-between">
            <div>
              {product.type === "DONATE" ? (
                <span className="text-emerald-600 font-bold text-sm">Free</span>
              ) : product.type === "RENT" && product.rentalPrice ? (
                <span className="text-gray-900 font-bold text-sm">{formatPrice(product.rentalPrice)}<span className="text-gray-500 font-normal text-xs">/day</span></span>
              ) : product.price ? (
                <span className="text-gray-900 dark:text-white font-bold text-sm">{formatPrice(product.price)}</span>
              ) : null}
            </div>
            <div className="flex items-center gap-1 text-gray-400 dark:text-gray-500 text-xs">
              <MapPin className="h-3 w-3" />
              <span>Campus</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
