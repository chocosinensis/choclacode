'use strict'

const { resolve } = require('path')
const { createWriteStream, existsSync, mkdir } = require('fs')

/** Logger levels */
const levels = {
  info: 'info',
  debug: 'debug',
  warn: 'warn',
  error: 'error',
  fatal: 'fatal',
}

/**
 * Logger class to store logs inside the file system
 *
 * @class
 */
class Logger {
  #e = process.env.NODE_ENV
  #filename
  #id = Math.floor(Math.random() * 100)
  #dir = resolve(__dirname, '../../logs')
  #path
  #console

  /**
   * @param {String} filename The filename for the log file
   * @param {'info' | 'debug' | 'warn' | 'error' | 'fatal'} level The debug level
   */
  constructor(filename, level = levels.info) {
    this.level = level

    this.#filename = `${filename}.${this.#e}.log`
    this.#dir = resolve(__dirname, '../../logs')
    this.#path = resolve(this.#dir, this.#filename)

    this.#refresh()
    this.#console = new console.Console(createWriteStream(this.#path, { flags: 'a' }))
    this.#console.log(`\n<<- ${new Date().toISOString()} =<< <||| ~@[${this.#id}] |||> >>= [${this.level}] ->>\n`)
  }

  #refresh() {
    if (this.#e === 'production') return true
    if (!existsSync(this.#dir)) mkdir(this.#dir, () => {})
    if (!existsSync(this.#path)) this.#console = new console.Console(createWriteStream(this.#path, { flags: 'a' }))
  }

  /**
   * Logs a message <br>
   * Doesn't do anything in production environment
   *
   * @param {...String} msgs The messages to be logged
   * @public
   */
  log(...msgs) {
    if (this.#refresh()) return

    const date = new Date().toISOString()
    const finalMsg = `${date}\t~@[${this.#id}]\t[${this.level}]\t${msgs.join(' ')}`

    switch (this.level) {
      case levels.info:
        this.#console.info(finalMsg)
        break
      case levels.debug:
        this.#console.debug(finalMsg)
        break
      case levels.warn:
        this.#console.warn(finalMsg)
        break
      case levels.error:
      case levels.fatal:
        this.#console.error(finalMsg, '\n')
        break
      default:
        this.#console.log(finalMsg)
        break
    }

    return this
  }

  /** The default logger to be used */
  static logger = new Logger('default')

  /** The error logger to be used */
  static error = new Logger('error', levels.error)

  static levels = levels

  static Logger = Logger

  /**
   * Custom logger
   *
   * @param {'info' | 'debug' | 'warn' | 'error' | 'fatal'} level The level to be logged
   * @param {...String} msgs The messages to log
   */
  static log = (level, ...msgs) => {
    const logger = new Logger(['error', 'fatal'].includes(level) ? 'error' : 'default', level)
    logger.log(msgs)
  }
}

module.exports = Logger
