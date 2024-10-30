import { Router } from 'express'
import { pgClient } from '../../conn'
import { z } from 'zod'
import { validateRequestBody } from '../../helpers/zodValidator'
import { AddEmployeeSchema, EmployeeSchema, IEmployee } from '../../schemas/employess'
import { RoleAny, ValidateRole } from '../../auth/authValidator'
import { UserRoleEnum } from '../../schemas/employess'
import { logger } from '../../helpers/logger'
import { errorHandler, NotFoundError } from '../../helpers/errorHandler'

const employeesRouter = Router()

employeesRouter.get('/', RoleAny, async (req, res) => {
    try {
        const employees = await pgClient.query('SELECT * FROM employees')

        // remove pass from response
        employees.rows = employees.rows.map((employee) => {
            delete employee.pass
            return employee
        })

        res.status(200).json({
            message: 'employees fetched',
            payload: employees.rows,
            total: employees.rowCount
        })
    } catch (error) {
        const toReturn = errorHandler(error)
        res.status(toReturn.code).json({
            message: toReturn.message,
            name: toReturn.name
        })
    }
})

employeesRouter.get('/:username', RoleAny, async (req, res) => {
    try {
        const { username } = req.params

        const employee = await pgClient.query('SELECT * FROM employees WHERE username = $1', [username])

        if (employee.rowCount === 0) {
            throw new NotFoundError('Employee not found')
        }

        // remove pass from response
        employee.rows = employee.rows.map((employee) => {
            delete employee.pass
            return employee
        })

        res.status(200).json({
            message: 'employee fetched',
            payload: employee.rows[0]
        })
    } catch (error) {
        const toReturn = errorHandler(error)
        res.status(toReturn.code).json({
            message: toReturn.message,
            name: toReturn.name
        })
    }
})

employeesRouter.put('/add_employee', ValidateRole([UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ADMIN]), validateRequestBody(AddEmployeeSchema), async (req, res) => {
    try {
        const newEmployee = req.body as z.infer<typeof AddEmployeeSchema>

        const addEmployeeQuery = {
            text: `INSERT INTO employees(username, pass, full_name, email, phone, department, role)
            VALUES ($1, crypt($2, gen_salt('bf')), $3, $4, $5, $6, $7) RETURNING *`,
            values: [newEmployee.username, newEmployee.pass, newEmployee.full_name, newEmployee.email, newEmployee.phone, newEmployee.department, newEmployee.role]
        }

        const result = await pgClient.query(addEmployeeQuery)
        // console.log('result', result)

        res.status(200).json({
            message: 'added employee',
            payload: result.rows[0]
        })
    } catch (err) {
        const toReturn = errorHandler(err)
        res.status(toReturn.code).json({
            message: toReturn.message,
            name: toReturn.name
        })
    }
})

employeesRouter.delete('/delete_employee/:username', ValidateRole([UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ADMIN]), async (req, res) => {
    try {
        const { username } = req.params

        const deleteEmployeeQuery = {
            text: `DELETE FROM employees WHERE username = $1 RETURNING *`,
            values: [username]
        }

        const result = await pgClient.query(deleteEmployeeQuery)
        // console.log('result', result)

        res.status(200).json({
            message: 'deleted employee',
            payload: result.rows[0]
        })
    } catch (err) {
        const toReturn = errorHandler(err)
        res.status(toReturn.code).json({
            message: toReturn.message,
            name: toReturn.name
        })
    }
})

export default employeesRouter
