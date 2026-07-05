"use client"

import Link from "next/link"
import { getCategoryEmoji } from "@/lib/utils"

const categories = [
  { key: "TEXTBOOKS", label: "Textbooks", desc: "Academic books & notes" },
  { key: "LAB_RECORDS", label: "Lab Records", desc: "Practical records & observations" },
  { key: "CALCULATORS", label: "Calculators", desc: "Scientific & graphing" },
  { key: "DRAWING_INSTRUMENTS", label: "Drawing", desc: "Instruments & boards" },
  { key: "FURNITURE", label: "Furniture", desc: "Hostel essentials" },
  { key: "ELECTRONICS", label: "Electronics", desc: "Laptops, phones & more" },
  { key: "CYCLES", label: "Cycles", desc: "Bicycles & accessories" },
  { key: "STATIONERY", label: "Stationery", desc: "Books, pens & supplies" },
]

export function CategoryGrid() {
  return (
    <section className="py-16 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Browse by Category</h2>
          <p className="text-gray-600 dark:text-gray-400">Find exactly what you need from your campus community</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.key}
              href={`/marketplace?category=${cat.key}`}
              className="group p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-emerald-300 dark:hover:border-emerald-600 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="text-3xl mb-3">{getCategoryEmoji(cat.key)}</div>
              <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                {cat.label}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{cat.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
