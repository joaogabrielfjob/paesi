import { productHandler } from '../handlers/product_handler'

export function configureProductRoutes(server) {
  return server.get('/', productHandler.getProducts, { auth: true })
}
