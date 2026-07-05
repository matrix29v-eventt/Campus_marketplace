import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const usersData = [
    { name: "Niranjan S", email: "niranjan@cet.ac.in", department: "Computer Science", year: 3, isVerified: true, greenPoints: 150, itemsReused: 12, treesSaved: 0.6, wasteReduced: 6 },
    { name: "Ananya R", email: "ananya@cet.ac.in", department: "Electronics", year: 2, isVerified: true, greenPoints: 80, itemsReused: 5, treesSaved: 0.25, wasteReduced: 2.5 },
    { name: "Vikram M", email: "vikram@cet.ac.in", department: "Mechanical", year: 4, isVerified: true, greenPoints: 200, itemsReused: 18, treesSaved: 0.9, wasteReduced: 9 },
    { name: "Priya K", email: "priya@cet.ac.in", department: "Computer Science", year: 1, isVerified: true, greenPoints: 30, itemsReused: 2 },
    { name: "Rahul D", email: "rahul@cet.ac.in", department: "Civil", year: 3, isVerified: true, greenPoints: 60, itemsReused: 4 },
  ]

  const bcrypt = await import("bcryptjs")
  const hashedPassword = await bcrypt.hash("password123", 12)

  const createdUsers: { id: string; email: string; name: string }[] = []
  for (const user of usersData) {
    const created = await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: { ...user, password: hashedPassword },
    })
    createdUsers.push(created)
  }

  const categories = ["TEXTBOOKS", "LAB_RECORDS", "CALCULATORS", "DRAWING_INSTRUMENTS", "FURNITURE", "ELECTRONICS", "CLOTHING", "STATIONERY", "CYCLES", "OTHER"] as const
  const conditions = ["NEW", "LIKE_NEW", "GOOD", "FAIR", "POOR"] as const
  const types = ["SELL", "EXCHANGE", "DONATE", "RENT"] as const
  const departments = ["Computer Science", "Electronics", "Mechanical", "Civil", "Electrical"]

  const productsData = [
    { title: "Engineering Mathematics Textbook", description: "S1-S2 Mathematics textbook by KTU. Good condition with minor highlights.", price: 250, category: categories[0], condition: conditions[2], type: types[0], department: departments[0], year: 1, isFeatured: true },
    { title: "Scientific Calculator FX-991ES", description: "Casio scientific calculator. Used for 1 semester only. Like new condition.", price: 800, category: categories[2], condition: conditions[1], type: types[0], department: departments[0], year: 1, isFeatured: true },
    { title: "DBMS Notes (Complete Set)", description: "Complete handwritten notes for Database Management Systems. Covers entire syllabus.", price: 150, category: categories[0], condition: conditions[2], type: types[0], department: departments[0], year: 3, isFeatured: true },
    { title: "Drawing Board & Instruments", description: "A2 drawing board with T-square, set squares, compass, and scales.", price: 500, category: categories[3], condition: conditions[2], type: types[0], department: departments[2], year: 1 },
    { title: "Hostel Mattress", description: "Good quality mattress, 6x3 ft. Used for 1 year. Deep cleaned.", price: 1200, category: categories[4], condition: conditions[2], type: types[0], department: departments[0], year: 2 },
    { title: "OS Textbook (Galvin)", description: "Operating System Concepts by Silberschatz. International edition. Looking to exchange for DBMS book.", price: 350, category: categories[0], condition: conditions[2], type: types[1], department: departments[0], year: 3 },
    { title: "Lab Coat (Size M)", description: "Clean white lab coat. Used for 1 semester. Free for junior.", price: 0, category: categories[6], condition: conditions[2], type: types[2], department: departments[1], year: 2 },
    { title: "Bicycle (Hero Atlas)", description: "Hero Atlas 26T bicycle. Good working condition. Recently serviced.", price: 3000, category: categories[8], condition: conditions[2], type: types[0], department: departments[0], year: 3 },
    { title: "Digital Multimeter", description: "Professional digital multimeter for electronics lab work.", price: 500, category: categories[5], condition: conditions[1], type: types[0], department: departments[1], year: 2 },
    { title: "Engineering Graphics Textbook", description: "Engineering Graphics by N.D. Bhatt. Essential for first year.", price: 200, category: categories[0], condition: conditions[3], type: types[0], department: departments[2], year: 1 },
    { title: "Plastic Bucket & Mug Set", description: "Hostel essentials. Bucket (15L) + Mug set.", price: 250, category: categories[4], condition: conditions[2], type: types[0], department: departments[0], year: 1 },
    { title: "Circuit Analysis Textbook", description: "Circuit Analysis by Hayt & Kemmerly. S2 Electronics textbook.", price: 300, category: categories[0], condition: conditions[2], type: types[1], department: departments[1], year: 2 },
    { title: "Data Structures Notes (Free)", description: "Complete DS notes with algorithm implementations. Giving away for free.", price: 0, category: categories[0], condition: conditions[2], type: types[2], department: departments[0], year: 2 },
    { title: "Scientific Calculator (Rent)", description: "Casio FX-991MS available for rent during exam periods.", price: 0, category: categories[2], condition: conditions[2], type: types[3], department: departments[0], year: 1, rentalPrice: 20, rentalPeriod: "Per day" },
    { title: "Compiler Design Textbook (Dragon Book)", description: "Compilers: Principles, Techniques and Tools. A must-have for S5 CS.", price: 400, category: categories[0], condition: conditions[2], type: types[0], department: departments[0], year: 3, isFeatured: true },
  ]

  for (const p of productsData) {
    const seller = createdUsers[Math.floor(Math.random() * createdUsers.length)]
    await prisma.product.create({
      data: {
        ...p,
        images: [`https://placehold.co/600x400/e2e8f0/64748b?text=${encodeURIComponent(p.title.substring(0, 20))}`],
        sellerId: seller.id,
      },
    })
  }

  console.log("Database seeded successfully!")
  console.log(`Created ${createdUsers.length} users`)
  console.log(`Created ${productsData.length} products`)
  console.log("\nDemo login credentials:")
  console.log("Email: niranjan@cet.ac.in")
  console.log("Password: password123")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
