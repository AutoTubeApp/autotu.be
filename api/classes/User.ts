import { v4 as uuidV4 } from 'uuid'
import validator from 'validator'
import { hash } from 'bcrypt'
import Db from '../Db'
import { AttError } from './Error'
import { SendInBlue } from './SendInBlue'

// User properties (used for assign props to user)
interface IUserProps {
  email: string
  uuid?: string
  password?: string
  validationId?: string
}

// Autotube User
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

  // Get user from email todo
  public static async GetUser (email: string): Promise<User | null> {
    const db = Db.getInstance()

    const r = await db.session.run(
      'MATCH (u:User {email: $email}) RETURN u',
      { email }
    )
    if (r.records.length === 0) {
      return null
    }
    const dbUser = r.records[0].get('u').properties as IUserProps
    const user = new User(email)
    user.assignPropertiesOf(dbUser)
    return user
  }

  // create a new user
  public static async Create (email: string): Promise<User> {
    const u = new User(email)
    u.uuid = uuidV4()
    u.validationId = uuidV4()

    // u.password = await hash(password, 10)

    const db = Db.getInstance()
    try {
      await db.session.run(
        'CREATE (n:User {email: $email,  uuid: $uuid, emailVerified: false, validationId: $validationId})',
        {
          email: u.email,
          hashedPassword: u.password,
          uuid: u.uuid,
          validationId: u.validationId
        }
      )
    } catch (e) {
      if (e.code === 'Neo.ClientError.Schema.ConstraintValidationFailed') {
        // get user to check if he has completed his registration
        // if not act if it's a new user
        const r = await this.GetUser(u.email) as User
        if (r.password !== undefined) {
          throw AttError.New(`user.create: '${email}' is already registered`, `${email} is already registered. Try "Sign in" or "Password lost"`)
        }
        u.uuid = r.uuid
        u.validationId = r.validationId
      } else {
        throw e
      }
    }
    return u
  }

  // assign properties from object fetch from DB to instance
  // Warning !!! no type check is made, nor validation be sure of your properties
  private assignPropertiesOf (properties: IUserProps): void {
    this.email = properties.email
    this.uuid = properties.uuid
    this.password = properties.password
    this.validationId = properties.validationId
  }

  // save instance in DB
  private save (): void {
  }

  // send welcome email
  public async sendWelcomeEmail (): Promise<void> {
    const sib = new SendInBlue()
    await sib.sendTemplatedMail(this.email, 1, { validationId: this.validationId })
  }

  public async subscribeToNewsletter (): Promise<void> {
    const sib = new SendInBlue()
    await sib.subscribeToNewsletter(this.email, 2)
  }
}
