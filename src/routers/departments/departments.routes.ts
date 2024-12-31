import { count, eq } from 'drizzle-orm'
import { Router } from 'express'
import { RoleAny, ValidateRole } from '../../auth/authValidator'
import { db } from '../../conn'
import {
    departmentSchema,
    departmentsTable,
    IAddDepartment,
    insertDepartmentSchema,
    IUpdateDepartment,
    updateDepartmentSchema
} from '../../db/schema/departments.schema'
import { IUser, UserRoleEnum } from '../../db/schema/users.schema'
import { BadRequestError, errorHandler, NotFoundError } from '../../helpers/errorHandler'
import { ListQueryParamsType, validateListQueryParams, validateRequestBody } from '../../helpers/zodValidator'

const departmentsRouter = Router()

departmentsRouter.get('/', RoleAny, validateListQueryParams, async (req, res) => {
    try {
        const { skip, limit, search, sortBy, sortOrder } = req.query as unknown as ListQueryParamsType
        const localUser = res.locals.user
        const sortByColumn = sortBy ? sortBy : 'createdAt'

        const departments = await db.query.departmentsTable.findMany({
            offset: skip,
            limit: limit,
            where: (departments, { like, eq, and }) =>
                and(
                    // if user is not super admin, get only the department of the user
                    localUser.role !== UserRoleEnum.SUPER_ADMIN ? eq(departments.id, localUser.department.id) : undefined,
                    search ? like(departments.name, `%${search}%`) : undefined
                ),
            orderBy: (departments, { asc, desc }) => {
                if (sortOrder === 'asc') {
                    return asc(departments[sortByColumn])
                } else {
                    return desc(departments[sortByColumn])
                }
            }
        })

        res.status(200).json({
            message: 'Departments fetched successfully',
            payload: {
                departments: departments.map((department) => departmentSchema.parse(department)),
                total: await db
                    .select({ count: count() })
                    .from(departmentsTable)
                    .execute()
                    .then((data) => data[0].count)
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

departmentsRouter.get('/:id', RoleAny, async (req, res) => {
    try {
        const { id } = req.params
        const localUser = res.locals.user

        const department = await db.query.departmentsTable.findFirst({
            where: (departments, { eq, and }) =>
                and(
                    eq(departments.id, id),
                    // if user is not super admin, get only the department of the user
                    localUser.role !== UserRoleEnum.SUPER_ADMIN ? eq(departments.id, localUser.department.id) : undefined
                )
        })

        if (!department) throw new NotFoundError('Department not found')

        res.status(200).json({
            message: 'Department fetched successfully',
            payload: departmentSchema.parse(department)
        })
    } catch (error) {
        const toReturn = errorHandler(error)
        res.status(toReturn.code).json({
            message: toReturn.message,
            name: toReturn.name
        })
    }
})

departmentsRouter.put('/add', ValidateRole([UserRoleEnum.SUPER_ADMIN]), validateRequestBody(insertDepartmentSchema), async (req, res) => {
    try {
        const newDepartment = req.body as IAddDepartment

        // check if department already exists by name
        const checkDepartmentQuery = await db.query.departmentsTable.findFirst({
            where: (departments, { eq }) => eq(departments.name, newDepartment.name)
        })

        if (checkDepartmentQuery) throw new BadRequestError('Department already exists')

        const result = await db.insert(departmentsTable).values(newDepartment).returning()
        // console.log('result', result)

        res.status(200).json({
            message: 'Department added successfully',
            payload: result[0]
        })
    } catch (err) {
        const toReturn = errorHandler(err)
        res.status(toReturn.code).json({
            message: toReturn.message,
            name: toReturn.name
        })
    }
})

departmentsRouter.delete('/:id', ValidateRole([UserRoleEnum.SUPER_ADMIN]), async (req, res) => {
    try {
        const { id } = req.params

        const department = await db.query.departmentsTable.findFirst({
            where: (departments, { eq }) => eq(departments.id, id)
        })

        if (!department) throw new NotFoundError('Department not found')

        const result = await db.delete(departmentsTable).where(eq(departmentsTable.id, id)).returning()

        res.status(200).json({
            message: 'Department deleted successfully',
            payload: departmentSchema.parse(result[0])
        })
    } catch (err) {
        const toReturn = errorHandler(err)
        res.status(toReturn.code).json({
            message: toReturn.message,
            name: toReturn.name
        })
    }
})

// update department
departmentsRouter.patch(
    '/:id',
    ValidateRole([UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ADMIN]),
    validateRequestBody(updateDepartmentSchema),
    async (req, res) => {
        try {
            const { id } = req.params
            const updatedDepartment = req.body as IUpdateDepartment
            const localUser = res.locals.user as IUser

            const department = await db.query.departmentsTable.findFirst({
                where: (departments, { eq, and }) =>
                    and(
                        eq(departments.id, id),
                        // if user is not super admin, get only the department of the user
                        localUser.role !== UserRoleEnum.SUPER_ADMIN ? eq(departments.id, localUser.department.id) : undefined
                    )
            })

            if (!department) throw new NotFoundError('Department not found')

            if (
                Object.keys(updatedDepartment).every((key) => {
                    return department[key] === updatedDepartment[key]
                })
            ) {
                return res.status(200).json({
                    message: 'Department updated successfully',
                    payload: departmentSchema.parse(department)
                }) as any
            }

            // check if department already exists by name
            if (updatedDepartment.name) {
                const checkDepartmentQuery = await db.query.departmentsTable.findFirst({
                    where: (departments, { eq, and, not }) =>
                        and(eq(departments.name, updatedDepartment.name as string), not(eq(departments.id, id)))
                })
                if (checkDepartmentQuery) throw new BadRequestError('Department already exists')
            }

            // console.log('updatedDepartment', updatedDepartment)
            const result = await db.update(departmentsTable).set(updatedDepartment).where(eq(departmentsTable.id, id)).returning()
            // console.log('result', result)

            res.status(200).json({
                message: 'Department updated successfully',
                payload: departmentSchema.parse(result[0])
            })
        } catch (err) {
            const toReturn = errorHandler(err)
            res.status(toReturn.code).json({
                message: toReturn.message,
                name: toReturn.name
            })
        }
    }
)

export default departmentsRouter
