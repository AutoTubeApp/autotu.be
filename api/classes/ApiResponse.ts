import { GetResponseResponse, LogLevel } from '../types'

export class ApiResponse {
  public httpStatus: number
  public userMessage?: string
  public logLevel?: LogLevel
  public logMessage?: string
  public payload?: object

  public constructor () {
    this.httpStatus = 200
    this.logLevel = LogLevel.info // info
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

  public setResponse (httpStatus: number, userMessage?: string, logLevel?: LogLevel, logMessage?: string, payload?: object): ApiResponse {
    this.httpStatus = httpStatus
    this.userMessage = userMessage
    this.logLevel = logLevel
    this.logMessage = logMessage
    this.payload = payload
    return this
  }
}
