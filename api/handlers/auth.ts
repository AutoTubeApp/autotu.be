import express from 'express'
import jsonwebtoken from 'jsonwebtoken'
import { compare } from 'bcrypt'
import logger from '../logger'
import { User } from '../classes/User'
import { AttError } from '../classes/Error'

// register new user
export const postUser = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const { email } = req.body
    // create user
    const user = await User.Create(email)
    // send welcome email silently (for user) drop potentially error
    try {
      await user.sendWelcomeEmail()
    } catch (e:any) {
      logger.error(`${req.ip}: hdl postUser - user.SendWelcomeEmail() failed for user ${user.uuid}: ${e}`)
    }
    logger.info(`user.create: new user  ${user.uuid} (${user.email})`)
    res.status(201).send()
  } catch (e) {
    next(e)
  }
}

// second step for registration
// just validate validationID (is set for one user
// http://localhost:3000/auth/validate-account/20674d70-20d8-472a-a88e-22c2db00dfc8?_se=dG9vcm9wQGdtYWlsLmNvbQ%3D%3D
export const validateAccount = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const { id } = req.body
  let user: User | null
  // get user by validation ID
  try {
    user = await User.GetUserByValidationId(id)
  } catch (e:any) {
    if (e.message.startsWith('invalid input syntax for type uuid')) {
      return next(AttError.New(
        `auth.validateAccount: bad validation id (not an UUID type) ${id}`,
        `bad validation id ${id}`,
        404)
      )
    } else {
      return next(e)
    }
  }

  // no user (user === null)
  if (user === null) {
    return next(AttError.New(
      `auth.validateAccount: bad validation id ${id}`,
      `bad validation id ${id}`,
      404)
    )
  }
  res.status(201).send()
}

// activateAccount
// user send username && password
export const activateAccount = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const {
    id,
    username,
    password
  } = req.body

  let user: User | null
  try {
  // check ID (normally useless but...)
    user = await User.GetUserByValidationId(id)
    // no user (user === null)
    if (user === null) {
      return next(AttError.New(
        `auth.activateAccount: bad validation id ${id}`,
        'Don\'t be a fool, you can\'t activate an account with a bad validation id',
        404)
      )
    }
    // not null
    user = user as User

    // set user password, and username
    // check if username exists
    if (await User.UsernameExists(username)) {
      return next(AttError.New(
        `username ${username} already exists`,
        `Username '${username}' already exists`,
        400)
      )
    }

    user.username = username
    await user.setPassword(password.trim())
    user.updateValidationId()

    // save user in DB
    await user.save()
  } catch (e) {
    return next(e)
  }

  // subscribe to newsletter
  //  just log error
  try {
    await user.subscribeToNewsletter()
  } catch (e:any) {
    // just log error
    logger.error(`${req.ip}: hdl activateAccount - user.subscribeToNewsletter() failed for user ${user.uuid}: ${e.message}`)
  }

  // OK !
  logger.info(`user.activateAccount: user ${user.uuid} (${user.email}) activated`)
  const response = { email: user.email }
  res.status(201).json(response)
}

// reset password
// email user (if exits) to reset his password
export const resetPassword = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const { email } = req.body
    const user = await User.GetUser(email)
    if (user === null) {
      return next(AttError.New(
        `auth.resetPassword: no such user ${email}`,
        'No such user',
        404)
      )
    }
    // new validationId
    user.updateValidationId()
    await user.save()
    await user.sendResetPasswordEmail()
    res.status(200).send()
  } catch (e) {
    next(e)
  }
}

// update password by user Validation ID
export const updatePasswordVid = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const {
    id,
    password
  } = req.body

  try {
    // Get user
    const user = await User.GetUserByValidationId(id)
    if (user === null) {
      return next(AttError.New(
        `auth.updatePasswordVid: no user with validation ID ${id}`,
        'Bad validation id',
        404)
      )
    }
    await user.setPassword(password)
    await user.updateValidationId()
    await user.save()
    logger.info(`user.updatePasswordVid: user ${user.uuid} (${user.email}) password updated`)
    res.status(201).send()
  } catch (e) {
    next(e)
  }
}

// get user (currently from JWT)
export const getUser = (req: express.Request, res: express.Response) => {
  res.json({ user: req.user })
}

// new session (sign in)
export const newSession = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  let { email } = req.body
  email = email.trim().toLowerCase()
  const { password } = req.body
  try {
    const user = await User.GetUser(email)
    if (user === null) {
      return next(AttError.New(
        `auth failed for ${email} - no such user`,
        'Authentification failed',
        404)
      )
    }

    // if no password (registration not complete)
    if (user.password === undefined) {
      return next(AttError.New(
        `auth failed for ${email} - no password`,
        'Authentification failed',
        401)
      )
    }

    // check password
    const isMatch = await compare(password, user.password.toString())
    if (!isMatch) {
      return next(AttError.New(
        `auth failed for ${email} - bad password`,
        'Authentification failed',
        401)
      )
    }

    // create access token
    const expiresIn: string = '24h'
    // eslint-disable-next-line import/no-named-as-default-member
    const accessToken = jsonwebtoken.sign(
      {
        uuid: user.uuid,
        username: user.username,
        email
        // avatar: '/dev/avatar.jpg'
      },
      process.env.ATT_JWT_SECRET!,
      {
        expiresIn
      }
    )
    logger.info(`user.newSession: user ${user.uuid} (${user.email}) signed in`)
    res.status(200).json({
      token: accessToken,
      expiresIn
    })
  } catch (e) {
    next(e)
  }
}
