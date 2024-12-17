import { Router } from 'express'
import employeesRouter from './employees'
import loginRouter from './onboarding/login'
import departmentsRouter from './departments'

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
