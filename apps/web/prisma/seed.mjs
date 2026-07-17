import { PrismaClient } from '@prisma/client';
import { MENU_ITEMS } from '../../packages/shared/index.js';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Seed Menu Items
  for (const item of MENU_ITEMS) {
    await prisma.menuItem.upsert({
      where: { id: item.id },
      update: {},
      create: {
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        image: item.image,
        category: item.category,
      },
    });
  }

  console.log(`Seeded ${MENU_ITEMS.length} menu items`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
