import { prisma } from '../lib/prisma'

interface upserAddressRequest {
  postalCode: string
  country: string
  state: string
  city: string
  street: string
  neighborhood: string
  number: number
  complement: string
}

export const addressService = {
  getAddressByUserId: async (userId: string) => {
    const address = await prisma.address.findFirst({
      where: {
        userId: userId
      }
    })

    return address
  },
  upsertAddress: async (userId: string, request: upserAddressRequest) => {
    const address = await prisma.address.upsert({
      where: {
        userId: userId
      },
      update: {
        postalCode: request.postalCode,
        country: request.country,
        state: request.state,
        city: request.city,
        street: request.state,
        neighborhood: request.neighborhood,
        number: request.neighborhood,
        complement: request.complement
      },
      create: {
        userId: userId,
        postalCode: request.postalCode,
        country: request.country,
        state: request.state,
        city: request.city,
        street: request.state,
        neighborhood: request.neighborhood,
        number: request.neighborhood,
        complement: request.complement
      }
    })

    return address
  }
}