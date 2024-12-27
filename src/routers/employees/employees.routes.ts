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
import { BadRequestError, errorHandler, NotFoundError } from '../../helpers/errorHandler'
import { ListQueryParamsType, validateListQueryParams, validateRequestBody } from '../../helpers/zodValidator'
import { count, eq } from 'drizzle-orm'
import { fetchDepartmentByName } from '../../controllers/departments'

const employeesRouter = Router()

employeesRouter.get('/', RoleAny, validateListQueryParams, async (req, res) => {
    try {
        const { skip, limit, search, sortBy, sortOrder } = req.query as unknown as ListQueryParamsType

        const sortByColumn = sortBy ? sortBy : 'createdAt'

        const employees = await db.query.employees.findMany({
            offset: skip,
            limit: limit,
            where: search ? (employees, { like }) => like(employees.full_name, `%${search}%`) : undefined,
            orderBy: (employees, { asc, desc }) => {
                if (sortOrder === 'asc') {
                    return asc(employees[sortByColumn])
                } else {
                    return desc(employees[sortByColumn])
                }
            }
        })

        res.status(200).json({
            message: 'employees fetched',
            payload: {
                employees: employees.map((employee) => employeeSchema.parse(employee)),
                total: await db.select({ count: count() }).from(employeesTable).execute()
            }
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
        console.log('uid', uid)

        const employee = await db.query.employees.findFirst({
            where: (employees, { eq }) => eq(employees.id, uid)
        })

        if (!employee) throw new BadRequestError('Employee not found')

        res.status(200).json({
            message: 'Employee fetched successfully',
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
    '/add',
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

        if (!employee) throw new NotFoundError('Employee not found')

        const result = await db.delete(employeesTable).where(eq(employeesTable.id, uid)).returning()

        res.status(200).json({
            message: 'Employee deleted successfully',
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

            if (!employee) throw new NotFoundError('Employee not found')

            // check if employee already exists by email if email is being updated
            if (updatedEmployee.email) {
                const checkEmployeeQuery = await db.query.employees.findFirst({
                    where: (employees, { eq }) => eq(employees.email, updatedEmployee.email as string)
                })
                if (checkEmployeeQuery) throw new BadRequestError('This email is already in use')
            }

            // ftech department
            if (updatedEmployee.department) {
                const department = await fetchDepartmentByName(updatedEmployee.department as string)
                updatedEmployee.department = department.id
            }

            const result = await db.update(employeesTable).set(updatedEmployee).where(eq(employeesTable.id, uid)).returning()

            res.status(200).json({
                message: 'Employee updated successfully',
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
