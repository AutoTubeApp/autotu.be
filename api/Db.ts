import neo4j, { Session } from 'neo4j-driver'

export default class Db {
  private static instance: Db

  // host
  private host: string
  // port
  private port: number
  // user
  private user: string
  // passwd
  private passwd: string
  // session
  public session: Session

  private constructor () {
    this.host = '127.0.0.1'
    this.port = 7687
    this.user = 'neo4j'
    this.passwd = 'azerty'

    this.session = neo4j.driver(`neo4j://${this.host}:${this.port}`, neo4j.auth.basic(this.user, this.passwd)).session()
  }

  static getInstance () {
    if (this.instance) {
      return this.instance
    }
    this.instance = new Db()
    return this.instance
  }
}
