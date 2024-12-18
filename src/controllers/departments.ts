import { db } from '../conn'
import { departmentSchema } from '../db/schema/departments.schema'
import { NotFoundError } from '../helpers/errorHandler'

/**
 * Fetch a department by name
 *
 * @param name - The name of the department
 *
 * @returns The department data
 */
export const fetchDepartmentByName = async (name: string) => {
    const department = await db.query.departments.findFirst({
        where: (departments, { eq }) => eq(departments.name, name)
    })

    if (!department) throw new NotFoundError('Department not found')

    return departmentSchema.parse(department)
}

/**
 * Fetch a department by id
 *
 * @param id - The id of the department
 *
 * @returns The department data
 */
export const fetchDepartmentById = async (id: string) => {
    const department = await db.query.departments.findFirst({
        where: (departments, { eq }) => eq(departments.id, id)
    })

    if (!department) throw new NotFoundError('Department not found')

    return departmentSchema.parse(department)
}
