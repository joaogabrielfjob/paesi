import { orderService } from '../services/order_service'

export const orderHandler = {
  getOrdersByUserId: async ({ session }) => {
    const orders = await orderService.getOrdersByUserId(session.userId)

    return {
      status: 'success',
      orders: orders
    }
  },
  createOrder: async ({ session, body }) => {
    const { order, orderItems } = await orderService.createOrder(session.userId, { ...body })

    return {
      status: 'success',
      order: {
        ...order,
        products: orderItems
      }
    }
  }
}