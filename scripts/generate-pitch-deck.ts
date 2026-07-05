import PptxGenJS from "pptxgenjs"

const GREEN = "059669"
const DARK_GREEN = "065F46"
const LIGHT_GREEN = "D1FAE5"
const WHITE = "FFFFFF"
const GRAY_50 = "F9FAFB"
const GRAY_100 = "F3F4F6"
const GRAY_600 = "4B5563"
const GRAY_700 = "374151"
const GRAY_900 = "111827"

const pres = new PptxGenJS()
pres.defineLayout({ name: "WIDE", width: 10, height: 5.625 })
pres.layout = "WIDE"

pres.author = "CampusKart Team"
pres.title = "CampusKart — Campus-to-Campus Student Marketplace"
pres.subject = "Pitch Deck"

// ── Slide 1: Title ──
{
  const slide = pres.addSlide()
  slide.background = { fill: GREEN }

  slide.addShape(pres.ShapeType.rect, {
    x: 0, y: 0, w: 10, h: 5.625,
    fill: { color: DARK_GREEN },
  })

  slide.addText("CAMPUSKART", {
    x: 0.5, y: 1.0, w: 9, h: 1.0,
    fontSize: 52, color: WHITE, fontFace: "Segoe UI", bold: true, align: "center",
  })

  slide.addText("Campus-to-Campus Student Marketplace", {
    x: 0.5, y: 1.9, w: 9, h: 0.6,
    fontSize: 22, color: LIGHT_GREEN, fontFace: "Segoe UI", align: "center",
  })

  slide.addShape(pres.ShapeType.rect, {
    x: 3.5, y: 2.7, w: 3, h: 0.04,
    fill: { color: WHITE },
  })

  slide.addText("Buy · Sell · Exchange · Donate · Rent", {
    x: 0.5, y: 2.95, w: 9, h: 0.5,
    fontSize: 16, color: WHITE, fontFace: "Segoe UI", align: "center",
  })

  slide.addText("Academic essentials, trusted campus network, zero waste.", {
    x: 0.5, y: 3.6, w: 9, h: 0.4,
    fontSize: 13, color: LIGHT_GREEN, fontFace: "Segoe UI", align: "center", italic: true,
  })

  slide.addText("College of Engineering, Trivandrum", {
    x: 0.5, y: 4.6, w: 9, h: 0.4,
    fontSize: 12, color: WHITE, fontFace: "Segoe UI", align: "center", transparency: 30,
  })
}

// ── Slide 2: The Problem ──
{
  const slide = pres.addSlide()
  slide.background = { fill: WHITE }

  slide.addText("💡", { x: 0.6, y: 0.3, w: 0.8, h: 0.8, fontSize: 32 })

  slide.addText("The Problem", {
    x: 1.5, y: 0.3, w: 8, h: 0.8,
    fontSize: 28, color: GRAY_900, fontFace: "Segoe UI", bold: true, valign: "middle",
  })

  slide.addShape(pres.ShapeType.rect, {
    x: 0.6, y: 1.2, w: 8.8, h: 0.04,
    fill: { color: GREEN },
  })

  const problems = [
    { stat: "₹5,000–15,000", label: "Per semester spend\non textbooks & instruments", color: "EF4444" },
    { stat: "25–50 tonnes", label: "Academic waste per\ncampus every year", color: "F59E0B" },
    { stat: "60%", label: "Students who struggle\nwith material costs", color: "3B82F6" },
    { stat: "0", label: "Campus-specific\nmarketplaces exist", color: "8B5CF6" },
  ]

  problems.forEach((p, i) => {
    const x = 0.6 + i * 2.3
    slide.addShape(pres.ShapeType.roundRect, {
      x, y: 1.6, w: 2.0, h: 2.6,
      fill: { color: GRAY_50 },
      line: { color: GRAY_100, width: 1 },
      rectRadius: 8,
    })
    slide.addText(p.stat, {
      x, y: 1.7, w: 2.0, h: 0.9,
      fontSize: 20, color: p.color, fontFace: "Segoe UI", bold: true, align: "center", valign: "middle",
    })
    slide.addText(p.label, {
      x, y: 2.6, w: 2.0, h: 1.4,
      fontSize: 11, color: GRAY_600, fontFace: "Segoe UI", align: "center", valign: "top",
    })
  })

  slide.addText("No platform exists where students can buy, sell, exchange, donate, or rent academic items within their own campus community.", {
    x: 0.6, y: 4.5, w: 8.8, h: 0.6,
    fontSize: 13, color: GRAY_600, fontFace: "Segoe UI", align: "center", italic: true,
  })
}

