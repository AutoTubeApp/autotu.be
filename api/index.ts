import express from 'express'
import bodyParser from 'body-parser'
import jwt from 'express-jwt'
import { getUser, newSession, postUser } from './handlers/auth'
import './config'
import logger from './logger'

// ensure config
const secret = process.env.JWT_SECRET
if (secret === undefined) {
  throw new Error('JWT_SECRET not found in ENV')
}

const app = express()

// Middlewares
app.use(bodyParser.json())
app.use(
  jwt({
    secret: process.env.JWT_SECRET!,
    algorithms: ['sha1', 'RS256', 'HS256']
  }).unless({
    path: ['/api/session',
      {
        url: '/api/user',
        method: 'POST'
      }]
  })
)

logger.info('logger initialized')

// register a new user
app.post('/user', postUser)

// get user
app.get('/user', getUser)

// authentification
app.post('/session', newSession)

// logger middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${err.stack} - ${req.originalUrl} - ${req.method} - ${req.ip}`)
  res.status(500).send('Oops!')
  next()
})

// export
export default {
  path: '/api',
  handler: app
}
