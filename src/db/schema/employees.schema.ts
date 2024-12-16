import { pgEnum, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import { z } from 'zod'

export enum UserRoleEnum {
    SUPER_ADMIN = 'super_admin',
    ADMIN = 'admin',
    EMPLOYEE = 'employee'
}

export const employeesTable = pgTable('employees', {
    id: uuid('id').defaultRandom().primaryKey(),
    full_name: varchar('full_name', { length: 30 }),
    email: varchar('email', { length: 255 }).notNull(),
    phone: varchar('phone', { length: 12 }),
    role: varchar('role', { length: 15 }).notNull(),
    department: varchar('department', { length: 30 }).notNull(),
    pass: varchar('pass', { length: 60 }).notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow()
})

/**
 * Schema for inserting employee
 */
export const insertEmployeeSchema = createInsertSchema(employeesTable, {
    full_name: z.string().min(4).max(30).optional(),
    email: z.string().email(),
    phone: z.string().min(10).max(12).optional(),
    role: z.enum([UserRoleEnum.ADMIN, UserRoleEnum.EMPLOYEE]),
    department: z.string(),
    pass: z.string().min(8).max(20)
}).omit({
    createdAt: true
})

export type IAddEmployee = z.infer<typeof insertEmployeeSchema>

export const updateEmployeeSchema = createUpdateSchema(employeesTable, {
    full_name: z.string().min(4).max(30).optional(),
    email: z.string().email().optional(),
    phone: z.string().min(10).max(12).optional(),
    role: z.enum([UserRoleEnum.ADMIN, UserRoleEnum.EMPLOYEE]).optional(),
    department: z.string().optional(),
    pass: z.never().optional()
}).omit({
    createdAt: true
})

export type IUpdateEmployee = z.infer<typeof updateEmployeeSchema>

/**
 * Employee schema without password to be used in response
 */
export const employeeSchema = createSelectSchema(employeesTable).omit({
    pass: true
})

export type IEmployee = z.infer<typeof employeeSchema>