// ── Slide 3: The Solution ──
{
  const slide = pres.addSlide()
  slide.background = { fill: WHITE }

  slide.addText("✅", { x: 0.6, y: 0.3, w: 0.8, h: 0.8, fontSize: 32 })

  slide.addText("The Solution", {
    x: 1.5, y: 0.3, w: 8, h: 0.8,
    fontSize: 28, color: GRAY_900, fontFace: "Segoe UI", bold: true, valign: "middle",
  })

  slide.addShape(pres.ShapeType.rect, {
    x: 0.6, y: 1.2, w: 8.8, h: 0.04,
    fill: { color: GREEN },
  })

  const modes = [
    { icon: "💰", title: "Sell", desc: "Set a price and\nsell to juniors" },
    { icon: "🔄", title: "Exchange", desc: "Trade items\npeer-to-peer" },
    { icon: "🎁", title: "Donate", desc: "Give away free\nto those in need" },
    { icon: "⏱️", title: "Rent", desc: "Short-term rental\nfor exams" },
  ]

  modes.forEach((m, i) => {
    const x = 0.5 + i * 2.4
    slide.addShape(pres.ShapeType.roundRect, {
      x, y: 1.5, w: 2.1, h: 2.5,
      fill: { color: i === 2 ? LIGHT_GREEN : GRAY_50 },
      line: { color: i === 2 ? GREEN : GRAY_100, width: 1.5 },
      rectRadius: 8,
    })
    slide.addText(m.icon, {
      x, y: 1.6, w: 2.1, h: 0.8,
      fontSize: 28, align: "center", valign: "middle",
    })
    slide.addText(m.title, {
      x, y: 2.3, w: 2.1, h: 0.5,
      fontSize: 16, color: GRAY_900, fontFace: "Segoe UI", bold: true, align: "center",
    })
    slide.addText(m.desc, {
      x, y: 2.75, w: 2.1, h: 1.0,
      fontSize: 11, color: GRAY_600, fontFace: "Segoe UI", align: "center",
    })
  })

  slide.addShape(pres.ShapeType.roundRect, {
    x: 0.6, y: 4.3, w: 8.8, h: 0.9,
    fill: { color: "F0FDF4" },
    line: { color: "BBF7D0", width: 1 },
    rectRadius: 6,
  })

  slide.addText("🔐  College email gating ·  🎓  Academic categories ·  🌱  Sustainability tracking ·  🤖  AI price suggestions", {
    x: 0.8, y: 4.3, w: 8.4, h: 0.9,
    fontSize: 12, color: "166534", fontFace: "Segoe UI", align: "center", valign: "middle",
  })
}

