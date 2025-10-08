import { userHandler } from '../handlers/user_handler'

export function configureUserRoutes(server) {
  return server
    .get('/:id', userHandler.getUserById, { auth: true })
}