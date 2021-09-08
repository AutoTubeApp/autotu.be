import { SendSmtpEmail, TransactionalEmailsApi, TransactionalEmailsApiApiKeys } from '@sendinblue/client'
import logger from '../logger'

export class Mailer {
  private readonly senderEmail: string | undefined
  private readonly senderName: string | undefined

  private sibClient: TransactionalEmailsApi

  constructor () {
    // ensure env variables
    // sendinblue api key
    const apiKey: string | undefined = process.env.ATT_SIB_API_KEY
    if (apiKey === undefined) {
      throw new Error('ATT_SIB_API_KEY not found in ENV')
    }

    // sender email
    this.senderEmail = process.env.ATT_SIB_SENDER_EMAIL
    if (this.senderEmail === undefined) {
      throw new Error('ATT_SIB_SENDER_EMAIL not found in ENV')
    }

    // sender name
    this.senderName = process.env.ATT_SIB_SENDER_EMAIL
    if (this.senderName === undefined) {
      throw new Error('ATT_SIB_SENDER_NAME not found in ENV')
    }

    this.sibClient = new TransactionalEmailsApi()
    this.sibClient.setApiKey(TransactionalEmailsApiApiKeys.apiKey, apiKey)
  }

  // sendmail
  public async sendMail (to: string, subject: string, body: string) {
    const email = new SendSmtpEmail()
    email.to = [{ email: to }]
    email.subject = subject
    email.sender = {
      email: this.senderEmail,
      name: this.senderName
    }
    email.replyTo = {
      email: this.senderEmail!,
      name: this.senderName
    }
    email.templateId = 1
    email.params = { validationid: 'iddevalitation' }

    logger.info('sending mail')
    await this.sibClient.sendTransacEmail(email)
    logger.info('mail send')
  }
}
