import { prisma } from '../lib/prisma'

export const productService = {
  getProducts: async () => {
    const products = await prisma.product.findMany()

    return products
  }
}