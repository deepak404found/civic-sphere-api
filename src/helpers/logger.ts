import winston from 'winston'

const isDevEnvironment = () => process.env.NODE_ENV === 'development'

const customLevels = {
    levels: {
        trace: 5,
        debug: 4,
        info: 3,
        warn: 2,
        error: 1,
        fatal: 0
    },
    colors: {
        trace: 'white',
        debug: 'green',
        info: 'green',
        warn: 'yellow',
        error: 'red',
        fatal: 'red'
    }
}

const formatter = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.splat(),
    winston.format.printf((info) => {
        const { timestamp, level, message, ...meta } = info

        return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`
    })
)

class Logger {
    private logger: winston.Logger

    constructor() {
        const errorTransport = new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error'
        })

        const infoTransport = new winston.transports.File({
            filename: 'logs/info.log',
            level: 'info'
        })

        const consoleTransport = new winston.transports.Console({
            format: formatter
        })
        let transports: any = [consoleTransport]

        if (!isDevEnvironment()) {
            transports = [errorTransport, infoTransport, consoleTransport]
        }

        this.logger = winston.createLogger({
            level: isDevEnvironment() ? 'trace' : 'info',
            // level: 'info',
            levels: customLevels.levels,
            // transports: [isDevEnvironment() ? transport : errorTransport],
            transports
        })
        winston.addColors(customLevels.colors)
    }

    trace(msg: any, meta?: any) {
        this.logger.log('trace', msg, meta)
    }

    debug(msg: any, meta?: any) {
        this.logger.debug(msg, meta)
    }

    info(msg: any, meta?: any) {
        // add to redis stream with max len 5
        /* redisClient.xadd(
            'logs',
            'MAXLEN',
            5,
            '*',
            'level',
            'info',
            'message',
            msg,
        ) */

        this.logger.info(msg, meta)
    }

    warn(msg: any, meta?: any) {
        this.logger.warn(msg, meta)
    }

    error(msg: any, meta?: any) {
        this.logger.error(msg, meta)
    }

    fatal(msg: any, meta?: any) {
        this.logger.log('fatal', msg, meta)
    }
}

export const logger = new Logger()
