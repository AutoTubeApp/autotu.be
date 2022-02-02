import express from 'express'
import bodyParser from 'body-parser'
import jwt from 'express-jwt'
import * as hdlAuth from './handlers/auth'
import * as hdlVideo from './handlers/video'
import './config'
import logger from './logger'
import { handleResponse } from './middlewares/handleResponse'

// ensure config
const secret = process.env.ATT_JWT_SECRET
if (secret === undefined) {
  throw new Error('ATT_JWT_SECRET not found in ENV')
}

const app = express()

// Middlewares
app.use(bodyParser.json())
app.use(
  jwt({
    secret: process.env.ATT_JWT_SECRET!,
    algorithms: ['sha1', 'RS256', 'HS256']
  }).unless({
    path: ['/api/session',
      '/api/validate-account',
      '/api/activate-account',
      '/api/reset-password',
      '/api/update-password-vid',
      {
        url: '/api/user',
        method: 'POST'
      },
      '/api/v/get-proxyfied-manifest']
  })
)

// register a new user
app.post('/user', hdlAuth.postUser)

/*
// get user
app.get('/user', hdlAuth.getUser)

// authentification
app.post('/session', hdlAuth.newSession)

// email validation => activate (set username && password)
app.put('/validate-account', hdlAuth.validateAccount)

// activate account (user set username && password
app.put('/activate-account', hdlAuth.activateAccount)

// reset-password-1 send an email
app.post('/reset-password', hdlAuth.resetPassword)

// change password
app.put('/update-password-vid', hdlAuth.updatePasswordVid)
*/

//
// video
app.post('/v/get-meta-from-manifest', hdlVideo.getVideoMetaFromManifest)

// get manifest (proxy to avoid CORS)
app.get('/v/get-proxyfied-manifest', hdlVideo.getProxyfiedManifest)

// update password
// app.put('/update-password', update-password)

// response handler middleware (if response)
app.use(handleResponse)

// ultimate error handler middleware
app.use((err: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${err.stack} - ${req.originalUrl} - ${req.method} - ${req.ip}`)
  res.status(500).send('Oops!')
})

// export
export default {
  path: '/api',
  handler: app
}
