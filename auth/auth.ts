import { betterAuth } from 'better-auth';
import { Pool } from 'pg';
import { jwt } from 'better-auth/plugins';

export const auth = betterAuth({
  database: new Pool({
    host: 'localhost',
    port: 5433,
    database: 'paesi',
    user: 'postgres',
    password: 'secret'
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