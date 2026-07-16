const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

export default async function handler(req, res) {
  const { id } = req.query

  if (req.method === 'PUT') {
    const { status } = req.body
    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: { items: true },
    })
    return res.status(200).json(order)
  }

  return res.status(405).json({ message: 'Method not allowed' })
}
