import { PrismaClient } from '@prisma/client'
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'

const db = new PrismaClient()

export const auth = betterAuth({
  basePath: '/auth',
  trustedOrigins: [
    'http://localhost:5173' // TODO tem que virar env
  ],
  database: prismaAdapter(db, {
    provider: 'postgresql'
  }),
  emailAndPassword: {
    enabled: true
  },
  user: {
    changeEmail: {
      enabled: true
    },
    additionalFields: {
      phone: {
        type: 'string',
        required: false
      }
    }
  },
})