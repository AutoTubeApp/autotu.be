import { v4 as uuidV4 } from 'uuid'
import validator from 'validator'
import { compare, hash } from 'bcrypt'

import Db from '../Db'
import { AttError } from './Error'
import { SendInBlue } from './SendInBlue'

// User properties (used for assign props to user)
interface IUserProps {
  email: string
  uuid?: string
  username?: string
  password?: string
  validationId?: string
}

// Autotube User
// todo set all props as private
export class User {
  public _email: string
  private _username?: string
  public _uuid?: string
  private _password?: string
  public _validationId?: string

  constructor (email: string) {
    if (!validator.isEmail(email)) {
      throw AttError.New(`new user: bad email '${email}'`, `'${email}' is not a valid email`)
    }
    this._email = email.toLowerCase()
  }

  public set username (username: string | undefined) {
    this._username = username
  }

  public get username (): string | undefined {
    return this._username
  }

  // set password from clear password
  public async setPassword (password: string): Promise<void> {
    this._password = await hash(password, 10)
  }

  // update validationId
  public updateValidationUuid (): void {
    this._validationId = uuidV4()
  }

  // Get user by email
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

  // get user by validationId
  public static async GetUserByValidationId (validationId: string): Promise<User | null> {
    const db = Db.getInstance()

    const r = await db.session.run('MATCH (u:User {validationId: $validationId}) RETURN u',
      { validationId }
    )

    if (r.records.length === 0) {
      return null
    }
    const dbUser = r.records[0].get('u').properties as IUserProps
    const user = new User(dbUser.email)
    user.assignPropertiesOf(dbUser)
    return user
  }

  // create a new user
  public static async Create (email: string): Promise<User> {
    const u = new User(email)
    u._uuid = uuidV4()
    u._validationId = uuidV4()

    // u.password = await hash(password, 10)

    const db = Db.getInstance()
    try {
      await db.session.run(
        'CREATE (n:User {email: $email,  uuid: $uuid, emailVerified: false, validationId: $validationId})',
        {
          email: u._email,
          uuid: u._uuid,
          validationId: u._validationId
        }
      )
    } catch (e) {
      if (e.code === 'Neo.ClientError.Schema.ConstraintValidationFailed') {
        // get user to check if he has completed his registration
        // if not act if it's a new user
        const r = await this.GetUser(u._email) as User
        if (r._password !== undefined) {
          throw AttError.New(`user.create: '${email}' is already registered`, `${email} is already registered. Try "Sign in" or "Password lost"`)
        }
        u._uuid = r._uuid
        u._validationId = r._validationId
      } else {
        throw e
      }
    }
    return u
  }

  // assign properties from object fetch from DB to instance
  // Warning !!! no type check is made, nor validation be sure of your properties
  private assignPropertiesOf (properties: IUserProps): void {
    this._email = properties.email
    this._username = properties.username
    this._uuid = properties.uuid
    this._password = properties.password
    this._validationId = properties.validationId
  }

  // save User instance in DB
  public async save (): Promise<void> {
    const db = Db.getInstance()

    const r = await db.session.run(
      'MATCH (u:User {uuid: $uuid}) SET u += { email: $email, username: $username, password: $password, validationId: $validationId}',
      {
        uuid: this._uuid,
        email: this._email,
        username: this._username,
        password: this._password,
        validationId: this._validationId
      }
    )
  }

  // send welcome email
  public async sendWelcomeEmail (): Promise<void> {
    const sib = new SendInBlue()
    await sib.sendTemplatedMail(this._email, 1, { validationId: this._validationId })
  }

  public async subscribeToNewsletter (): Promise<void> {
    const sib = new SendInBlue()
    await sib.subscribeToNewsletter(this._email, 2)
  }
}
