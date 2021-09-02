import express from 'express'
import bodyParser from 'body-parser'
import jwt from 'express-jwt'
import { getUser, newSession, postUser, secret } from './handlers/auth'

// import cookieParser from 'cookie-parser'
const app = express()

// Middlewares
app.use(bodyParser.json())
app.use(
  jwt({
    secret,
    algorithms: ['sha1', 'RS256', 'HS256']
  }).unless({
    path: ['/api/session',
      {
        url: '/api/user',
        method: 'POST'
      }]
  })
)

// register a new user
app.post('/user', postUser)

// get user
app.get('/user', getUser)

// authentification
app.post('/session', newSession)

// export
export default {
  path: '/api',
  handler: app
}