// ── Slide 4: How It Works ──
{
  const slide = pres.addSlide()
  slide.background = { fill: WHITE }

  slide.addText("📋", { x: 0.6, y: 0.3, w: 0.8, h: 0.8, fontSize: 32 })

  slide.addText("How It Works", {
    x: 1.5, y: 0.3, w: 8, h: 0.8,
    fontSize: 28, color: GRAY_900, fontFace: "Segoe UI", bold: true, valign: "middle",
  })

  slide.addShape(pres.ShapeType.rect, {
    x: 0.6, y: 1.2, w: 8.8, h: 0.04,
    fill: { color: GREEN },
  })

  const steps = [
    { num: "01", title: "Sign Up", desc: "Register with your\ncollege email\n(e.g., name@cet.ac.in)", color: GREEN },
    { num: "02", title: "List or Browse", desc: "Post items you\nno longer need or\nfind what you want", color: "3B82F6" },
    { num: "03", title: "Connect & Trade", desc: "Chat directly with\npeers and complete\nthe transaction", color: "8B5CF6" },
  ]

  steps.forEach((s, i) => {
    const x = 0.6 + i * 3.15
    slide.addShape(pres.ShapeType.roundRect, {
      x, y: 1.5, w: 2.8, h: 3.2,
      fill: { color: GRAY_50 },
      line: { color: GRAY_100, width: 1 },
      rectRadius: 10,
    })

    slide.addShape(pres.ShapeType.roundRect, {
      x: x + 0.9, y: 1.7, w: 1.0, h: 1.0,
      fill: { color: s.color },
      rectRadius: 12,
    })
    slide.addText(s.num, {
      x: x + 0.9, y: 1.7, w: 1.0, h: 1.0,
      fontSize: 20, color: WHITE, fontFace: "Segoe UI", bold: true, align: "center", valign: "middle",
    })

    slide.addText(s.title, {
      x, y: 2.85, w: 2.8, h: 0.5,
      fontSize: 17, color: GRAY_900, fontFace: "Segoe UI", bold: true, align: "center",
    })

    slide.addText(s.desc, {
      x, y: 3.35, w: 2.8, h: 1.1,
      fontSize: 12, color: GRAY_600, fontFace: "Segoe UI", align: "center",
    })

    if (i < 2) {
      slide.addText("→", {
        x: 3.35 + i * 3.15, y: 2.6, w: 0.4, h: 0.5,
        fontSize: 24, color: GREEN, align: "center", valign: "middle",
      })
    }
  })

  slide.addText("⏱  Takes less than 2 minutes to list your first item", {
    x: 0.6, y: 4.9, w: 8.8, h: 0.5,
    fontSize: 12, color: GRAY_600, fontFace: "Segoe UI", align: "center", italic: true,
  })
}

// ── Slide 5: Key Differentiators ──
{
  const slide = pres.addSlide()
  slide.background = { fill: WHITE }

  slide.addText("🏆", { x: 0.6, y: 0.3, w: 0.8, h: 0.8, fontSize: 32 })

  slide.addText("What Makes Us Different", {
    x: 1.5, y: 0.3, w: 8, h: 0.8,
    fontSize: 28, color: GRAY_900, fontFace: "Segoe UI", bold: true, valign: "middle",
  })

  slide.addShape(pres.ShapeType.rect, {
    x: 0.6, y: 1.2, w: 8.8, h: 0.04,
    fill: { color: GREEN },
  })

  const diffs = [
    { icon: "🔐", title: "College Email Gating", desc: "Only @college.edu.in addresses can join — creating a trusted, closed campus network with zero spam or outsiders." },
    { icon: "📚", title: "Academic-Centric Design", desc: "Categories and filters built for textbooks, lab records, calculators, drawing instruments — not generic classifieds." },
    { icon: "🌱", title: "Built-in Sustainability", desc: "Every transaction earns Green Points. Real-time dashboard tracks items reused, trees saved, and waste reduced." },
    { icon: "🔄", title: "4 Transaction Modes", desc: "Sell, exchange, donate, and rent — all in one platform. A student can give away a lab coat, rent a calculator, and trade a textbook." },
    { icon: "🤖", title: "AI Semester Transition", desc: "Smart recommendations based on department and year help freshers find exactly what they need for upcoming semesters." },
  ]

  diffs.forEach((d, i) => {
    const y = 1.45 + i * 0.78
    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.6, y, w: 8.8, h: 0.7,
      fill: { color: i % 2 === 0 ? GRAY_50 : WHITE },
      rectRadius: 4,
    })
    slide.addText(d.icon, {
      x: 0.7, y, w: 0.6, h: 0.7,
      fontSize: 18, align: "center", valign: "middle",
    })
    slide.addText(d.title, {
      x: 1.4, y, w: 2.8, h: 0.7,
      fontSize: 13, color: GRAY_900, fontFace: "Segoe UI", bold: true, valign: "middle",
    })
    slide.addText(d.desc, {
      x: 4.2, y, w: 5.0, h: 0.7,
      fontSize: 11, color: GRAY_600, fontFace: "Segoe UI", valign: "middle",
    })
  })
}

