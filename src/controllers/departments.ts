import { db } from '../conn'
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

    return department
}
