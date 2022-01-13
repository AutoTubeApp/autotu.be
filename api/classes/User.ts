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
  username?: string
  password?: string
  validationId?: string
}

// Autotube User
export class User {
  private _email: string
  private _uuid?: string
  private _username?: string
  private _password?: string
  private _validationId?: string

  constructor (email: string) {
    // eslint-disable-next-line import/no-named-as-default-member
    if (!validator.isEmail(email)) {
      throw AttError.New(`new user: bad email '${email}'`, `'${email}' is not a valid email`)
    }
    this._email = email.toLowerCase()
  }

  public get email (): string {
    return this._email
  }

  public set email (email: string) {
    // validate email
    // eslint-disable-next-line import/no-named-as-default-member
    if (!validator.isEmail(email)) {
      throw AttError.New(`set email: invalid email '${email}'`, `'${email}' is not a valid email`)
    }
    this._email = email
  }

  public get uuid (): string | undefined {
    return this._uuid
  }

  public set uuid (uuid: string | undefined) {
    this._uuid = uuid
  }

  public set username (username: string | undefined) {
    // validation
    if (!username) {
      throw AttError.New('username is undefined', 'username is required.')
    }

    // - no space
    if (/\s/.test(username)) {
      throw AttError.New('spaces are not allowed in username', 'spaces are not allowed in username.')
    }

    // - > 3 && < 21
    if (username.length < 4 || username.length > 21) {
      throw AttError.New(`bad length for username, should be between 4 and 21, ${username.length} given`, 'bad length for username, must be between 4 and 21 chars.')
    }
    // alphanumeric
    // eslint-disable-next-line import/no-named-as-default-member
    if (!validator.isAlphanumeric(username)) {
      throw AttError.New('username must be alphanumeric', 'username must be alphanumeric.')
    }

    username = username.toLowerCase()
    // ok
    this._username = username.toLowerCase()
  }

  public get username (): string | undefined {
    return this._username
  }

  // set password from clear password
  public async setPassword (password: string): Promise<void> {
    // validation
    if (!password) {
      throw AttError.New('password is undefined', 'password is required.')
    }
    // - no space
    if (/\s/.test(password)) {
      throw AttError.New('spaces are not allowed in password', 'spaces are not allowed in password.')
    }

    // - > 3 && < 21
    if (password.length < 8 || password.length > 15) {
      throw AttError.New(`bad length for password, should be between 8 and 15, ${password.length} given`, 'bad length for username, must be between 8 and 15 chars.')
    }

    this._password = await hash(password, 10)
  }

  public get password (): string | undefined {
    return this._password
  }

  public get validationId (): string | undefined {
    return this._validationId
  }

  public set validationId (validationId: string | undefined) {
    this._validationId = validationId
  }

  // check if username exists
  public static async UsernameExists (username: string): Promise<boolean> {
    username = username.toLowerCase()
    const u = await User.GetUserByUsername(username)
    return u !== null
  }

  // update validationId
  public updateValidationId (): void {
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

  // get user by validationId
  public static async GetUserByUsername (username: string): Promise<User | null> {
    const db = Db.getInstance()

    const r = await db.session.run('MATCH (u:User {username: $username}) RETURN u',
      { username }
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
    } catch (e:any) {
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

    await db.session.run(
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

  public async sendResetPasswordEmail (): Promise<void> {
    const sib = new SendInBlue()
    await sib.sendTemplatedMail(this._email, 2, { validationId: this._validationId })
  }

  public async subscribeToNewsletter (): Promise<void> {
    const sib = new SendInBlue()
    await sib.subscribeToNewsletter(this._email, 2)
  }
}
