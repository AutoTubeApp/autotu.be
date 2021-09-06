import neo4j, { Session } from 'neo4j-driver'

export default class Db {
  private static instance: Db

  // session
  public session: Session

  private constructor () {
    this.session = neo4j.driver(process.env.ATT_NEO4J_URL!, neo4j.auth.basic(process.env.ATT_NEO4J_USER!, process.env.ATT_NEO4J_PASSWORD!)).session()
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
