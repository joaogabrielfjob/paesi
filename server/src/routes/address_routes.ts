import { addressHandler } from '../handlers/address_handler'

export function configureAddressRoutes(server) {
  return server
    .get('/', addressHandler.getAddressByUserId, { auth: true })
    .put('/', addressHandler.upserAddress, { auth: true })
}