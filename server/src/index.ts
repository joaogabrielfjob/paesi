import { Elysia } from 'elysia'
import cors from '@elysiajs/cors'

import { configureProductRoutes } from './routes/product_routes'
import { configureUserRoutes } from './routes/user_routes'

import { AuthenticationError } from './exceptions/authentication_error'
import { AuthorizationError } from './exceptions/authorization_error'
import { InvariantError } from './exceptions/invariant_error'

import { authMiddleware } from './middleware/auth_middleware'
import { configureAddressRoutes } from './routes/address_routes'
import { configureOrderRoutes } from './routes/order_routes'

const server = new Elysia()

server
  .error('AUTHENTICATION_ERROR', AuthenticationError)
  .error('AUTHORIZATION_ERROR', AuthorizationError)
  .error('INVARIANT_ERROR', InvariantError)
  .onError(({ code, error, set }) => {
    console.error(error)

    switch (code) {
      case 'VALIDATION':
        set.status = 400
        return {
          status: 'error',
          message: 'Some fields are invalid'
        }
      case 'AUTHENTICATION_ERROR':
        set.status = 401
        return {
          status: 'error',
          message: error.toString().replace('Error: ', '')
        }
      case 'AUTHORIZATION_ERROR':
        set.status = 403
        return {
          status: 'error',
          message: error.toString().replace('Error: ', '')
        }
      case 'INVARIANT_ERROR':
        set.status = 400
        return {
          status: 'error',
          message: error.toString().replace('Error: ', '')
        }
      case 'NOT_FOUND':
        set.status = 404
        return {
          status: 'error',
          message: error.toString().replace('Error: ', '')
        }
      case 'INTERNAL_SERVER_ERROR':
        set.status = 500
        return {
          status: 'error',
          message: 'Something went wrong!'
        }
    }
  })

server
  .use(
    cors({
      origin: process.env.ORIGIN,
      credentials: true,
      allowedHeaders: ['Content-Type'],
      methods: ['GET', 'POST', 'PUT']
    })
  )
  .use(authMiddleware)

server
  .group('/products', configureProductRoutes)
  .group('/users', configureUserRoutes)
  .group('/address', configureAddressRoutes)
  .group('/orders', configureOrderRoutes)
  .listen(process.env.BUN_PORT)

console.info(
  `🦊 Elysia is running at ${server.server?.hostname}:${server.server?.port}`
)
