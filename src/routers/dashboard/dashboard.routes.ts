import { count, eq } from 'drizzle-orm'
import { Router } from 'express'
import { db } from '../../conn'
import { departmentsTable, usersTable } from '../../db/schema'
import { IUser } from '../../db/schema/users.schema'
import { errorHandler } from '../../helpers/errorHandler'

const dashboardRoutes = Router()

dashboardRoutes.get('/summary', async (req, res) => {
    try {
        const localUser = res.locals.user as IUser

        const deptCount = await db
            .select({ count: count() })
            .from(departmentsTable)
            .where(localUser.role !== 'super_admin' ? eq(departmentsTable.id, localUser.department.id) : undefined)
            .execute()
            .then((data) => data[0].count)

        const usersCount = await db
            .select({ count: count() })
            .from(usersTable)
            .where(eq(usersTable.department, localUser.department.id))
            .execute()
            .then((data) => data[0].count)

        res.status(200).json({
            message: 'Dashboard summary fetched',
            payload: {
                totalDepartments: deptCount,
                totalUsers: usersCount
            }
        })
    } catch (error) {
        const toReturn = errorHandler(error)
        res.status(toReturn.code).json({
            message: toReturn.message,
            name: toReturn.name
        })
    }
})

export default dashboardRoutes
