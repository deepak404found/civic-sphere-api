import { Router } from 'express'
import { RoleAny, ValidateRole } from '../../auth/authValidator'
import { db } from '../../conn'
import { insertEmployee } from '../../controllers/employees'
import {
    employeeSchema,
    employeesTable,
    IAddEmployee,
    insertEmployeeSchema,
    IUpdateEmployee,
    updateEmployeeSchema,
    UserRoleEnum
} from '../../db/schema/employees.schema'
import { BadRequestError, errorHandler } from '../../helpers/errorHandler'
import { validateRequestBody } from '../../helpers/zodValidator'
import { eq } from 'drizzle-orm'

const employeesRouter = Router()

employeesRouter.get('/', RoleAny, async (req, res) => {
    try {
        const employees = (await db.query.employees.findMany())?.map((employee) => {
            return employeeSchema.parse(employee)
        })

        res.status(200).json({
            message: 'employees fetched',
            payload: employees,
            total: employees.length
        })
    } catch (error) {
        const toReturn = errorHandler(error)
        res.status(toReturn.code).json({
            message: toReturn.message,
            name: toReturn.name
        })
    }
})

employeesRouter.get('/:uid', RoleAny, async (req, res) => {
    try {
        const { uid } = req.params

        const employee = await db.query.employees.findFirst({
            where: (employees, { eq }) => eq(employees.id, uid)
        })

        if (!employee) throw new BadRequestError('Employee not found')

        res.status(200).json({
            message: 'employee fetched',
            payload: employeeSchema.parse(employee)
        })
    } catch (error) {
        const toReturn = errorHandler(error)
        res.status(toReturn.code).json({
            message: toReturn.message,
            name: toReturn.name
        })
    }
})

employeesRouter.put(
    '/add_employee',
    ValidateRole([UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ADMIN]),
    validateRequestBody(insertEmployeeSchema),
    async (req, res) => {
        try {
            const newEmployee = req.body as IAddEmployee

            // check if employee already exists by email
            const checkEmployeeQuery = await db.query.employees.findFirst({
                where: (employees, { eq }) => eq(employees.email, newEmployee.email)
            })
            if (checkEmployeeQuery) throw new BadRequestError('Employee already exists')

            const result = await insertEmployee(newEmployee)
            // console.log('result', result)

            res.status(200).json({
                message: 'added employee',
                payload: result
            })
        } catch (err) {
            const toReturn = errorHandler(err)
            res.status(toReturn.code).json({
                message: toReturn.message,
                name: toReturn.name
            })
        }
    }
)

employeesRouter.delete('/:uid', ValidateRole([UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ADMIN]), async (req, res) => {
    try {
        const { uid } = req.params

        const employee = await db.query.employees.findFirst({
            where: (employees, { eq }) => eq(employees.id, uid)
        })

        if (!employee) throw new BadRequestError('Employee not found')

        const result = await db.delete(employeesTable).where(eq(employeesTable.id, uid)).returning()

        res.status(200).json({
            message: 'deleted employee',
            payload: employeeSchema.parse(result[0])
        })
    } catch (err) {
        const toReturn = errorHandler(err)
        res.status(toReturn.code).json({
            message: toReturn.message,
            name: toReturn.name
        })
    }
})

// update employee
employeesRouter.patch(
    '/:uid',
    ValidateRole([UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ADMIN]),
    validateRequestBody(updateEmployeeSchema),
    async (req, res) => {
        try {
            const { uid } = req.params
            const updatedEmployee = req.body as IUpdateEmployee

            const employee = await db.query.employees.findFirst({
                where: (employees, { eq }) => eq(employees.id, uid)
            })

            if (!employee) throw new BadRequestError('Employee not found')

            const result = await db.update(employeesTable).set(updatedEmployee).where(eq(employeesTable.id, uid)).returning()

            res.status(200).json({
                message: 'updated employee',
                payload: employeeSchema.parse(result[0])
            })
        } catch (err) {
            const toReturn = errorHandler(err)
            res.status(toReturn.code).json({
                message: toReturn.message,
                name: toReturn.name
            })
        }
    }
)

export default employeesRouter
