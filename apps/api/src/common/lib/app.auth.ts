import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { username } from 'better-auth/plugins'
import { v7 as uuidv7 } from 'uuid'
import { db } from '../database'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },
  advanced: {
    database: {
      generateId: () => uuidv7(),
    },
  },
  disabledPaths: ['/sign-in/username'],
  plugins: [
    username({
      maxUsernameLength: 32,
      minUsernameLength: 6,
      usernameNormalization: (username) => username.toLowerCase(),
      displayUsernameNormalization: (displayUsername) =>
        displayUsername.toLowerCase(),
    }),
  ],
})
