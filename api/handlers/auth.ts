import express from 'express'
import jsonwebtoken from 'jsonwebtoken'
import validator from 'validator'
import { logger } from '../logger'
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
export const newSession = (req: express.Request, res: express.Response) => {
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
    process.env.JWT_SECRET!,
    {
      expiresIn
    }
  )
  res.json({
    token: accessToken
  })
}
