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

export type GetResponseResponse = {
  message?: string
  payload?: object
}
