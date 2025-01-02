import { Router } from 'express'
import usersRouter from './users/users.routes'
import onboardingRouter from './onboarding/onboarding.routes'
import departmentsRouter from './departments/departments.routes'
import { ValidateAdminsApi, ValidateRole } from '../auth/authValidator'
import dashboardRoutes from './dashboard/dashboard.routes'
import { UserRoleEnum } from '../db/schema/users.schema'
import resetPassRouter from './onboarding/resetPass/resetPass.routes'

export const routes = {
    onboarding: {
        path: '/',
        router: onboardingRouter,
        subRoutes: {
            login: '/login'
        },
        healthcheck: '/healthcheck'
    },
    resetPassword: {
        path: '/resetPassword',
        router: resetPassRouter,
        subRoutes: {
            generateOtp: '/generateOtp'
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

router.get(routes.onboarding.healthcheck, (req, res) => {
    res.json({ message: 'Service is healthy' })
})
router.get('/', (req, res) => {
    res.json({ message: 'Welcome to the API' })
})
router.use(routes.users.path, ValidateAdminsApi, routes.users.router)
router.use(routes.departments.path, ValidateRole([UserRoleEnum.SUPER_ADMIN]), routes.departments.router)
router.use(routes.dashboard.path, ValidateAdminsApi, routes.dashboard.router)
router.use(routes.onboarding.path, routes.onboarding.router)
router.use(routes.resetPassword.path, routes.resetPassword.router)

export default router
