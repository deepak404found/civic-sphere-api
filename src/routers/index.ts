import { Router } from 'express'
import employeesRouter from './employees'
import loginRouter from './onboarding/login'

const router = Router()

router.get('/healthcheck', (req, res) => {
    res.json({ message: 'Service is healthy' })
})

router.use('/employees', employeesRouter)
router.use(loginRouter)

export default router
