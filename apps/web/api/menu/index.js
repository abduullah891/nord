const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const menuItems = await prisma.menuItem.findMany()
    return res.status(200).json(menuItems)
  }

  if (req.method === 'POST') {
    const menuItem = await prisma.menuItem.create({
      data: req.body,
    })
    return res.status(201).json(menuItem)
  }

  return res.status(405).json({ message: 'Method not allowed' })
}
