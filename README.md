<div align="center">
  <img src="https://img.shields.io/badge/Next.js%2016-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
</div>

<br />

<div align="center">
  <h1>🎓 CampusKart</h1>
  <p><strong>A Sustainable Campus Marketplace — Buy, Sell, Exchange, Rent & Donate</strong></p>
  <p>Built for students, by students. Reduce waste, save money, and build community.</p>

  <br />

  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-project-structure">Project Structure</a> •
  <a href="#-sustainability">Sustainability</a> •
  <a href="#-license">License</a>
</div>

<br />

---

## ✨ Features

### 🛍️ Marketplace
- **Multi-type listings** — Sell, exchange, donate, or rent items within your campus
- **10+ categories** — Textbooks, lab records, calculators, electronics, furniture, and more
- **Advanced search & filters** — Find exactly what you need by category, condition, department, or course code
- **Image uploads** — Powered by Cloudinary for fast, reliable media
- **Wishlists** — Save items and get notified when prices drop

### 💬 Offers & Negotiation
- Make offers on listings with custom pricing
- Sellers can counter-offer with a different amount
- Real-time negotiation tracked with status updates (pending, countered, accepted, rejected)

### 👥 Group Buying
- Organize group purchases for bulk discounts
- Set minimum/maximum participants and discount percentages
- Track participation and deal status in real time

### 🔁 Bundles
- Create product bundles for discounted combo deals
- Perfect for selling semester kits (textbooks + lab records + instruments)

### 📦 Lost & Found
- Report lost or found items on campus
- Include location, date, images, and contact info
- Claim items with direct messaging

### 🌱 Sustainability Dashboard
- Track **green points** earned by reusing items
- Visualize **items reused**, **trees saved**, and **waste reduced**
- Every transaction contributes to a greener campus

### 💬 Messaging
- In-app chat between buyers and sellers
- Share images and negotiate directly

### 🔐 Authentication & Roles
- Secure JWT-based authentication
- Roles: **Student**, **Alumni**, **Admin**
- College affiliation tracking

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Database** | [PostgreSQL](https://www.postgresql.org/) |
| **ORM** | [Prisma](https://www.prisma.io/) |
| **Auth** | JWT + bcryptjs |
| **UI** | [Tailwind CSS v4](https://tailwindcss.com/) + shadcn/ui primitives |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Media** | [Cloudinary](https://cloudinary.com/) |
| **Linting** | ESLint (Next.js config) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18
- **PostgreSQL** (local or remote)
- **Cloudinary account** (for image uploads)

### Installation

```bash
# Clone the repository
git clone https://github.com/matrix29v-eventt/Campus_marketplace.git
cd Campus_marketplace

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database URL and Cloudinary credentials

# Run database migrations
npm run db:migrate

# Seed sample data
npm run seed

# Start the development server
npm run dev
```

Visit **[http://localhost:3000](http://localhost:3000)** to see the app.

### Environment Variables

```env
DATABASE_URL="postgresql://user:password@localhost:5432/campus_marketplace"
JWT_SECRET="your-secret-key"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

---

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── about/              # About page
│   ├── api/                # API routes (RESTful endpoints)
│   ├── auth/               # Login & registration
│   ├── chat/               # In-app messaging
│   ├── dashboard/          # User dashboard
│   ├── lost-found/         # Lost & found reports
│   ├── marketplace/        # Product listings & browsing
│   ├── privacy/            # Privacy policy
│   ├── sustainability/     # Sustainability dashboard
│   ├── terms/              # Terms of service
│   ├── textbook-matching/  # Textbook matchmaking
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Homepage
├── components/             # Reusable UI components
│   ├── ui/                 # shadcn/ui primitives
│   ├── AuthGuard.tsx       # Route protection
│   ├── CategoryGrid.tsx    # Category navigation
│   ├── Footer.tsx          # Site footer
│   ├── Hero.tsx            # Homepage hero section
│   ├── Navbar.tsx          # Navigation bar
│   ├── ProductCard.tsx     # Product listing card
│   ├── SearchBar.tsx       # Search & filter
│   ├── SustainabilityDashboard.tsx
│   └── ThemeProvider.tsx   # Theme context
├── lib/                    # Utilities & services
│   ├── auth.ts             # JWT helpers
│   ├── prisma.ts           # Prisma client singleton
│   ├── types.ts            # Shared TypeScript types
│   └── utils.ts            # Helper functions
prisma/
├── schema.prisma           # Database schema
└── seed.ts                 # Sample data seeder
scripts/
└── generate-pitch-deck.ts  # Auto-generate pitch deck
```

---

## 🌱 Sustainability Impact

CampusKart isn't just a marketplace — it's a movement toward **circular economy on campus**. Every item reused means:

- 🌳 **Trees saved** — Fewer textbooks printed
- ♻️ **Waste reduced** — Electronics, furniture, and clothes kept out of landfills
- 💰 **Money saved** — Students buy used instead of new
- 🤝 **Community built** — Students helping students

The **Sustainability Dashboard** gives every user a personal impact score with green points, making sustainable choices visible and rewarding.

---

## 📊 Database Schema

The schema includes **12 models** covering the full application domain:

- `User` — Student, Alumni, Admin roles with sustainability tracking
- `Product` — Listings with category, condition, type, pricing
- `Transaction` — Buy, sell, exchange, rent records
- `Message` — In-app chat between users
- `Offer` — Price negotiation with counter-offers
- `GroupBuy` / `GroupBuyParticipant` — Group purchasing
- `Bundle` / `BundleItem` — Combo deals
- `LostFoundItem` — Campus lost & found
- `SustainabilityLog` — Green point tracking
- `Wishlist` — Saved items

---

## 🧪 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run seed` | Seed database with sample data |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:push` | Push schema changes to DB |
| `npm run pitch` | Generate pitch deck (PPTX) |

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues and pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">
  <p>Made with ❤️ for campus communities everywhere</p>
  <p>
    <a href="https://github.com/matrix29v-eventt/Campus_marketplace/issues">Report Bug</a> •
    <a href="https://github.com/matrix29v-eventt/Campus_marketplace/issues">Request Feature</a>
  </p>
</div>
