import { z } from 'zod'

export type IEmployee = z.infer<typeof EmployeeSchema>

export type IPartialEmployee = {
    username?: string
    department?: string
}

export enum UserRoleEnum {
    SUPER_ADMIN = 'super_admin',
    ADMIN = 'admin',
    EMPLOYEE = 'employee'
}

export const EmployeeSchema = z.object({
    username: z.string().min(4).max(12),
    pass: z.string().min(8).max(12),
    full_name: z.string().min(4).max(30).optional(),
    email: z.string().email().optional(),
    phone: z.string().min(10).max(12).optional(),
    role: z.nativeEnum(UserRoleEnum),
    department: z.string()
})
