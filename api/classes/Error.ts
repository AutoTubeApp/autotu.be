export class AttError extends Error {
  public userMessage?: string
  public code?: number

  constructor (message: string, userMessage?: string, code?: number) {
    super(message)
    if (userMessage) {
      this.userMessage = userMessage
    } else {
      this.userMessage = message
    }
    if (code) {
      this.code = code
    } else {
      this.code = 400
    }
  }

  public static New (message: string, userMessage?: string, code?: number): AttError {
    if (code) {
      return new AttError(message, userMessage, code)
    } else {
      return new AttError(message, userMessage)
    }
  }
}
