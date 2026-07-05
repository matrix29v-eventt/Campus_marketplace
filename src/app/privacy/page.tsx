import Link from "next/link"
import { Shield } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="h-8 w-8 text-emerald-600" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Privacy Policy</h1>
      </div>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">Last updated: June 2026</p>

      <div className="prose prose-gray max-w-none space-y-6">
        <Section title="1. Information We Collect">
          <p>We collect information you provide during registration: name, college email address, department, and year of study. When you list items, we collect product details, images, and pricing information.</p>
        </Section>

        <Section title="2. How We Use Your Information">
          <p>Your information is used to: (a) create and maintain your account, (b) facilitate transactions between buyers and sellers, (c) provide chat functionality, (d) calculate sustainability metrics, and (e) improve our platform.</p>
        </Section>

        <Section title="3. Email Verification">
          <p>CampusKart uses college email verification to ensure a trusted student-only marketplace. Your email is used solely for authentication and transaction notifications.</p>
        </Section>

        <Section title="4. Data Sharing">
          <p>We do not sell your personal data. Transaction-related information (name, department) is shared between buyers and sellers to facilitate trades. Chat messages are visible only to the participants.</p>
        </Section>

        <Section title="5. Data Security">
          <p>Passwords are hashed using bcrypt. All communications are encrypted via HTTPS. JWT tokens are used for secure authentication.</p>
        </Section>

        <Section title="6. Your Rights">
          <p>You can request deletion of your account and associated data at any time. Contact us through the platform to exercise your rights.</p>
        </Section>

        <Section title="7. Contact">
          <p>For privacy-related inquiries, please contact the platform administrators through the in-app chat or email.</p>
        </Section>
      </div>

      <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
        <Link href="/" className="text-emerald-600 hover:text-emerald-700">Back to Home</Link>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h2>
      <div className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{children}</div>
    </div>
  )
}
