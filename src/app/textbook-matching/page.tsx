"use client"

import { useState } from "react"
import Link from "next/link"
import { BookOpen, Search, Loader2, ArrowLeft, GraduationCap } from "lucide-react"
import { ProductCard } from "@/components/ProductCard"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { ProductData } from "@/lib/types"

const commonCourseCodes = [
  { code: "CS101", subject: "Intro to CS", dept: "Computer Science" },
  { code: "CS201", subject: "Data Structures", dept: "Computer Science" },
  { code: "CS301", subject: "Algorithms", dept: "Computer Science" },
  { code: "EC101", subject: "Basic Electronics", dept: "Electronics" },
  { code: "EC201", subject: "Digital Electronics", dept: "Electronics" },
  { code: "ME101", subject: "Engineering Mechanics", dept: "Mechanical" },
  { code: "ME201", subject: "Thermodynamics", dept: "Mechanical" },
  { code: "CE101", subject: "Civil Engineering Basics", dept: "Civil" },
  { code: "EE101", subject: "Electrical Basics", dept: "Electrical" },
  { code: "MA101", subject: "Engineering Mathematics I", dept: "Computer Science" },
  { code: "MA201", subject: "Engineering Mathematics II", dept: "Computer Science" },
  { code: "PH101", subject: "Engineering Physics", dept: "Computer Science" },
]

export default function TextbookMatchingPage() {
  const [courseCode, setCourseCode] = useState("")
  const [department, setDepartment] = useState("")
  const [products, setProducts] = useState<ProductData[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState("")

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!courseCode.trim()) return

    setLoading(true)
    setSearched(true)
    setError("")

    try {
      const params = new URLSearchParams({ courseCode: courseCode.trim() })
      if (department) params.set("department", department)

      const res = await fetch(`/api/textbook-matching?${params}`)
      const data = await res.json()
      setProducts(data.products || [])
    } catch (err) {
      console.error(err)
      setError("Failed to search")
    } finally {
      setLoading(false)
    }
  }

  const quickSearch = async (code: string) => {
    setCourseCode(code)
    setLoading(true)
    setSearched(true)
    setError("")
    try {
      const params = new URLSearchParams({ courseCode: code })
      const res = await fetch(`/api/textbook-matching?${params}`)
      const data = await res.json()
      setProducts(data.products || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-4 mb-2">
        <Link href="/marketplace" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Textbook Matching</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Find required textbooks by course code</p>
        </div>
      </div>

      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200 dark:border-blue-800 rounded-xl mb-8 mt-4">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          <strong>AI-Powered Matching:</strong> Enter your course code to instantly find seniors who have listed the exact textbooks you need for your courses this semester.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSearch} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="h-5 w-5 text-emerald-600" />
              <h2 className="font-semibold text-gray-900 dark:text-white">Search by Course Code</h2>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="e.g. CS101, MA201, EC301"
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value.toUpperCase())}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="">Any Dept</option>
                <option value="Computer Science">CS</option>
                <option value="Electronics">EC</option>
                <option value="Mechanical">ME</option>
                <option value="Civil">CE</option>
                <option value="Electrical">EE</option>
              </select>
              <Button type="submit" disabled={loading || !courseCode.trim()}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Search className="h-4 w-4 mr-2" />}
                Search
              </Button>
            </div>
          </form>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600">{error}</div>
          )}

          {loading && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 animate-pulse">
                  <div className="aspect-[4/3] bg-gray-200 dark:bg-gray-700 rounded-lg mb-3" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                </div>
              ))}
            </div>
          )}

          {!loading && searched && (
            <div>
              {products.length > 0 ? (
                <>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Found {products.length} textbook{products.length > 1 ? "s" : ""} for &quot;{courseCode}&quot;
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                  <BookOpen className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">No textbooks found for &quot;{courseCode}&quot;</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Try a different course code or check the marketplace directly</p>
                </div>
              )}
            </div>
          )}

          {!searched && !loading && (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <Search className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">Enter a course code to find matching textbooks</p>
            </div>
          )}
        </div>

        <div>
          <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-emerald-600" />
              Common Course Codes
            </h3>
            <div className="space-y-1.5">
              {commonCourseCodes.map((item) => (
                <button
                  key={item.code}
                  onClick={() => quickSearch(item.code)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
                >
                  <div>
                    <span className="font-mono font-medium text-emerald-600 dark:text-emerald-400">{item.code}</span>
                    <span className="text-gray-500 dark:text-gray-400 ml-2">{item.subject}</span>
                  </div>
                  <Badge variant="default" className="text-[10px]">{item.dept.split(" ")[0]}</Badge>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
