import { Router } from 'express'
import { z } from 'zod'
import { GenerateJWT } from '../../auth/authValidator'
import { db } from '../../conn'
import { fetchDepartmentById } from '../../controllers/departments'
import { verifyPassword } from '../../controllers/employees'
import { employeeSchema, insertEmployeeSchema, UserRoleEnum } from '../../db/schema/employees.schema'
import { errorHandler, ForbiddenError } from '../../helpers/errorHandler'
import { validateRequestBody } from '../../helpers/zodValidator'

const loginRouter = Router()

const LoginSchema = insertEmployeeSchema.pick({
    email: true,
    pass: true
})

loginRouter.post('/login', validateRequestBody(LoginSchema), async (req, res) => {
    try {
        const loginData = req.body as z.infer<typeof LoginSchema>

        const result = await db.query.employees.findFirst({
            where: (employees, { eq }) => eq(employees.email, loginData.email)
        })

        const validPass = await verifyPassword(loginData.pass, result?.pass || '')
        if (!result || !validPass) throw new ForbiddenError('Invalid Credentials')

        // fetch the department name
        const department = await fetchDepartmentById(result.department as string)

        const token = GenerateJWT({ email: loginData.email, department: department.name, role: result.role as UserRoleEnum })

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
