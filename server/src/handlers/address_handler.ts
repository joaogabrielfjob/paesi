import { addressService } from '../services/address_service'

export const addressHandler = {
  getAddressByUserId: async ({ session }) => {
    const address = await addressService.getAddressByUserId(session.userId)

    return {
      status: 'success',
      address: address
    }
  },
  upserAddress: async ({ session, body }) => {
    const address = await addressService.upsertAddress(session.userId, { ...body })

    return {
      status: 'success',
      address: address
    }
  }
}