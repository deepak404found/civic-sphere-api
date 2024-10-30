import jwt from 'jsonwebtoken'
import { vars } from '../env'
import { RequestHandler } from 'express'
import { pgClient } from '../conn'
import { IPartialEmployee, UserRoleEnum } from '../schemas/employess'
import { errorHandler, ForbiddenError, UnauthorizedError } from '../helpers/errorHandler'
import { logger } from '../helpers/logger'

export type TokenData = {
    username: string
    department: string
    iat: number
    exp: number
}

export type TokenError = {
    name: 'TokenExpiredError' | 'JsonWebTokenError' | 'NotBeforeError'
}

export type TokenResult = TokenData | TokenError

export function tokenIsError(token: TokenResult): token is TokenError {
    return (token as TokenError).name !== undefined
}

export const GenerateJWT = (payload: IPartialEmployee) => {
    return jwt.sign(payload, vars.JWT_SECRET, { expiresIn: vars.JWT_EXPIRY })
}

export const ValidateJWT = (token: string): TokenResult => {
    try {
        return jwt.verify(token, vars.JWT_SECRET) as TokenData
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return { name: 'TokenExpiredError' }
        }

        if (error instanceof jwt.JsonWebTokenError) {
            return { name: 'JsonWebTokenError' }
        }

        if (error instanceof jwt.NotBeforeError) {
            return { name: 'NotBeforeError' }
        } else {
            return { name: 'JsonWebTokenError' }
        }
    }
}

export const ValidateRole = (role: UserRoleEnum[]): RequestHandler => {
    return async (req, res, next) => {
        try {
            if (!req.headers.authorization) {
                res.status(401).json({
                    message: 'Authorization header is missing'
                })
                return
            }

            const token = req.headers.authorization.split(' ')[1]
            const tokenResults = ValidateJWT(token)

            if (tokenIsError(tokenResults)) {
                throw new UnauthorizedError(tokenResults.name)
            }

            // logger.info('tokenResults', tokenResults)

            // get employee role from db
            const employee = await pgClient.query('SELECT role FROM employees WHERE username = $1', [tokenResults.username])

            if (!role.includes(employee.rows[0].role)) {
                throw new ForbiddenError(`${role} role is required for this route`)
            }

            res.locals.employee = employee.rows[0]
            next()
        } catch (error) {
            // console.log(error)
            const toReturn = errorHandler(error)
            res.status(toReturn.code).json({
                message: toReturn.message,
                name: toReturn.name
            })
        }
    }
}

export const RoleAny = ValidateRole(Object.values(UserRoleEnum))
