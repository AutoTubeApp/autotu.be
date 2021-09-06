import express from 'express'
import jsonwebtoken from 'jsonwebtoken'
import validator from 'validator'
import { compare } from 'bcrypt'
import logger from '../logger'
import Db from '../Db'
import { IJsonResponse } from '~/api/types'

// register new user
export const postUser = (req: express.Request, res: express.Response) => {
  // ensure method
  if (req.method !== 'POST') {
    res.status(405)
    return
  }

  const response: IJsonResponse = { code: 200 }

  // get email and passwd
  const {
    email,
    password
  } = req.body

  logger.info(`new user ${email}`)

  // validate
  let valid = false
  if (!validator.isEmail(email)) {
    response.code = 400
    response.msg = `'${email}' is not a valid email`
  } else if (!validator.isLength(password, {
    min: 8,
    max: 20
  })) {
    response.code = 400
    response.msg = 'password must be between 6 and 20 chars'
  } else {
    valid = true
  }
  if (!valid) {
    res.status(response.code).json(response)
    return
  }

  res.status(200).json(response)
}

// get user
export const getUser = (req: express.Request, res: express.Response) => {
  res.json({ user: req.user })
}

// new session
export const newSession = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const {
    email,
    password
  } = req.body

  try {
    // get db instance
    const db = Db.getInstance()
    const r = await db.session.run('MATCH (user {email: $email}) return user', {
      email
    })
    if (r.records.length !== 1) {
      logger.info(`${req.ip}: auth failed for ${email} - no such user`)
      res.status(401).send('authentification failed')
      return
    }

    // dev create hash
    // const hashed = await hash(password, 10)
    // console.log('hash: ' + hashed)

    // ok get password from DB
    const inDbHash = r.records[0].get('user').properties.password
    const isMatch = await compare(password, inDbHash)

    if (!isMatch) {
      logger.info(`${req.ip}: auth failed for ${email} - bad password`)
      res.status(401).send('authentification failed')
      return
    }

    // create access token
    const expiresIn: string = '24h'
    // const refreshToken: string = 'r' + Math.floor(Math.random() * (1000000000000000 - 1 + 1)) + 1
    const accessToken = jsonwebtoken.sign(
      {
        uuid: '72bb9529-3cf5-4127-98ab-8426d59c5ac3',
        username: 'Toorop',
        email,
        avatar: '/dev/avatar.jpg'
      },
      process.env.JWT_SECRET!,
      {
        expiresIn
      }
    )
    res.json({
      token: accessToken
    })
  } catch (error) {
    next(error)
  }
}
