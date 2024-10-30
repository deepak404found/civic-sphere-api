import { Router } from 'express'
import { pgClient } from '../../conn'
import { z } from 'zod'
import { validateRequestBody } from '../../helpers/zodValidator'
import { EmployeeSchema, IEmployee } from '../../schemas/employess'
import { RoleAny, ValidateRole } from '../../auth/authValidator'
import { UserRoleEnum } from '../../schemas/employess'

const employeesRouter = Router()

employeesRouter.get('/', RoleAny, async (req, res) => {
    try {
        const employees = await pgClient.query('SELECT * FROM employees')

        res.status(200).json({
            message: 'employees fetched',
            payload: employees.rows,
            total: employees.rowCount
        })
    } catch (err) {
        console.log('error ocuured: ', err)

        res.status(500).json({
            message: 'something went wrong'
        })
    }
})

employeesRouter.put('/add_employee', validateRequestBody(EmployeeSchema), async (req, res) => {
    try {
        const newEmployee = req.body as IEmployee

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
        console.log('error ocuured: ', err)

        res.status(500).json({
            message: 'something went wrong'
        })
    }
})

export default employeesRouter
