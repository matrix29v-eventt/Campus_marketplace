"use client"

import Link from "next/link"
import { Leaf, GraduationCap, Users, Target } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">About CampusKart</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">Empowering students to buy, sell, exchange, donate, and rent campus essentials — affordably and sustainably.</p>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {[
          { icon: Leaf, title: "Our Mission", desc: "Reduce campus waste by enabling reuse of textbooks, electronics, furniture, and hostel essentials among students." },
          { icon: GraduationCap, title: "For Students", desc: "A trusted marketplace verified by college emails so you can transact safely within your campus community." },
          { icon: Users, title: "Community First", desc: "Built by students, for students. Every transaction strengthens the campus economy and reduces costs." },
          { icon: Target, title: "Real Impact", desc: "Track your sustainability score — every reused item saves trees, reduces waste, and earns Green Points." },
        ].map((item) => (
          <div key={item.title} className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <item.icon className="h-8 w-8 text-emerald-600 mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-xl p-8 text-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Join Your Campus Marketplace</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Sign up with your college email and start saving money today.</p>
        <Link href="/auth/register"><Button>Get Started</Button></Link>
      </div>
    </div>
  )
}
