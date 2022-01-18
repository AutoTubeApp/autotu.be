import { auth, driver, Session } from 'neo4j-driver'

export default class Db {
  // eslint-disable-next-line no-use-before-define
  private static instance: Db

  // session
  public session: Session

  private constructor () {
    this.session = driver(process.env.ATT_NEO4J_URL!, auth.basic(process.env.ATT_NEO4J_USER!, process.env.ATT_NEO4J_PASSWORD!)).session()
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
