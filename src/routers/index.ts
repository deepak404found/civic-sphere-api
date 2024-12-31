import { Router } from 'express'
import usersRouter from './users/users.routes'
import loginRouter from './onboarding/onboarding.routes'
import departmentsRouter from './departments/departments.routes'
import { ValidateAdminsApi } from '../auth/authValidator'
import dashboardRoutes from './dashboard/dashboard.routes'

export const routes = {
    base: {
        path: '/',
        healthcheck: '/healthcheck',
        subRoutes: {
            login: '/login'
        }
    },
    dashboard: {
        path: '/dashboard',
        router: dashboardRoutes,
        subRoutes: {
            summary: '/summary'
        }
    },
    users: {
        path: '/users',
        router: usersRouter,
        subRoutes: {
            getusers: '/',
            addUser: '/add',
            getUser: '/:uid',
            deleteUser: '/:uid',
            updateUser: '/:uid'
        }
    },
    departments: {
        path: '/departments',
        router: departmentsRouter,
        subRoutes: {
            getDepartments: '/',
            addDepartment: '/add',
            getDepartment: '/:uid',
            deleteDepartment: '/:uid',
            updateDepartment: '/:uid'
        }
    }
}

const router = Router()

router.get(routes.base.healthcheck, (req, res) => {
    res.json({ message: 'Service is healthy' })
})
router.get('/', (req, res) => {
    res.json({ message: 'Welcome to the API' })
})
router.use(routes.users.path, ValidateAdminsApi, routes.users.router)
router.use(routes.departments.path, ValidateAdminsApi, routes.departments.router)
router.use(routes.dashboard.path, ValidateAdminsApi, routes.dashboard.router)
router.use(loginRouter)

export default router
