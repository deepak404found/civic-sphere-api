import { Router } from 'express'
import { pgClient } from '../../conn'

const employeesRouter = Router()

employeesRouter.get('/emplyees_list', async (req, res) => {
    try {
        const employees = await pgClient.query('SELECT * FROM public.employees')

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

employeesRouter.put('/add_employee', async (req, res) => {
    try {
        const body = req.body
        console.log(body, 'body')

        res.status(200).json({
            message: 'added employee',
            payload: {}
        })
    } catch (err) {
        console.log('error ocuured: ', err)

        res.status(500).json({
            message: 'something went wrong'
        })
    }
})

export default employeesRouter
