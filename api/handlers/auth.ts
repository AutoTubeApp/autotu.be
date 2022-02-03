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

  // get user by validation ID
  const user = await User.GetUserByValidationId(id)

  // no user (user === null)
  if (user === null) {
    next(AttError.New(
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

  // check ID (normally useless but...)
  let user = await User.GetUserByValidationId(id)
  // no user (user === null)
  if (user === null) {
    next(AttError.New(
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
    next(AttError.New(
        `username ${username} already exists`,
        username`${username} already exists`,
        400)
    )
  }

  user.username = username
  await user.setPassword(password)
  // todo uncomment
  // user.updateValidationId()

  // save user in DB
  await user.save()

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

/*
// reset password
// email user (if exits) to reset his password
export const resetPassword = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const response = new ApiResponse()
  try {
    const { email } = req.body
    const user = await User.GetUser(email)
    if (user === null) {
      res.locals.response = response.setResponse(404, 'No such user', 1,
        `resetPassword: no such user ${email}`)
      next()
      return
    }
    // new validationId
    user.updateValidationId()
    await user.save()
    await user.sendResetPasswordEmail()
    res.status(200).send()
  } catch (e) {
    console.log(e)
    next(e)
  }
}

// update password by user Validation ID
export const updatePasswordVid = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const response = new ApiResponse()
  const {
    id,
    password
  } = req.body

  try {
    // Get user
    const user = await User.GetUserByValidationId(id)
    if (user === null) {
      res.locals.response = response.setResponse(404, 'No such user', 1,
        `updatePasswordVid: no such user with validation id ${id}`)
      next()
      return
    }
    await user.setPassword(password)
    await user.updateValidationId()
    await user.save()
    res.locals.response = response.setResponse(201, '', 1, `updatePasswordVid: ${user.uuid} (${user.email}) has changed their password`)
    next()
  } catch (e) {
    if (e instanceof AttError) {
      res.locals.response = response.setResponse(400, e.userMessage, 1, e.message)
      next()
    } else {
      next(e)
    }
  }
}

// get user (currently from JWT)
export const getUser = (req: express.Request, res: express.Response) => {
  res.json({ user: req.user })
}

// new session (sign in)
export const newSession = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const response = new ApiResponse()

  let { email } = req.body
  email = email.toLowerCase()
  const { password } = req.body
  try {
    const user = await User.GetUser(email)
    if (user === null) {
      res.locals.response = response.setResponse(404, 'Authentification failed', 1, `auth failed for ${email} - no such user`)
      next()
      return
    }

    // if no password (registration not complete)
    if (user.password === undefined) {
      res.locals.response = response.setResponse(401, 'Authentification failed', 1, `auth failed for ${email} - no password, registration not completed `)
      next()
      return
    }
    const isMatch = await compare(password, user.password)
    if (!isMatch) {
      res.locals.response = response.setResponse(401, 'authentification failed', 1, `auth failed for ${email} - bad password`)
      next()
      return
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
    res.locals.response = response.setResponse(200, '', 1, `${email} sign in`, {
      token: accessToken
    })
    next()
  } catch (e) {
    if (e instanceof AttError) {
      res.locals.response = response.setResponse(400, e.userMessage, 1, e.message)
      next()
    } else {
      next(e)
    }
  }
}
*/
