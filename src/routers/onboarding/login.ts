import { Router } from 'express'
import { z } from 'zod'
import { GenerateJWT } from '../../auth/authValidator'
import { db } from '../../conn'
import { verifyPassword } from '../../controllers/employees'
import { employeeSchema, insertEmployeeSchema, UserRoleEnum } from '../../db/schema/employees.schema'
import { errorHandler, ForbiddenError, NotFoundError } from '../../helpers/errorHandler'
import { validateRequestBody } from '../../helpers/zodValidator'

const loginRouter = Router()

const LoginSchema = insertEmployeeSchema
    .pick({
        email: true,
        pass: true,
        department: true,
        role: true
    })
    .extend({
        role: z.nativeEnum(UserRoleEnum)
    })

loginRouter.post('/login', validateRequestBody(LoginSchema), async (req, res) => {
    try {
        const loginData = req.body as z.infer<typeof LoginSchema>

        // fetch department from db by name
        const deptId = await db.query.departments
            .findFirst({
                where: (departments, { eq }) => eq(departments.name, loginData.department)
            })
            .then((res) => res?.id)

        // if department not found, throw error
        if (!deptId) throw new NotFoundError('Department not found')

        console.log('deptId', deptId, loginData)

        const result = await db.query.employees.findFirst({
            where: (employees, { eq, and }) =>
                and(eq(employees.email, loginData.email), eq(employees.department, deptId), eq(employees.role, loginData.role))
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
