import { Router } from 'express'
import employeesRouter from './employees/employees.routes'
import loginRouter from './onboarding/onboarding.routes'
import departmentsRouter from './departments/departments.routes'

const router = Router()

router.get('/healthcheck', (req, res) => {
    res.json({ message: 'Service is healthy' })
})
router.get('/', (req, res) => {
    res.json({ message: 'Welcome to the API' })
})
router.use('/employees', employeesRouter)
router.use('/departments', departmentsRouter)
router.use(loginRouter)

export default router
