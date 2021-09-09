export class AttError extends Error {
  public userMessage?: string

  constructor (message: string, userMessage?: string) {
    super(message)
    this.userMessage = userMessage
  }

  public static New (message: string, userMessage?: string) {
    return new AttError(message, userMessage)
  }
}
