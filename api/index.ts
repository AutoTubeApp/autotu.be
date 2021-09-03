import dotenv from 'dotenv'
import express from 'express'
import bodyParser from 'body-parser'
import jwt from 'express-jwt'
import { getUser, newSession, postUser } from './handlers/auth'

const path = require('path')

// get config
dotenv.config({ path: path.join(__dirname, `.env.${process.env.NODE_ENV}`) })

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
