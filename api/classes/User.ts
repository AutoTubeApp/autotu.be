import { v4 as uuidV4 } from 'uuid'
import validator from 'validator'
import { hash } from 'bcrypt'
import Db from '../Db'
import { AttError } from './Error'
import { Mailer } from './Mailer'

// const waitForOneSecond = (): Promise<string> => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve('I promise to return after one second!')
//     }, 1000)
//   })
// }

export class User {
  public email: string
  public uuid?: string
  public password?: string
  public validationId?: string

  constructor (email: string) {
    if (!validator.isEmail(email)) {
      throw AttError.New(`new user: bad email '${email}'`, `'${email}' is not a valid email`)
    }
    this.email = email.toLowerCase()
  }

  // create a new user
  public static async Create (email: string, password: string, _subscribe: boolean): Promise<User> {
    // check clear password length
    if (password.length < 8 || password.length > 15) {
      throw AttError.New(`user.create: bad password length: ${password.length} for ${email}`, 'Password should be between 6 and 15 characters long')
    }

    const u = new User(email)
    u.uuid = uuidV4()

    // create user
    // todo envoyer un mail
    // todo, on component, get user and redirect
    u.password = await hash(password, 10)
    u.validationId = uuidV4()

    const db = Db.getInstance()
    try {
      await db.session.run(
        'CREATE (n:User {email: $email, password: $hashedPassword, uuid: $uuid, emailVerified: $emailVerified, activationCode: $activationCode})',
        {
          email: u.email,
          hashedPassword: u.password,
          uuid: u.uuid,
          emailVerified: false,
          activationCode: u.validationId
        }
      )
    } catch (e) {
      if (e.code === 'Neo.ClientError.Schema.ConstraintValidationFailed') {
        throw AttError.New(`user.create: '${email}' is already registered`, `${email} is already registered`)
      } else {
        throw e
      }
    }
    return u
  }

  // send welcome email
  public async SendWelcomeEmail (): Promise<void> {
    const mailer = new Mailer()
    await mailer.sendTemplatedMail(this.email, 1, { validationId: this.validationId })
  }
}
