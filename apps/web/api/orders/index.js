const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const orders = await prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    })
    return res.status(200).json(orders)
  }

  if (req.method === 'POST') {
    const { customerName, tableNumber, items, total } = req.body
    const order = await prisma.order.create({
      data: {
        customerName,
        tableNumber,
        total,
        items: {
          create: items.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            menuItemId: item.menuItemId,
          })),
        },
      },
      include: { items: true },
    })
    return res.status(201).json(order)
  }

  return res.status(405).json({ message: 'Method not allowed' })
}
