import express from 'express'
import jsonwebtoken from 'jsonwebtoken'
import validator from 'validator'
import { compare, hash } from 'bcrypt'
import { v4 as uuidV4 } from 'uuid'
import { ApiResponse } from '../classes/ApiResponse'
import logger from '../logger'
import Db from '../Db'

// register new user
export const postUser = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const response = new ApiResponse()

  try {
    // ensure method
    if (req.method !== 'POST') {
      res.status(405)
      return
    }

    // get email and passwd
    let {
      email,
      // eslint-disable-next-line prefer-const
      password
    } = req.body

    // validate
    if (!email || !password) {
      res.locals.response = response.setResponse(400, 'Bad request', 1, `${req.ip}: missing params in POST session`)
      next()
      return
    }

    email = email.toLowerCase()

    let message: string | null = null
    if (!validator.isEmail(email)) {
      message = `'${email}' is not a valid email`
    } else if (!validator.isLength(password, {
      min: 8,
      max: 20
    })) {
      message = 'password must be between 6 and 20 chars'
    }
    if (message) {
      res.locals.response = response.setResponse(400, message, 1, 'missing params in POST session')
      next()
      return
    }

    // create user
    // todo envoyer un mail
    // todo, on component, get user and redirect
    const hashedPassword = await hash(password, 10)
    const userID = uuidV4()
    const db = Db.getInstance()
    db.session.run(
      'CREATE (n:User {email: $email, password: $hashedPassword, uuid: $uuid})',
      {
        email,
        hashedPassword,
        uuid: userID
      }
    )
      .then(() => {
        logger.info(`new user ${email}`)
      })
      .catch((e) => {
        if (e.code === 'Neo.ClientError.Schema.ConstraintValidationFailed') {
          res.locals.response = response.setResponse(400, `${email} is already registered`)
          next()
          return
        }
        throw e
      })
  } catch (e) {
    next(e)
  }
}

// get user from JWT
export const getUser = (req: express.Request, res: express.Response) => {
  res.json({ user: req.user })
}

// new session (sign in)
export const newSession = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const response = new ApiResponse()

  const {
    email,
    password
  } = req.body

  // todo check email and password

  // todo email to lower case

  try {
    // get db instance
    const db = Db.getInstance()
    const r = await db.session.run('MATCH (user {email: $email}) return user', {
      email
    })
    if (r.records.length !== 1) {
      res.locals.response = response.setResponse(401, 'authentification failed', 1, `auth failed for ${email} - no such user`)
      next()
      return
    }

    // ok get password from DB
    const inDbHash = r.records[0].get('user').properties.password
    const isMatch = await compare(password, inDbHash)

    if (!isMatch) {
      res.locals.response = response.setResponse(401, 'authentification failed', 1, `auth failed for ${email} - bad password`)
      next()
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
      process.env.ATT_JWT_SECRET!,
      {
        expiresIn
      }
    )
    logger.info(`${req.ip}: ${email} sign in `)
    res.json({
      token: accessToken
    })
  } catch (error) {
    next(error)
  }
}
