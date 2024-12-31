import { RequestHandler } from 'express'
import jwt from 'jsonwebtoken'
import { db } from '../conn'
import { UserRoleEnum } from '../db/schema/users.schema'
import { vars } from '../env'
import { errorHandler, UnauthorizedError } from '../helpers/errorHandler'

export type TokenData = {
    districtName: string
    role: UserRoleEnum
    department: string
    iat: number
    exp: number
}

export type TokenError = {
    name: 'TokenExpiredError' | 'JsonWebTokenError' | 'NotBeforeError'
}

export type IPartialUser = {
    districtName?: string
    department?: string
    role?: UserRoleEnum
}

export type TokenResult = TokenData | TokenError

export function tokenIsError(token: TokenResult): token is TokenError {
    return (token as TokenError).name !== undefined
}

export const GenerateJWT = (payload: IPartialUser) => {
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

            // check if the role is in the list of allowed roles
            if (!role.includes(tokenResults.role)) {
                throw new UnauthorizedError('Invalid Role')
            }

            // query the db for the user
            const user = await db.query.usersTable.findFirst({
                where: (users, { eq }) => eq(users.district_name_en, tokenResults.districtName),
                with: {
                    department: true
                }
            })

            if (!user) {
                throw new UnauthorizedError('Invalid Token')
            }

            // set the user in the request object
            res.locals.user = user

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

export const ValidateAdminsApi = ValidateRole([UserRoleEnum.ADMIN, UserRoleEnum.SUPER_ADMIN])
