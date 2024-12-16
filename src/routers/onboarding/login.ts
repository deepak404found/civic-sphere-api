import { Router } from 'express'
import { z } from 'zod'
import { GenerateJWT } from '../../auth/authValidator'
import { db } from '../../conn'
import { verifyPassword } from '../../controllers/employees'
import { employeeSchema, insertEmployeeSchema } from '../../db/schema/employees.schema'
import { errorHandler, ForbiddenError } from '../../helpers/errorHandler'
import { validateRequestBody } from '../../helpers/zodValidator'

const loginRouter = Router()

// const LoginSchema = z.object({
//     username: z.string().min(4).max(12),
//     pass: z.string().min(8).max(20),
//     department: z.string(),
//     role: z.nativeEnum(UserRoleEnum)
// })

const LoginSchema = insertEmployeeSchema.pick({
    email: true,
    pass: true,
    department: true,
    role: true
})

loginRouter.post('/login', validateRequestBody(LoginSchema), async (req, res) => {
    try {
        const loginData = req.body as z.infer<typeof LoginSchema>

        const result = await db.query.employees.findFirst({
            where: (employees, { eq, and }) =>
                and(
                    eq(employees.email, loginData.email),
                    eq(employees.department, loginData.department),
                    eq(employees.role, loginData.role)
                )
        })

        const validPass = await verifyPassword(loginData.pass, result?.pass || '')
        if (!result || !validPass) throw new ForbiddenError('Invalid Credentials')

        const token = GenerateJWT({ email: loginData.email, department: loginData.department, role: loginData.role })

        res.status(200).json({
            message: 'logged in',
            token,
            user: employeeSchema.parse(result)
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
