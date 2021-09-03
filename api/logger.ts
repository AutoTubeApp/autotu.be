import { createLogger, format, transports, Logform } from 'winston'
import { ConsoleTransportInstance, FileTransportInstance } from 'winston/lib/winston/transports'

let transport: ConsoleTransportInstance | FileTransportInstance

if (process.env.NODE_ENV === 'development') {
  transport = new transports.Console()
} else {
  transport = new transports.File({
    filename: '/var/log/www/autotu.be/server.log'
  })
}

export const logger = createLogger({
  transports: [
    transport
  ],
  format: format.combine(
    format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
    format.printf((info: Logform.TransformableInfo) => `${info.level}: ${[info.timestamp]}: ${info.message}`)
  )
})
