import { v4 as uuidV4 } from 'uuid'
import validator from 'validator'
import { hash } from 'bcrypt'
import Db from '../Db'
import { AttError } from './Error'
import { SendInBlue } from './SendInBlue'

// DbRowUser
interface DbRowUser {
  id: number
  email: string
  uuid: string
  username: string
  password: string
  validation_id: string
}

// Autotube User
export class User {
  private _id?: number
  private _email: string
  private _uuid?: string
  private _username?: string
  private _password?: string
  private _validationId?: string

  constructor (dbRow:DbRowUser)
  constructor (email: string)
  constructor (data: string | DbRowUser) {
    if (typeof data === 'string') {
      // eslint-disable-next-line import/no-named-as-default-member
      if (!validator.isEmail(data)) {
        throw AttError.New(`new user: bad email '${data}'`, `'${data}' is not a valid email`)
      }
      this._email = this.email.toLowerCase()
    } else {
      this._id = data.id
      this._email = data.email
      this._uuid = data.uuid
      this._username = data.username
      this._password = data.password
      this._validationId = data.validation_id
    }
  }

  public get id (): number | undefined {
    return this._id
  }

  public set id (id: number | undefined) {
    this._id = id
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
      this._username = username
      return
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

  public set password (password: string | undefined) {
    this._password = password
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

  // update validationId
  public updateValidationId (): void {
    this._validationId = uuidV4()
  }

  // check if username exists
  public static async UsernameExists (username: string): Promise<boolean> {
    username = username.toLowerCase()
    const u = await User.GetUserByUsername(username)
    return u !== null
  }

  // Get user by email
  public static async GetUser (email: string): Promise<User | null> {
    const db = Db.getInstance()
    const r = await db.pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    )
    if (r.rows.length === 0) {
      return null
    }

    return new User(r.rows[0])
  }

  // get user by validationId
  public static async GetUserByValidationId (validationId: string): Promise<User | null> {
    const db = Db.getInstance()
    const r = await db.pool.query(
      'SELECT * FROM users WHERE validation_id = $1',
      [validationId]
    )
    if (r.rows.length === 0) {
      return null
    }
    return new User(r.rows[0])
  }

  // get user by username
  public static async GetUserByUsername (username: string): Promise<User | null> {
    const db = Db.getInstance()

    const r = await db.pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    )
    if (r.rows.length === 0) {
      return null
    }
    return new User(r.rows[0])
  }

  // create a new user
  public static async Create (email: string): Promise<User> {
    const u = new User(email)
    u._uuid = uuidV4()
    u._validationId = uuidV4()

    const db = Db.getInstance()
    // eslint-disable-next-line no-useless-catch
    try {
      await db.pool.query(
        'INSERT INTO users (uuid, email, validation_id) VALUES ($1, $2, $3)',
        [u._uuid, u._email, u._validationId]
      )
      return u
    } catch (e: any) {
      if (e.message.startsWith('duplicate key')) {
        // user exists
        // if password is undefined, it means that the user has not completed his registration
        const user = await this.GetUser(email) as User
        if (user.password) {
          throw AttError.New(`user.create: '${email}' is already registered`,
            `${email} is already registered. Try "Sign in" or "Password lost"`,
            400)
        }
        u._uuid = user.uuid
        u._validationId = user.validationId
      } else {
        throw e
      }
      return u
    }
  }

  // save User instance in DB
  public async save (): Promise<void> {
    const db = Db.getInstance()
    await db.pool.query(
      'UPDATE users SET email = $1, username = $2, password = $3, validation_id = $4 WHERE uuid = $5',
      [this._email, this._username, this._password, this._validationId, this._uuid]
    )
  }

  // send welcome email
  public async sendWelcomeEmail (): Promise<void> {
    const sib = new SendInBlue()
    await sib.sendTemplatedMail(this._email, 1, { validationId: this._validationId })
  }

  // send  reset password email
  public async sendResetPasswordEmail (): Promise<void> {
    const sib = new SendInBlue()
    await sib.sendTemplatedMail(this._email, 2, { validationId: this._validationId })
  }

  // subscribe user to the newsletter
  public async subscribeToNewsletter (): Promise<void> {
    const sib = new SendInBlue()
    await sib.subscribeToNewsletter(this._email, 2)
  }
}
