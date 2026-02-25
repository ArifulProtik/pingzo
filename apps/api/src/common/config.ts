import env from 'env-var'
export const config = {
  NODE_ENV: env
    .get('NODE_ENV')
    .default('development')
    .asEnum(['production', 'test', 'development']),

  PORT: env.get('PORT').default(3000).asPortNumber(),
  HOST: env.get('HOST').default('localhost').asString(),
  DATABASE_URL: env.get('DATABASE_URL').required().asString(),
  WEB_CLIENT_URL: env.get('WEB_CLIENT_URL').required().asString(),
  BETTER_AUTH_SECRET: env.get('BETTER_AUTH_SECRET').required().asString(),
  BETTER_AUTH_URL: env.get('BETTER_AUTH_URL').required().asString(),
  CORS_ORIGIN: env.get('CORS_ORIGIN').default('*').asArray(),
}
