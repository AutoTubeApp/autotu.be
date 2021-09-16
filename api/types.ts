/* export interface IJsonResponse {
  code: number
  msg?: string
  payload?: object
} */

export enum LogLevel {
  'debug',
  'info',
  'error'
}

// Json object returned to client
export type GetResponseBody = {
  message?: string
  payload?: object
}
