import { betterAuth } from 'better-auth';
import { Pool } from 'pg';
import { jwt } from 'better-auth/plugins';

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET || process.env.AUTH_SECRET,
  database: new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5433'),
    database: process.env.DB_NAME || 'paesi',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'secret'
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
      sameSite: "none",
      secure: true,
      partitioned: true // New browser standards will mandate this for foreign cookies
    }
  },
  plugins: [
    jwt({
      jwt: {
        definePayload: ({ user }) => {
          return {
            id: user.id,
            role: user.role || 'user'
          }
        },
        expirationTime: '1h'
      }
    })
  ]
})