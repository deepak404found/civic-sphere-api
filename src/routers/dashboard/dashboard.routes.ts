import { count, eq } from 'drizzle-orm'
import { Router } from 'express'
import { db } from '../../conn'
import { departmentsTable, usersTable } from '../../db/schema'
import { IUser } from '../../db/schema/users.schema'

const dashboardRoutes = Router()

dashboardRoutes.get('/summary', async (req, res) => {
    try {
        const localUser = res.locals.user as IUser

        // query to get the department count based on the user role
        const qyery = localUser.role !== 'super_admin' ? eq(departmentsTable.id, localUser.department.id) : undefined

        const deptCount = await db
            .select({ count: count() })
            .from(departmentsTable)
            .where(qyery)
            .execute()
            .then((data) => data[0].count)

        const usersCount = await db
            .select({ count: count() })
            .from(usersTable)
            .where(qyery)
            .execute()
            .then((data) => data[0].count)

        res.status(200).json({
            message: 'Dashboard summary fetched',
            payload: {
                totalDepartments: deptCount,
                totalusers: usersCount
            }
        })
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            name: 'InternalServerError'
        })
    }
})

export default dashboardRoutes
