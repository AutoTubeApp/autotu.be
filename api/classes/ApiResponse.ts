import { GetResponseResponse, LogLevel } from '../types'

export class ApiResponse {
  public httpStatus: number
  public userMessage?: string
  public logLevel: LogLevel
  public logMessage?: string
  public payload?: object

  public constructor () {
    this.httpStatus = 200
    this.logLevel = 1 // info
  }

  // return response formatted for client
  public getResponse (): GetResponseResponse {
    const response: GetResponseResponse = {}

    if (this.userMessage) {
      response.message = this.userMessage
    }

    if (this.payload) {
      response.payload = this.payload
    }

    return response
  }
}
