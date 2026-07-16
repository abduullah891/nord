const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Seed Menu Items
  const menuItems = await prisma.menuItem.createMany({
    data: [
      {
        name: 'Espresso',
        description: 'Shot of pure coffee',
        price: 25000,
        category: 'Coffee',
      },
      {
        name: 'Cappuccino',
        description: 'Espresso with steamed milk and foam',
        price: 35000,
        category: 'Coffee',
      },
      {
        name: 'Croissant',
        description: 'Buttery flaky pastry',
        price: 20000,
        category: 'Pastry',
      },
      {
        name: 'Tiramisu Latte',
        description: 'Espresso with mascarpone and cocoa',
        price: 40000,
        category: 'Coffee',
      },
    ],
  })

  console.log(`Seeded ${menuItems.count} menu items`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
