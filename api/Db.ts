import * as process from 'process'
import { Pool } from 'pg'

export default class Db {
  // eslint-disable-next-line no-use-before-define
  private static instance: Db

  // session
  public pool: Pool

  private constructor () {
    const port: number = parseInt(process.env.ATT_DB_PORT || '5432')
    this.pool = new Pool({
      user: process.env.ATT_DB_USER,
      password: process.env.ATT_DB_PASSWORD,
      host: process.env.ATT_DB_HOST,
      port,
      database: process.env.ATT_DB_NAME,
      ssl: {
        rejectUnauthorized: true,
        ca: process.env.ATT_DB_SSL_CA
      }
    })
  }

  // singleton
  static getInstance () {
    if (this.instance) {
      return this.instance
    }
    this.instance = new Db()
    return this.instance
  }
}
