"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Loader2, X, Info, ImagePlus, Link2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AuthGuard } from "@/components/AuthGuard"

const categories = [
  { value: "TEXTBOOKS", label: "Textbooks" },
  { value: "LAB_RECORDS", label: "Lab Records" },
  { value: "CALCULATORS", label: "Calculators" },
  { value: "DRAWING_INSTRUMENTS", label: "Drawing Instruments" },
  { value: "FURNITURE", label: "Furniture" },
  { value: "ELECTRONICS", label: "Electronics" },
  { value: "CLOTHING", label: "Clothing" },
  { value: "STATIONERY", label: "Stationery" },
  { value: "CYCLES", label: "Cycles" },
  { value: "OTHER", label: "Other" },
]

const conditions = [
  { value: "NEW", label: "New" },
  { value: "LIKE_NEW", label: "Like New" },
  { value: "GOOD", label: "Good" },
  { value: "FAIR", label: "Fair" },
  { value: "POOR", label: "Poor" },
]

const types = [
  { value: "SELL", label: "Sell", desc: "Set a price and sell your item" },
  { value: "EXCHANGE", label: "Exchange", desc: "Trade with another student" },
  { value: "DONATE", label: "Donate", desc: "Give it away for free" },
  { value: "RENT", label: "Rent", desc: "Rent it out per day" },
]

export default function SellPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [uploadingImages, setUploadingImages] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    condition: "",
    type: "SELL",
    department: "",
    year: "",
    rentalPrice: "",
    rentalPeriod: "",
    courseCode: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value })
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploadingImages(true)
    const readers: Promise<string>[] = []

    for (let i = 0; i < files.length; i++) {
      readers.push(
        new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(files[i])
        })
      )
    }

    Promise.all(readers)
      .then((dataUrls) => {
        setImages((prev) => [...prev, ...dataUrls])
      })
      .catch(() => setError("Failed to read image files"))
      .finally(() => {
        setUploadingImages(false)
        if (fileInputRef.current) fileInputRef.current.value = ""
      })
  }

  const addImageUrl = () => {
    const url = prompt("Enter image URL:")
    if (url && url.trim()) {
      setImages([...images, url.trim()])
    }
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/auth/login")
        return
      }

      const body: Record<string, string | number | string[]> = { ...form }
      if (body.price) body.price = parseFloat(body.price as string)
      if (body.rentalPrice) body.rentalPrice = parseFloat(body.rentalPrice as string)
      if (body.year) body.year = parseInt(body.year as string)
      body.images = images.length > 0 ? images : ["https://placehold.co/600x400/e2e8f0/64748b?text=Item"]

      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      })

      const data = await res.json()
      if (res.ok) {
        router.push(`/marketplace/${data.id}`)
      } else {
        setError(data.error || "Failed to create listing")
      }
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const suggestedPrice = form.category && form.condition ? (
    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-sm">
      <div className="flex items-center gap-2 text-emerald-700 font-medium mb-1">
        <Info className="h-4 w-4" />
        AI Price Suggestion
      </div>
      <p className="text-emerald-600">
        Recommended price range: ₹{form.category === "TEXTBOOKS" ? "100" : "200"} – ₹{form.category === "TEXTBOOKS" ? "500" : "1500"}
      </p>
    </div>
  ) : null

  return (
    <AuthGuard>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">List an Item</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Sell, exchange, donate, or rent your items to fellow students</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">{error}</div>
          )}

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
            <h2 className="font-semibold text-gray-900 dark:text-white">Listing Type</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {types.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setForm({ ...form, type: t.value })}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    form.type === t.value
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30"
                      : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                  }`}
                >
                  <p className="font-medium text-sm text-gray-900 dark:text-white">{t.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
            <h2 className="font-semibold text-gray-900 dark:text-white">Item Details</h2>

            <Input label="Title *" type="text" id="title" placeholder="e.g. Engineering Mathematics Textbook" value={form.title} onChange={handleChange} required />

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <textarea
                id="description"
                rows={3}
                placeholder="Describe the item condition, reason for selling, etc."
                value={form.description}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none"
              />
            </div>

            <Input label="Course Code (optional)" type="text" id="courseCode" placeholder="e.g. CS101, MA201" value={form.courseCode} onChange={handleChange} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category *</label>
                <select id="category" value={form.category} onChange={handleChange} required
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-emerald-500 focus:outline-none">
                  <option value="">Select Category</option>
                  {categories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="condition" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Condition *</label>
                <select id="condition" value={form.condition} onChange={handleChange} required
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-emerald-500 focus:outline-none">
                  <option value="">Select Condition</option>
                  {conditions.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
            </div>

            {suggestedPrice}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {form.type === "SELL" && (
                <Input label="Price (₹) *" type="number" id="price" placeholder="250" value={form.price} onChange={handleChange} required={form.type === "SELL"} />
              )}
              {form.type === "RENT" && (
                <>
                  <Input label="Rental Price (₹/day) *" type="number" id="rentalPrice" placeholder="20" value={form.rentalPrice} onChange={handleChange} required={form.type === "RENT"} />
                  <Input label="Rental Period" type="text" id="rentalPeriod" placeholder="e.g. Per day, Weekly" value={form.rentalPeriod} onChange={handleChange} />
                </>
              )}
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department</label>
                <select id="department" value={form.department} onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-emerald-500 focus:outline-none">
                  <option value="">Select Department</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Civil">Civil</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Information Technology">Information Technology</option>
                </select>
              </div>
              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Year</label>
                <select id="year" value={form.year} onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-emerald-500 focus:outline-none">
                  <option value="">Select Year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
            <h2 className="font-semibold text-gray-900 dark:text-white">Images</h2>
            <div className="flex flex-wrap gap-3">
              {images.map((url, i) => (
                <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                  <Image src={url} alt={`Image ${i + 1}`} fill className="object-cover" />
                  <button type="button" onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 p-0.5 bg-red-500 text-white rounded-full">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <div className="flex flex-col gap-2">
                <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploadingImages}
                  className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:text-emerald-600 hover:border-emerald-400 transition-colors disabled:opacity-50">
                  {uploadingImages ? (
                    <Loader2 className="h-5 w-5 animate-spin mb-1" />
                  ) : (
                    <ImagePlus className="h-5 w-5 mb-1" />
                  )}
                  <span className="text-xs">Upload</span>
                </button>
                <button type="button" onClick={addImageUrl}
                  className="text-xs text-gray-400 hover:text-emerald-600 transition-colors flex items-center justify-center gap-1">
                  <Link2 className="h-3 w-3" /> URL
                </button>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Publish Listing
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </AuthGuard>
  )
}
