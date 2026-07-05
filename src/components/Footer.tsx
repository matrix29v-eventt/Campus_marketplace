import Link from "next/link"
import { Leaf } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Leaf className="h-6 w-6 text-emerald-400" />
              <span className="text-lg font-bold text-white">CampusKart</span>
            </Link>
            <p className="text-sm text-gray-400 max-w-md">
              The trusted student marketplace for buying, selling, exchanging, donating, 
              and renting academic essentials. Reduce waste and save money.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Marketplace</h3>
            <ul className="space-y-2">
              {["Buy", "Sell", "Exchange", "Donate", "Rent"].map((item) => (
                <li key={item}>
                  <Link href={`/marketplace?type=${item.toUpperCase()}`} className="text-sm hover:text-emerald-400 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-2">
              {["About", "Sustainability", "Privacy", "Terms"].map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase()}`} className="text-sm hover:text-emerald-400 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
          <div className="border-t border-gray-800 dark:border-gray-800/50 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">&copy; 2026 CampusKart. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500">Made for a sustainable campus future</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
