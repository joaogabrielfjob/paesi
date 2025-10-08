import { productService } from '../services/product_service'

export const productHandler = {
  getProducts: async () => {
    const products = await productService.getProducts()

    return {
      status: 'success',
      products: products
    }
  }
}