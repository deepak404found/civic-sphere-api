import app from './app'
import { db } from './conn'
import { hashPassword } from './controllers/users'
import { migration } from './db/migration'
import { departmentsTable, IAddDepartment, insertDepartmentSchema } from './db/schema/departments.schema'
import { IAddUser, usersTable } from './db/schema/users.schema'
import { vars } from './env'
import { logger } from './helpers/logger'
import swaggerDocs from './helpers/swagger'

const createSuperAdmin = async () => {
    try {
        const superAdmin = {
            role: 'super_admin',
            department: 'chips-cg',
            pass: 'Admin@12345',
            full_name: 'Super admin',
            email: 'admin@mail.com',
            phone: '1234567890',
            district_id: 1,
            district_name_en: 'district',
            district_name_hi: 'जिला'
        }

        const department: IAddDepartment = {
            name: 'chips-cg',
            city: 'raipur',
            state: 'chhattisgarh',
            email: 'cg@mail.com'
        }

        // check if super admin exists
        const superAdminExists = await db.query.usersTable.findFirst({
            where: (users, { eq }) => eq(users.email, superAdmin.email)
        })

        if (superAdminExists) {
            logger.info('Super admin already exists')
            logger.debug('Super admin credentials:', superAdmin)
            return
        }

        let deptId: string

        // create department if not exists
        const checkDepartmentQuery = await db.query.departmentsTable.findFirst({
            where: (departments, { eq }) => eq(departments.name, department.name)
        })

        if (!checkDepartmentQuery) {
            const newDept = await db
                .insert(departmentsTable)
                .values(department)
                .returning({
                    id: departmentsTable.id
                })
                .execute()

            deptId = newDept[0].id
        } else {
            deptId = checkDepartmentQuery.id
        }

        // create super admin
        await db
            .insert(usersTable)
            .values({
                ...superAdmin,
                department: deptId,
                pass: await hashPassword(superAdmin.pass)
            })
            .execute()

        logger.info('Super admin created')
        logger.debug('Super admin credentials:', superAdmin)
        return
    } catch (error) {
        logger.error('Error creating super admin', error)
    }
}

async function main() {
    console.log('Starting server..')

    await migration()

    // create a super admin user
    await createSuperAdmin()

    app.listen(vars.PORT, () => {
        logger.info(`Server running on: http://localhost:${vars.PORT} 🚀`)

        swaggerDocs(app, vars.PORT)
    }).on('error', (err) => {
        logger.error('Error starting server', err)
        process.exit(1)
    })
}

main()
