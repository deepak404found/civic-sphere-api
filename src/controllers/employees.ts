import bcrypt from 'bcrypt'
import { db } from '../conn'
import { employeeSchema, employeesTable, IAddEmployee } from '../db/schema/employees.schema'

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
 * Insert an employee into the database
 *
 * @param data - The employee data to insert {@link IAddEmployee}
 *
 * @returns The inserted employee data {@link IEmployee}
 */
export async function insertEmployee(data: IAddEmployee) {
    // Hash the password before inserting
    const hashedPassword = await hashPassword(data.pass)

    // Insert into the database with the hashed password and return the result
    const employee = await db
        .insert(employeesTable)
        .values({ ...data, pass: hashedPassword })
        .returning()
        .catch((err) => {
            console.error(err)
            throw new Error('Error inserting employee')
        })

    return employeeSchema.parse(employee[0])
}
