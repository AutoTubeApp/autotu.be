export class User {
  pseudo: string

  private id: number
  private uuid: string

  constructor (pseudo: string) {
    this.pseudo = pseudo

    // private
    this.uuid = 'uuid'
    this.id = 0
  }
}