// ── Slide 6: Tech Stack ──
{
  const slide = pres.addSlide()
  slide.background = { fill: WHITE }

  slide.addText("🛠️", { x: 0.6, y: 0.3, w: 0.8, h: 0.8, fontSize: 32 })

  slide.addText("Technology Stack", {
    x: 1.5, y: 0.3, w: 8, h: 0.8,
    fontSize: 28, color: GRAY_900, fontFace: "Segoe UI", bold: true, valign: "middle",
  })

  slide.addShape(pres.ShapeType.rect, {
    x: 0.6, y: 1.2, w: 8.8, h: 0.04,
    fill: { color: GREEN },
  })

  const stack = [
    { category: "Frontend", techs: "Next.js 16 · React 19 · Tailwind CSS 4 · TypeScript" },
    { category: "Backend", techs: "Next.js API Routes · Server Components · Middleware" },
    { category: "Database", techs: "PostgreSQL · Prisma ORM · 6 Data Models" },
    { category: "Auth", techs: "JWT (jsonwebtoken) · bcryptjs · College Email Validation" },
    { category: "Infrastructure", techs: "Vercel-ready · Serverless · Environment Config" },
    { category: "Libraries", techs: "Lucide Icons · Cloudinary · CVA · pptxgenjs" },
  ]

  stack.forEach((s, i) => {
    const y = 1.5 + i * 0.6
    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.6, y, w: 2.5, h: 0.5,
      fill: { color: GREEN },
      rectRadius: 4,
    })
    slide.addText(s.category, {
      x: 0.6, y, w: 2.5, h: 0.5,
      fontSize: 12, color: WHITE, fontFace: "Segoe UI", bold: true, align: "center", valign: "middle",
    })
    slide.addText(s.techs, {
      x: 3.3, y, w: 6.1, h: 0.5,
      fontSize: 12, color: GRAY_700, fontFace: "Segoe UI", valign: "middle",
    })
  })

  slide.addText("Production-grade · Fully typed · Modular architecture · Ready for multi-campus deployment", {
    x: 0.6, y: 4.9, w: 8.8, h: 0.4,
    fontSize: 11, color: GRAY_600, fontFace: "Segoe UI", align: "center", italic: true,
  })
}

// ── Slide 7: Sustainability Impact ──
{
  const slide = pres.addSlide()
  slide.background = { fill: WHITE }

  slide.addText("🌱", { x: 0.6, y: 0.3, w: 0.8, h: 0.8, fontSize: 32 })

  slide.addText("Sustainability Impact", {
    x: 1.5, y: 0.3, w: 8, h: 0.8,
    fontSize: 28, color: GRAY_900, fontFace: "Segoe UI", bold: true, valign: "middle",
  })

  slide.addShape(pres.ShapeType.rect, {
    x: 0.6, y: 1.2, w: 8.8, h: 0.04,
    fill: { color: GREEN },
  })

  const metrics = [
    { icon: "🟢", value: "Green Points", desc: "Earn points for every item reused. Gamified rewards encourage sustainable behavior across campus." },
    { icon: "♻️", value: "Items Reused", desc: "Every textbook, calculator, or instrument that changes hands is one less item in a landfill." },
    { icon: "🌳", value: "Trees Saved", desc: "Paper = trees. Each reused textbook saves approximately 0.05 trees worth of paper." },
    { icon: "🗑️", value: "Waste Reduced", desc: "Track kg of waste diverted from incineration. Visual dashboard shows real environmental impact." },
  ]

  metrics.forEach((m, i) => {
    const x = 0.5 + i * 2.35
    slide.addShape(pres.ShapeType.roundRect, {
      x, y: 1.5, w: 2.1, h: 2.8,
      fill: { color: LIGHT_GREEN },
      line: { color: "A7F3D0", width: 1 },
      rectRadius: 10,
    })
    slide.addText(m.icon, {
      x, y: 1.6, w: 2.1, h: 0.7,
      fontSize: 28, align: "center", valign: "middle",
    })
    slide.addText(m.value, {
      x, y: 2.3, w: 2.1, h: 0.5,
      fontSize: 15, color: DARK_GREEN, fontFace: "Segoe UI", bold: true, align: "center",
    })
    slide.addText(m.desc, {
      x, y: 2.8, w: 2.1, h: 1.3,
      fontSize: 10, color: "166534", fontFace: "Segoe UI", align: "center",
    })
  })

  slide.addShape(pres.ShapeType.roundRect, {
    x: 0.6, y: 4.5, w: 8.8, h: 0.8,
    fill: { color: "F0FDF4" },
    line: { color: "BBF7D0", width: 1 },
    rectRadius: 6,
  })

  slide.addText("\"Every reused textbook is one less tree cut down. Every donated calculator is one less student who struggles.\"", {
    x: 0.8, y: 4.5, w: 8.4, h: 0.8,
    fontSize: 12, color: "166534", fontFace: "Segoe UI", align: "center", valign: "middle", italic: true,
  })
}

