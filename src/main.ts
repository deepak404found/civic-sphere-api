import app from './app'
import { db } from './conn'
import { hashPassword } from './controllers/employees'
import { departmentsTable } from './db/schema/departments.schema'
import { employeesTable } from './db/schema/employees.schema'
import { vars } from './env'
import { logger } from './helpers/logger'

const createSuperAdmin = async () => {
    try {
        const superAdmin = {
            role: 'super_admin',
            department: 'chips-cg',
            pass: 'admin@12345',
            full_name: 'Super admin',
            email: 'admin@mail.com',
            phone: '1234567890'
        }

        const department = {
            name: 'chips-cg'
        }

        // check if super admin exists
        const superAdminExists = await db.query.employees.findFirst({
            where: (employees, { eq }) => eq(employees.email, superAdmin.email)
        })

        if (superAdminExists) {
            logger.info('Super admin already exists')
            return
        }

        // create department
        const dept = await db
            .insert(departmentsTable)
            .values(department)
            .returning({
                id: departmentsTable.id
            })
            .execute()

        // create super admin
        await db
            .insert(employeesTable)
            .values({
                ...superAdmin,
                department: dept[0].id,
                pass: await hashPassword(superAdmin.pass)
            })
            .execute()

        logger.info('Super admin created')
        return
    } catch (error) {
        logger.error('Error creating super admin', error)
    }
}

async function main() {
    console.log('Starting server...')

    // create a super admin user
    await createSuperAdmin()

    app.listen(vars.PORT, () => {
        logger.info(`Server running on: http://localhost:${vars.PORT} 🚀`)
    }).on('error', (err) => {
        logger.error('Error starting server', err)
        process.exit(1)
    })
}

main()
