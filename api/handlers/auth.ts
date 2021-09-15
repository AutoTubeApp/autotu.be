import express from 'express'
import jsonwebtoken from 'jsonwebtoken'
import { compare } from 'bcrypt'
import { ApiResponse } from '../classes/ApiResponse'
import logger from '../logger'
import Db from '../Db'
import { User } from '../classes/User'
import { AttError } from '../classes/Error'

// register new user
export const postUser = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const response = new ApiResponse()

  try {
    const { email } = req.body

    let user: User

    try {
      // create user
      user = await User.Create(email)

      // send welcome email
      // silently (for user) drop potentially error
      try {
        await user.sendWelcomeEmail()
      } catch (e) {
        logger.error(`${req.ip}: hdl postUser - user.SendWelcomeEmail() failed for user ${user.uuid}: ${e.message}`)
      }

      // todo reactivate (une fois le mail validé)
      // // subscribe to newsletter
      // if (subscribe) {
      //   try {
      //     await user.subscribeToNewsletter()
      //   } catch (e) {
      //     logger.error(`${req.ip}: hdl postUser - user.subscribeToNewsletter() failed for user ${user.uuid}: ${e.message}`)
      //   }
      // }
    } catch (e) {
      if (e instanceof AttError) {
        res.locals.response = response.setResponse(400, e.userMessage, 1, e.message)
        next()
      } else {
        next(e)
      }
      return
    }
    logger.info(`user.create: new user ${user.email} - ${user.uuid}`)
    res.status(201).send()
  } catch (e) {
    next(e)
  }
}

// second step for registration
// http://localhost:3000/auth/validate-account/20674d70-20d8-472a-a88e-22c2db00dfc8?_se=dG9vcm9wQGdtYWlsLmNvbQ%3D%3D
export const validateAccount = async (req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const { id } = req.body
  console.log(id)

  // get user by validation ID
  const user = await User.GetUserByValidationId(id)
  console.log(user)

  res.status(201).send()
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
    const r = await db.session.run('MATCH (u:User {email: $email}) return u', {
      email
    })
    if (r.records.length !== 1) {
      res.locals.response = response.setResponse(401, 'authentification failed', 1, `auth failed for ${email} - no such user`)
      next()
      return
    }

    // ok get password from DB
    const inDbHash = r.records[0].get('u').properties.password
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
