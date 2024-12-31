import { Router } from 'express'
import { RoleAny, ValidateRole } from '../../auth/authValidator'
import { db } from '../../conn'
import { insertUser } from '../../controllers/users'
import {
    userschema,
    usersTable,
    IAddUser,
    insertuserschema,
    IUpdateUser,
    updateuserschema,
    UserRoleEnum,
    IUser
} from '../../db/schema/users.schema'
import { BadRequestError, errorHandler, NotFoundError } from '../../helpers/errorHandler'
import { ListQueryParamsType, validateListQueryParams, validateRequestBody } from '../../helpers/zodValidator'
import { count, eq } from 'drizzle-orm'
import { fetchDepartmentById, fetchDepartmentByName } from '../../controllers/departments'

const usersRouter = Router()

usersRouter.get('/', RoleAny, validateListQueryParams, async (req, res) => {
    try {
        const { skip, limit, search, sortBy, sortOrder } = req.query as unknown as ListQueryParamsType
        const sortByColumn = sortBy ? sortBy : 'createdAt'
        const localUser = res.locals.user as IUser

        // query to get users only from the same department if not super admin
        const query = (users, { eq, and }) =>
            and(
                localUser.role !== UserRoleEnum.SUPER_ADMIN ? eq(users.department, localUser.department.id) : undefined,
                search ? eq(users.full_name, search) : undefined
            )

        const users = await db.query.usersTable.findMany({
            offset: parseInt(skip.toString()),
            limit: parseInt(limit.toString()),
            where: query,
            orderBy: (users, { asc, desc }) => {
                if (sortOrder === 'asc') {
                    return asc(users[sortByColumn])
                } else {
                    return desc(users[sortByColumn])
                }
            },
            with: {
                department: true
            }
        })

        res.status(200).json({
            message: 'users fetched',
            payload: {
                users: users.map((user) => userschema.parse(user)),
                total: await db.query.usersTable
                    .findMany({
                        where: query
                    })
                    .then((data) => data.length)
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

usersRouter.get('/:uid', RoleAny, async (req, res) => {
    try {
        const { uid } = req.params
        // console.log('uid', uid)

        const localUser = res.locals.user as IUser

        // check if the user is from the same department if not super admin
        const user = await db.query.usersTable.findFirst({
            where: (users, { eq, and }) =>
                and(
                    eq(users.id, uid),
                    localUser.role !== UserRoleEnum.SUPER_ADMIN ? eq(users.department, localUser.department.id) : undefined
                ),
            with: {
                department: true
            }
        })

        if (!user) throw new BadRequestError('User not found')

        res.status(200).json({
            message: 'User fetched successfully',
            payload: userschema.parse(user)
        })
    } catch (error) {
        const toReturn = errorHandler(error)
        res.status(toReturn.code).json({
            message: toReturn.message,
            name: toReturn.name
        })
    }
})

usersRouter.put(
    '/add',
    ValidateRole([UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ADMIN]),
    validateRequestBody(insertuserschema),
    async (req, res) => {
        try {
            const newUser = req.body as IAddUser
            const localUser = res.locals.user as IUser

            // check if user already exists by district name
            const checkUserQuery = await db.query.usersTable.findFirst({
                where: (users, { eq }) => eq(users.district_name_en, newUser.district_name_en)
            })
            if (checkUserQuery) throw new BadRequestError('User already exists with this district name')

            // check if user already exists by email
            if (newUser?.email) {
                const checkUserQuery = await db.query.usersTable.findFirst({
                    where: (users, { eq }) => eq(users.email, newUser.email as string),
                    with: {
                        department: true
                    }
                })
                if (checkUserQuery) throw new BadRequestError('User already exists with this email')
            }

            const result = await insertUser(newUser, localUser)

            // if the result is an error throw it
            if (result! instanceof Error) throw result

            res.status(200).json({
                message: 'added user',
                payload: result
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

usersRouter.delete('/:uid', ValidateRole([UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ADMIN]), async (req, res) => {
    try {
        const { uid } = req.params
        const localUser = res.locals.user as IUser

        const user = await db.query.usersTable.findFirst({
            where: (users, { eq, and }) =>
                and(
                    eq(users.id, uid),
                    // check if the user is from the same department if not super admin
                    localUser.role !== UserRoleEnum.SUPER_ADMIN ? eq(users.department, localUser.department.id) : undefined
                ),
            with: {
                department: true
            }
        })

        if (!user) throw new NotFoundError('User not found')

        const result = await db.delete(usersTable).where(eq(usersTable.id, uid)).returning()

        if (!result) throw new NotFoundError('User is not deleted')

        res.status(200).json({
            message: 'User deleted successfully',
            payload: userschema.parse(user)
        })
    } catch (err) {
        const toReturn = errorHandler(err)
        res.status(toReturn.code).json({
            message: toReturn.message,
            name: toReturn.name
        })
    }
})

// update user
usersRouter.patch(
    '/:uid',
    ValidateRole([UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ADMIN]),
    validateRequestBody(updateuserschema),
    async (req, res) => {
        try {
            const { uid } = req.params
            const updatedUser = req.body as IUpdateUser
            const localUser = res.locals.user as IUser

            // fetch the user
            const user = await db.query.usersTable.findFirst({
                where: (users, { eq, and }) =>
                    and(
                        eq(users.id, uid),
                        // check if the user is from the same department if not super admin
                        localUser.role !== UserRoleEnum.SUPER_ADMIN ? eq(users.department, localUser.department.id) : undefined
                    ),
                with: {
                    department: true
                }
            })

            if (!user) throw new NotFoundError('User not found')

            if (
                Object.keys(updatedUser).every((key) => {
                    // check department by id
                    if (key === 'department') {
                        if (updatedUser.department) {
                            if (typeof updatedUser.department === 'string') {
                                return user?.department?.id === updatedUser.department
                            } else {
                                return user?.department?.id === updatedUser.department
                            }
                        } else {
                            return true
                        }
                    }

                    return user[key] === updatedUser[key]
                })
            ) {
                return res.status(200).json({
                    message: 'User updated successfully',
                    payload: userschema.parse(user)
                }) as any
            }

            // check if user already exists by email if email is being updated
            if (updatedUser.email) {
                const checkUserQuery = await db.query.usersTable.findFirst({
                    where: (users, { eq, and, not }) => and(eq(users.email, updatedUser.email as string), not(eq(users.id, uid)))
                })
                if (checkUserQuery) throw new BadRequestError('This email is already in use')
            }

            // check if user already exists by district name if district name is being updated
            if (updatedUser.district_name_en) {
                const checkUserQuery = await db.query.usersTable.findFirst({
                    where: (users, { eq, and, not }) =>
                        and(eq(users.district_name_en, updatedUser.district_name_en as string), not(eq(users.id, uid)))
                })
                if (checkUserQuery) throw new BadRequestError('This district name is already in use')
            }

            // check if department exists
            await fetchDepartmentById(updatedUser?.department as string)

            const result = await db
                .update(usersTable)
                .set(updatedUser)
                .where(eq(usersTable.id, uid))
                .returning()
                .then(async (result) => {
                    return db.query.usersTable.findFirst({
                        where: (users, { eq }) => eq(users.id, result[0].id),
                        with: {
                            department: true
                        }
                    })
                })

            res.status(200).json({
                message: 'User updated successfully',
                payload: userschema.parse(result)
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

export default usersRouter
