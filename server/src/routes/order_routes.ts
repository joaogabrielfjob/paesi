import { orderHandler } from '../handlers/order_handler';

export function configureOrderRoutes(server) {
  return server
    .get('/', orderHandler.getOrdersByUserId, { auth: true })
    .post('/', orderHandler.createOrder, { auth: true })
}