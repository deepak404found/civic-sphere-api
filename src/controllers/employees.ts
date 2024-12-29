import bcrypt from 'bcrypt'
import { db } from '../conn'
import { employeeSchema, employeesTable, IAddEmployee, IEmployee } from '../db/schema/employees.schema'
import { NotFoundError } from '../helpers/errorHandler'
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
 * Insert an employee into the database
 *
 * @param data - The employee data to insert {@link IAddEmployee}
 *
 * @returns The inserted employee data {@link IEmployee}
 */
export async function insertEmployee(data: IAddEmployee) {
    // Hash the password before inserting
    const hashedPassword = await hashPassword(data.pass)

    // Fetch the department id
    const department = await fetchDepartmentById(data.department)

    // Insert into the database with the hashed password and return the result
    const employee = (await db
        .insert(employeesTable)
        .values({ ...data, pass: hashedPassword, department: department.id })
        .returning()
        .then(async (result) => {
            return db.query.employeesTable.findFirst({
                where: (employees, { eq }) => eq(employees.id, result[0].id),
                with: {
                    department: true
                }
            })
        })
        .catch((err) => {
            console.error(err)
            throw new Error('Error inserting employee')
        })) as unknown as IEmployee
    console.log('employee', employee)

    return employeeSchema.parse(employee)
}

/**
 * Fetch an employee by email
 *
 * @param email - The email of the employee
 *
 * @returns The employee data with the department name
 */
export const fetchEmployeeByEmail = async (email: string) => {
    const employee = await db.query.employeesTable.findFirst({
        where: (employees, { eq }) => eq(employees.email, email),
        with: {
            department: true
        }
    })
    console.log('employee', employee)

    if (!employee) throw new NotFoundError('Employee not found')

    // fetch the department name
    const department = await fetchDepartmentById(employee.department as string)

    return employeeSchema.parse({ ...employee, department: department.name })
}
