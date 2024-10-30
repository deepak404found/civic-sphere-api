import { Router } from 'express'
import { z } from 'zod'
import { pgClient } from '../../conn'
import { GenerateJWT } from '../../auth/authValidator'
import { errorHandler, ForbiddenError } from '../../helpers/errorHandler'
import { UserRoleEnum } from '../../schemas/employess'
import { validateRequestBody } from '../../helpers/zodValidator'

const loginRouter = Router()

const LoginSchema = z.object({
    username: z.string().min(4).max(12),
    pass: z.string().min(8).max(20),
    department: z.string(),
    role: z.nativeEnum(UserRoleEnum)
})

loginRouter.post('/login', validateRequestBody(LoginSchema), async (req, res) => {
    try {
        const loginData = req.body as z.infer<typeof LoginSchema>
        // console.log('loginData', loginData)

        const loginQuery = {
            text: `SELECT * FROM employees WHERE username = $1 AND pass = crypt($2, pass) AND department = $3 AND role = $4`,
            values: [loginData.username, loginData.pass, loginData.department, loginData.role]
        }

        const result = await pgClient.query(loginQuery)

        if (result.rowCount === 0) throw new ForbiddenError('Invalid Credentials')

        // generate token and send it back
        const token = GenerateJWT({ username: loginData.username, department: loginData.department })

        res.status(200).json({
            message: 'logged in',
            token,
            user: result.rows[0]
        })
    } catch (error) {
        // console.log(error)
        const toReturn = errorHandler(error)
        res.status(toReturn.code).json({
            message: toReturn.message,
            name: toReturn.name
        })
    }
})

export default loginRouter
