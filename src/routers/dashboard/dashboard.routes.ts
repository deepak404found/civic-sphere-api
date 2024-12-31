import { count } from 'drizzle-orm'
import { Router } from 'express'
import { db } from '../../conn'
import { departmentsTable, usersTable } from '../../db/schema'

const dashboardRoutes = Router()

dashboardRoutes.get('/summary', async (req, res) => {
    try {
        const deptCount = await db
            .select({ count: count() })
            .from(departmentsTable)
            .execute()
            .then((data) => data[0].count)

        const usersCount = await db
            .select({ count: count() })
            .from(usersTable)
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