// ── Slide 8: Impact ──
{
  const slide = pres.addSlide()
  slide.background = { fill: WHITE }

  slide.addText("📊", { x: 0.6, y: 0.3, w: 0.8, h: 0.8, fontSize: 32 })

  slide.addText("Projected Impact", {
    x: 1.5, y: 0.3, w: 8, h: 0.8,
    fontSize: 28, color: GRAY_900, fontFace: "Segoe UI", bold: true, valign: "middle",
  })

  slide.addShape(pres.ShapeType.rect, {
    x: 0.6, y: 1.2, w: 8.8, h: 0.04,
    fill: { color: GREEN },
  })

  const impacts = [
    { value: "60–80%", label: "Cost savings on\nacademic materials", color: GREEN, sub: "per student per semester" },
    { value: "₹1 Cr+", label: "Retained in student\npockets annually", color: "3B82F6", sub: "per campus of 5,000 students" },
    { value: "25–50T", label: "Waste diverted\nfrom landfills", color: "F59E0B", sub: "tonnes per campus per year" },
  ]

  impacts.forEach((imp, i) => {
    const x = 0.5 + i * 3.15
    slide.addShape(pres.ShapeType.roundRect, {
      x, y: 1.5, w: 2.9, h: 2.6,
      fill: { color: GRAY_50 },
      line: { color: GRAY_100, width: 1 },
      rectRadius: 10,
    })
    slide.addText(imp.value, {
      x, y: 1.6, w: 2.9, h: 1.0,
      fontSize: 30, color: imp.color, fontFace: "Segoe UI", bold: true, align: "center", valign: "middle",
    })
    slide.addText(imp.label, {
      x, y: 2.55, w: 2.9, h: 0.8,
      fontSize: 13, color: GRAY_700, fontFace: "Segoe UI", align: "center",
    })
    slide.addText(imp.sub, {
      x, y: 3.3, w: 2.9, h: 0.5,
      fontSize: 10, color: GRAY_600, fontFace: "Segoe UI", align: "center", italic: true,
    })
  })

  slide.addText("Single-campus pilot → Multi-campus replication → Statewide engineering college network", {
    x: 0.6, y: 4.4, w: 8.8, h: 0.4,
    fontSize: 12, color: GRAY_600, fontFace: "Segoe UI", align: "center",
  })

  slide.addShape(pres.ShapeType.rect, {
    x: 2, y: 4.9, w: 6, h: 0.04,
    fill: { color: GREEN },
  })
}

