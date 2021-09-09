import {
  ContactsApi,
  ContactsApiApiKeys, CreateContact,
  SendSmtpEmail,
  TransactionalEmailsApi,
  TransactionalEmailsApiApiKeys
} from '@sendinblue/client'

export class SendInBlue {
  private readonly _apikey: string

  private _transactionalEmailsApi?: TransactionalEmailsApi
  private _contactsApi?: ContactsApi

  constructor () {
    // sendinblue api key
    const apiKey: string | undefined = process.env.ATT_SIB_API_KEY
    if (apiKey === undefined) {
      throw new Error('ATT_SIB_API_KEY not found in ENV')
    }
    this._apikey = apiKey
  }

  private _initTransactionalEmailsApi (): void {
    if (this._transactionalEmailsApi instanceof TransactionalEmailsApi) {
      return
    }
    this._transactionalEmailsApi = new TransactionalEmailsApi()
    this._transactionalEmailsApi.setApiKey(TransactionalEmailsApiApiKeys.apiKey, this._apikey)
  }

  private _initContactsApi (): void {
    if (this._contactsApi instanceof ContactsApi) {
      return
    }
    this._contactsApi = new ContactsApi()
    this._contactsApi.setApiKey(ContactsApiApiKeys.apiKey, this._apikey)
  }

  // send templated mail
  public async sendTemplatedMail (to: string, templateId: number, params?: object): Promise<void> {
    this._initTransactionalEmailsApi()
    const email = new SendSmtpEmail()
    email.to = [{ email: to }]
    email.templateId = templateId
    email.params = params
    await this._transactionalEmailsApi!.sendTransacEmail(email)
  }

  // subscribe to newsletter
  public async subscribeToNewsletter (email: string, listId: number): Promise<void> {
    this._initContactsApi()
    const createContact = new CreateContact()
    createContact.email = email
    createContact.listIds = [listId]
    await this._contactsApi!.createContact(createContact)
  }
}
