import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { config } from '../config'
import * as schema from './schema'

const pool = new Pool({
  connectionString: config.DATABASE_URL,
})
export const db = drizzle({
  schema,
  client: pool,
})

export const closeDatabase = async () => {
  await pool.end()
}
export const pingDatabase = async () => {
  try {
    await db.execute('SELECT 1')
    return true
  } catch {
    return false
  }
}