// ── Slide 9: Scalability ──
{
  const slide = pres.addSlide()
  slide.background = { fill: WHITE }

  slide.addText("🚀", { x: 0.6, y: 0.3, w: 0.8, h: 0.8, fontSize: 32 })

  slide.addText("Scalability Roadmap", {
    x: 1.5, y: 0.3, w: 8, h: 0.8,
    fontSize: 28, color: GRAY_900, fontFace: "Segoe UI", bold: true, valign: "middle",
  })

  slide.addShape(pres.ShapeType.rect, {
    x: 0.6, y: 1.2, w: 8.8, h: 0.04,
    fill: { color: GREEN },
  })

  const phases = [
    { phase: "Phase 1", title: "Single Campus Pilot", desc: "Deploy at CET Trivandrum with 5,000+ students. Validate product-market fit, iterate on feedback, build case studies.", color: GREEN },
    { phase: "Phase 2", title: "Multi-Campus Expansion", desc: "Add 10+ engineering colleges via domain config. Each campus gets its own isolated marketplace with shared infrastructure.", color: "3B82F6" },
    { phase: "Phase 3", title: "Statewide Network", desc: "Connect 50+ colleges across Kerala. Enable inter-campus discovery while maintaining campus-level trust boundaries.", color: "8B5CF6" },
    { phase: "Phase 4", title: "National Platform", desc: "Scale to 500+ colleges nationwide. Partner with AICTE/UGC for official adoption as the national student marketplace.", color: "F59E0B" },
  ]

  phases.forEach((p, i) => {
    const y = 1.5 + i * 0.95
    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.6, y, w: 1.3, h: 0.8,
      fill: { color: p.color },
      rectRadius: 6,
    })
    slide.addText(p.phase, {
      x: 0.6, y, w: 1.3, h: 0.8,
      fontSize: 11, color: WHITE, fontFace: "Segoe UI", bold: true, align: "center", valign: "middle",
    })
    slide.addText(p.title, {
      x: 2.1, y, w: 2.5, h: 0.4,
      fontSize: 14, color: GRAY_900, fontFace: "Segoe UI", bold: true, valign: "middle",
    })
    slide.addText(p.desc, {
      x: 2.1, y: y + 0.35, w: 7.0, h: 0.5,
      fontSize: 10.5, color: GRAY_600, fontFace: "Segoe UI", valign: "top",
    })
  })

  slide.addText("Architecture supports: Domain-based config · Isolated per-campus data · Central auth · Shared sustainability metrics", {
    x: 0.6, y: 5.0, w: 8.8, h: 0.4,
    fontSize: 10.5, color: GREEN, fontFace: "Segoe UI", align: "center", italic: true,
  })
}

// ── Slide 10: Call to Action ──
{
  const slide = pres.addSlide()
  slide.background = { fill: GREEN }

  slide.addShape(pres.ShapeType.rect, {
    x: 0, y: 0, w: 10, h: 5.625,
    fill: { color: DARK_GREEN },
  })

  slide.addText("Ready to Transform Your Campus?", {
    x: 0.5, y: 0.8, w: 9, h: 0.8,
    fontSize: 32, color: WHITE, fontFace: "Segoe UI", bold: true, align: "center",
  })

  slide.addText("Join the CampusKart movement. Reduce waste. Save money. Build community.", {
    x: 0.5, y: 1.6, w: 9, h: 0.5,
    fontSize: 16, color: LIGHT_GREEN, fontFace: "Segoe UI", align: "center",
  })

  slide.addShape(pres.ShapeType.rect, {
    x: 3.5, y: 2.3, w: 3, h: 0.04,
    fill: { color: WHITE },
  })

  const ctaItems = [
    "🔧  Deploy CampusKart at your college",
    "👥  Join as a campus ambassador",
    "⭐  Contribute on GitHub",
    "📧  Reach out: campuskart@cet.ac.in",
  ]

  slide.addText(ctaItems.map(item => ({
    text: item,
    options: { fontSize: 14, color: WHITE, fontFace: "Segoe UI", lineSpacingMultiple: 2.0 },
  })), {
    x: 2, y: 2.6, w: 6, h: 2.0,
    align: "center",
  })

  slide.addText("Built with ❤️ by students, for students", {
    x: 0.5, y: 4.8, w: 9, h: 0.4,
    fontSize: 11, color: WHITE, fontFace: "Segoe UI", align: "center", transparency: 30,
  })
}

async function main() {
  await pres.writeFile({ fileName: "CampusKart-Pitch-Deck.pptx" })
  console.log("✅ Pitch deck generated: CampusKart-Pitch-Deck.pptx")
}

main().catch(console.error)
