import { Router } from 'express'
import { pgClient } from '../../conn'
import { z } from 'zod'
import { validateRequestBody } from '../../helpers/zodValidator'

const employeesRouter = Router()

const EmployeeSchema = z.object({
    username: z.string().min(4).max(12),
    pass: z.string().min(8).max(12),
    full_name: z.string().min(4).max(30).optional(),
    email: z.string().email().optional(),
    phone: z.string().min(10).max(12).optional(),
    department: z.string()
})

employeesRouter.get('/emplyees_list', async (req, res) => {
    try {
        const employees = await pgClient.query('SELECT * FROM employees')

        console.log('res', employees.rows)

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
        const newEmployee = req.body as z.infer<typeof EmployeeSchema>
        console.log(newEmployee, 'body')

        const addEmployeeQuery = {
            text: `INSERT INTO employees(username, pass, full_name, email, phone, department)
            VALUES ($1, crypt($2, gen_salt('bf')), $3, $4, $5, $6)`,
            values: [newEmployee.username, newEmployee.pass, newEmployee.full_name, newEmployee.email, newEmployee.phone, newEmployee.department]
        }

        const result = await pgClient.query(addEmployeeQuery)
        console.log('result', result)

        res.status(200).json({
            message: 'added employee',
            payload: result.rows
        })
    } catch (err) {
        console.log('error ocuured: ', err)

        res.status(500).json({
            message: 'something went wrong'
        })
    }
})

export default employeesRouter
