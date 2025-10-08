import { prisma } from '../lib/prisma'

export const userService = {
  getUserById: async (id: string) => {
    const user = await prisma.user.findFirst({
      where: {
        id: {
          equals: id
        }
      },
      select: {
        name: true,
        email: true,
        phone: true
      }
    })

    return user
  }
}