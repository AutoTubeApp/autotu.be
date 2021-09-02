import express from 'express'
import bodyParser from 'body-parser'
import jwt from 'express-jwt'
import jsonwebtoken from 'jsonwebtoken'
// import cookieParser from 'cookie-parser'

// secret
const secret: string = 'mybigsecret'

const app = express()

// Middlewares
app.use(bodyParser.json())
app.use(
  jwt({
    secret,
    algorithms: ['sha1', 'RS256', 'HS256']
  }).unless({
    path: ['/api/session', '/api/session/refresh']
  })
)

// new auth
app.post('/session', (req: express.Request, res: express.Response) => {
  const {
    email,
    password
  } = req.body

  // check auth
  if (email !== 'toorop@gmail.com' || password !== 'azerty') {
    res.status(401).send('authentification failed')
    return
  }
  const expiresIn: string = '24h'
  // const refreshToken: string = 'r' + Math.floor(Math.random() * (1000000000000000 - 1 + 1)) + 1
  const accessToken = jsonwebtoken.sign(
    {
      uuid: '72bb9529-3cf5-4127-98ab-8426d59c5ac3',
      username: 'Toorop',
      email,
      avatar: '/dev/avatar.jpg'
    },
    secret,
    {
      expiresIn
    }
  )
  res.json({
    token: accessToken
  })
})

// get user
app.get('/user', (req: express.Request, res: express.Response) => {
  res.json({ user: req.user })
})

// export
export default {
  path: '/api',
  handler: app
}
