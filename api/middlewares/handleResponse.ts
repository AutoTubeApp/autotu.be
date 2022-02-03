/*
import express from 'express'
import logger from '../logger'
import { LogLevel } from '../types'
import { ApiResponse } from '../classes/ApiResponse'

export const handleResponse = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // ignore if no response object
  if (!res.locals.response) {
    next()
    return
  }
  const r: ApiResponse = res.locals.response

  // log ?
  if (r.logMessage) {
    r.logMessage = `${req.ip}: ${r.logMessage}`
    // Why ?
    // because we will be able to handle each log level
    // differently (send an alert on error for example)
    switch (r.logLevel) {
      case LogLevel.debug:
        logger.debug(r.logMessage)
        break
      case LogLevel.info:
        logger.info(r.logMessage)
        break
      case LogLevel.error:
        logger.error(r.logMessage)
        break
    }
  }
  // send response to client
  const responseBody = r.getResponse()
  // empty response ?
  if (responseBody) {
    res.status(r.httpStatus).json(responseBody)
  } else {
    res.status(r.httpStatus).send('')
  }
  // next()
}
*/
