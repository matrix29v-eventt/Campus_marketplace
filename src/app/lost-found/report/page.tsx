"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Loader2, X, ImagePlus, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AuthGuard } from "@/components/AuthGuard"

const reportCategories = [
  { value: "LOST", label: "Lost Item" },
  { value: "FOUND", label: "Found Item" },
]

const itemCategories = [
  { value: "ELECTRONICS", label: "Electronics" },
  { value: "BOOKS", label: "Books" },
  { value: "ID_CARD", label: "ID Card" },
  { value: "BAG", label: "Bag" },
  { value: "BOTTLE", label: "Bottle" },
  { value: "UMBRELLA", label: "Umbrella" },
  { value: "CLOTHING", label: "Clothing" },
  { value: "OTHER", label: "Other" },
]

export default function ReportLostFoundPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "LOST",
    itemCategory: "",
    location: "",
    date: "",
    contactInfo: "",
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value })
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    const reader = new FileReader()
    reader.onload = () => {
      if (reader.result) setImages([...images, reader.result as string])
    }
    reader.readAsDataURL(files[0])
    e.target.value = ""
  }

  const removeImage = (index: number) => setImages(images.filter((_, i) => i !== index))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) { router.push("/auth/login"); return }

      const res = await fetch("/api/lost-found", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          category: form.category,
          location: form.location || undefined,
          date: form.date || undefined,
          images,
          contactInfo: form.contactInfo || undefined,
        }),
      })

      const data = await res.json()
      if (res.ok) {
        router.push(`/lost-found/${data.id}`)
      } else {
        setError(data.error || "Failed to report")
      }
    } catch {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthGuard>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Report Item</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Report a lost or found item on campus</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>}

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
            <h2 className="font-semibold text-gray-900 dark:text-white">Type</h2>
            <div className="grid grid-cols-2 gap-3">
              {reportCategories.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setForm({ ...form, category: c.value })}
                  className={`p-3 rounded-lg border-2 text-center transition-all ${
                    form.category === c.value
                      ? c.value === "LOST"
                        ? "border-red-500 bg-red-50 dark:bg-red-900/30"
                        : "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30"
                      : "border-gray-200 dark:border-gray-600"
                  }`}
                >
                  <p className="font-medium text-sm text-gray-900 dark:text-white">{c.label}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
            <h2 className="font-semibold text-gray-900 dark:text-white">Details</h2>
            <Input label="Title *" type="text" id="title" placeholder="e.g. Blue Water Bottle" value={form.title} onChange={handleChange} required />
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description *</label>
              <textarea id="description" rows={3} placeholder="Describe the item in detail..." value={form.description} onChange={handleChange} required
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none" />
            </div>
            <div>
              <label htmlFor="itemCategory" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Item Category</label>
              <select id="itemCategory" value={form.itemCategory} onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-emerald-500 focus:outline-none">
                <option value="">Select Category</option>
                {itemCategories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <Input label="Location" type="text" id="location" placeholder="e.g. Library, 2nd Floor" value={form.location} onChange={handleChange} />
            <Input label="Date" type="date" id="date" value={form.date} onChange={handleChange} />
            <Input label="Contact Info" type="text" id="contactInfo" placeholder="Phone or room number" value={form.contactInfo} onChange={handleChange} />
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
            <h2 className="font-semibold text-gray-900 dark:text-white">Image (optional)</h2>
            <div className="flex flex-wrap gap-3">
              {images.map((url, i) => (
                <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                  <Image src={url} alt={`Image ${i + 1}`} fill className="object-cover" />
                  <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 p-0.5 bg-red-500 text-white rounded-full">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => fileInputRef.current?.click()} className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:text-emerald-600 hover:border-emerald-400 transition-colors">
                <ImagePlus className="h-5 w-5 mb-1" />
                <span className="text-xs">Add</span>
              </button>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Submit Report
          </Button>
        </form>
      </div>
    </AuthGuard>
  )
}
