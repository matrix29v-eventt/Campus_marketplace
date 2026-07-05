import Link from "next/link"
import { FileText } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="h-8 w-8 text-emerald-600" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Terms of Service</h1>
      </div>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">Last updated: June 2026</p>

      <div className="prose prose-gray max-w-none space-y-6">
        <Section title="1. Acceptance of Terms">
          <p>By accessing and using CampusKart, you agree to be bound by these Terms of Service. If you do not agree, please do not use the platform.</p>
        </Section>

        <Section title="2. Eligibility">
          <p>You must be a current college student, alumni, or faculty member with a valid college email address to use CampusKart. You must be at least 18 years old or have parental consent.</p>
        </Section>

        <Section title="3. User Accounts">
          <p>You are responsible for maintaining the confidentiality of your account credentials. You must provide accurate and complete information during registration. Each user may maintain only one account.</p>
        </Section>

        <Section title="4. Listings & Transactions">
          <p>All items listed must be legal and accurately described. Prohibited items include: counterfeit goods, dangerous items, stolen property, and any items prohibited by law. Users are responsible for completing transactions in good faith.</p>
        </Section>

        <Section title="5. Exchange & Rental Terms">
          <p>For exchanges: both parties must agree on the terms before swapping items. For rentals: the renter is responsible for returning items in the same condition. Security deposits may be arranged between users.</p>
        </Section>

        <Section title="6. Donations">
          <p>Donated items are offered &ldquo;as-is&rdquo; without warranty. Once a donation is claimed and picked up, the transaction is final. The platform facilitates connections but is not responsible for item condition.</p>
        </Section>

        <Section title="7. Prohibited Conduct">
          <p>Users may not: harass others, post false information, attempt to scam or defraud, use the platform for commercial advertising, or violate any applicable laws.</p>
        </Section>

        <Section title="8. Limitation of Liability">
          <p>CampusKart is a platform connecting students. We are not a party to any transaction between users. We are not responsible for the quality, safety, or legality of listed items. All transactions are at the users&apos; own risk.</p>
        </Section>

        <Section title="9. Termination">
          <p>We reserve the right to suspend or terminate accounts that violate these terms or engage in fraudulent activity. Users may delete their accounts at any time.</p>
        </Section>

        <Section title="10. Changes to Terms">
          <p>We may update these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms.</p>
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
