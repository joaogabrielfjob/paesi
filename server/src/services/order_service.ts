import { Prisma } from '@prisma/client'
import { OrderStatus } from '../enums/order_status'
import { nanoid } from '../lib/nanoid'
import { prisma } from '../lib/prisma'

interface createOrderRequest {
  products: {
    productId: number
    quantity: number
  }[]
}

export const orderService = {
  getOrdersByUserId: async (userId: string) => {
    const orders = await prisma.order.findMany({
      where: {
        userId: userId
      }
    })

    return orders
  },
  createOrder: async (userId: string, request: createOrderRequest) => {
    const productsId = request.products.map(p => p.productId)

    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productsId
        }
      }
    })

    const total = products.reduce((acc, product) => {
      const quantity = request.products.find(p => p.productId === product.id)?.quantity ?? 0
      const price = product.price
      
      return acc.add(price.times(quantity))
    }, new Prisma.Decimal(0))

    const code = nanoid()

    const order = await prisma.order.create({
      data: {
        userId: userId,
        code: code,
        status: OrderStatus.CREATED,
        total: total,
        orderItem: {
          create: request.products.map(p => ({
            productId: p.productId,
            quantity: p.quantity
          }))
        }
      },
      include: {
        orderItem: true
      }
    })

    /* const orderItems = await prisma.order_item.createMany({
      data: [
        {
          orderId: order.id,
          ...request.products
        }
      ]
    }) */

    /* const orderItems = await prisma.order_item.createMany({
      data: request.products.map(p => ({
        orderId: order.id,
        productId: p.productId,
        quantity: p.quantity
      }))
    }) */
    const orderItems = order.orderItem

    return { order,  orderItems }
  }
}