import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const handler = async (event) => {
  try {
    if (event.httpMethod === 'GET') {
      const orders = await prisma.order.findMany({
        include: { items: true },
        orderBy: { createdAt: 'desc' },
      });
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify(orders),
      };
    }

    if (event.httpMethod === 'POST') {
      const { customerName, tableNumber, items, total } = JSON.parse(event.body);
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
      });
      return {
        statusCode: 201,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify(order),
      };
    }

    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ message: 'Method not allowed' }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};
