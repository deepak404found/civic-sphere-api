import { logger } from './logger'

class BaseError extends Error {
    public message: string
    public statusCode: number
    public name: string

    constructor(message: string) {
        super(message)
        this.message = message
    }
}

export class UnauthorizedError extends BaseError {
    constructor(message: string) {
        super(message)
        this.statusCode = 401
        this.name = 'UnauthorizedError'
    }
}

export class NotFoundError extends BaseError {
    constructor(message: string) {
        super(message)
        this.statusCode = 404
        this.name = 'NotFoundError'
    }
}

export class BadRequestError extends BaseError {
    constructor(message: string) {
        super(message)
        this.statusCode = 400
        this.name = 'BadRequestError'
    }
}

export class InternalServerError extends BaseError {
    constructor(message: string) {
        super(message)
        this.statusCode = 500
        this.name = 'InternalServerError'
    }
}

export class ForbiddenError extends BaseError {
    constructor(message: string) {
        super(message)
        this.statusCode = 403
        this.name = 'ForbiddenError'
    }
}

export function errorHandler(error: BaseError) {
    let toReturn: { code: number; message: string; name: string } = {
        code: 500,
        message: 'Internal Server Error',
        name: 'InternalServerError'
    }

    if (error instanceof BaseError) {
        // res.status(error.statusCode).json({ message: error.message })
        toReturn.code = error.statusCode
        toReturn.message = error.message
        toReturn.name = error.name

        logger.error(error)
        return toReturn
    }

    logger.fatal(error)

    // res.status(500).json({ message: 'Internal Server Error' })
    return toReturn
}
