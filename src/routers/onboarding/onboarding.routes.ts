import { Router } from 'express'
import { z } from 'zod'
import { GenerateJWT } from '../../auth/authValidator'
import { db } from '../../conn'
import { fetchDepartmentById } from '../../controllers/departments'
import { verifyPassword } from '../../controllers/users'
import { Userschema, insertUserschema, UserRoleEnum } from '../../db/schema/users.schema'
import { BadRequestError, errorHandler, ForbiddenError } from '../../helpers/errorHandler'
import { validateRequestBody } from '../../helpers/zodValidator'

const loginRouter = Router()

const LoginSchema = insertUserschema.pick({
    district_name_en: true,
    pass: true
})

loginRouter.post('/login', validateRequestBody(LoginSchema), async (req, res) => {
    try {
        const loginData = req.body as z.infer<typeof LoginSchema>

        const result = await db.query.usersTable.findFirst({
            where: (users, { eq }) => eq(users.district_name_en, loginData.district_name_en),
            with: {
                department: true
            }
        })

        const validPass = await verifyPassword(loginData.pass, result?.pass || '')
        if (!result || !validPass) throw new BadRequestError('Invalid Credentials')

        const token = GenerateJWT({
            districtName: loginData.district_name_en,
            department: result?.department?.name as string,
            role: result.role as UserRoleEnum
        })

        res.status(200).json({
            message: 'logged in',
            token,
            user: Userschema.parse(result)
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
