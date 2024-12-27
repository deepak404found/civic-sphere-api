import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import { z } from 'zod'

export const departmentsTable = pgTable('departments', {
    id: uuid('id').defaultRandom().primaryKey(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    name: varchar('name', { length: 30 }),
    email: varchar('email', { length: 255 }),
    city: varchar('city', { length: 30 }),
    state: varchar('state', { length: 30 })
})

/**
 * Schema for inserting department
 */
export const insertDepartmentSchema = createInsertSchema(departmentsTable, {
    name: z.string().min(4).max(30),
    email: z.string().email(),
    city: z.string().min(4).max(30),
    state: z.string().min(4).max(30)
}).omit({
    createdAt: true,
    id: true
})

export type IAddDepartment = z.infer<typeof insertDepartmentSchema>

/**
 * Schema for updating department
 */
export const updateDepartmentSchema = createUpdateSchema(departmentsTable, {
    name: z.string().min(4).max(30).optional(),
    email: z.string().email().optional(),
    city: z.string().max(30).optional(),
    state: z.string().max(30).optional()
}).omit({
    createdAt: true
})

export type IUpdateDepartment = z.infer<typeof updateDepartmentSchema>

/**
 * Department schema
 */
export const departmentSchema = createSelectSchema(departmentsTable)

export type IDepartment = z.infer<typeof departmentSchema>
