import { userService } from '../services/user_service'

export const userHandler = {
  getUserById: async ({ session, set, params: { id } }) => {
    if (id != session.userId) {
      set.status = 403
      return {
        status: 'error',
        message: 'Forbidden'
      }
    }

    const user = await userService.getUserById(id)

    set.status = 200
    return {
      status: 'success',
      user: user
    }
  }
}