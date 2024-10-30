import { Router } from 'express'
import employeesRouter from './employees'

const router = Router()

router.get('/healthcheck', (req, res) => {
    res.json({ message: 'Service is healthy' })
})

router.use(employeesRouter)

export default router
