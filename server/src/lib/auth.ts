import { PrismaClient } from '@prisma/client'
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'

const db = new PrismaClient()

export const auth = betterAuth({
  basePath: '/auth',
  trustedOrigins: [
    process.env.ORIGIN
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
  advanced: {
    defaultCookieAttributes: {
      sameSite: 'none',
      secure: true,
      partitioned: true
    }
  }
})