import bcrypt from 'bcrypt'
import { db } from '../conn'
import { Userschema, usersTable, IAddUser, IUser } from '../db/schema/users.schema'
import { NotFoundError, UnauthorizedError } from '../helpers/errorHandler'
import { fetchDepartmentById, fetchDepartmentByName } from './departments'

// Hash password utility
export async function hashPassword(password: string): Promise<string> {
    const saltRounds = 10
    return bcrypt.hash(password, saltRounds)
}

// verify password utility
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
}

/**
 * Insert an user into the database
 *
 * @param data - The user data to insert {@link IAddUser}
 *
 * @returns The inserted user data {@link IUser}
 */
export async function insertUser(data: IAddUser, localUser: IUser): Promise<IUser | Error> {
    // Hash the password before inserting
    const hashedPassword = await hashPassword(data.pass)

    // Fetch the department id
    const department = await fetchDepartmentById(data.department)

    // Check if the user is not super admin and the department is not the same
    if (localUser.role !== 'super_admin' && localUser.department.id !== department.id) {
        return new UnauthorizedError('Not allowed to access this department')
    }

    // Insert into the database with the hashed password and return the result
    const user = (await db
        .insert(usersTable)
        .values({ ...data, pass: hashedPassword, department: department.id })
        .returning()
        .then(async (result) => {
            return db.query.usersTable.findFirst({
                where: (users, { eq }) => eq(users.id, result[0].id),
                with: {
                    department: true
                }
            })
        })
        .catch((err) => {
            console.error(err)
            throw new Error('Error inserting user')
        })) as unknown as IUser
    // console.log('user', user)

    return Userschema.parse(user)
}

/**
 * Fetch an user by email
 *
 * @param email - The email of the user
 *
 * @returns The user data with the department name
 */
export const fetchUserByEmail = async (email: string) => {
    const user = await db.query.usersTable.findFirst({
        where: (users, { eq }) => eq(users.email, email),
        with: {
            department: true
        }
    })
    // console.log('user', user)

    if (!user) throw new NotFoundError('User not found')

    // fetch the department name
    const department = await fetchDepartmentById(user.department as string)

    return Userschema.parse({ ...user, department: department.name })
}
