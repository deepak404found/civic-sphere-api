import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import { z } from 'zod'

export const departmentsTable = pgTable('departments', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 30 }).notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow()
})

/**
 * Schema for inserting department
 */
export const insertDepartmentSchema = createInsertSchema(departmentsTable, {
    name: z.string().min(4).max(30)
}).omit({
    createdAt: true
})

export type IAddDepartment = z.infer<typeof insertDepartmentSchema>

/**
 * Schema for updating department
 */
export const updateDepartmentSchema = createUpdateSchema(departmentsTable, {
    name: z.string().min(4).max(30).optional()
}).omit({
    createdAt: true
})

export type IUpdateDepartment = z.infer<typeof updateDepartmentSchema>

/**
 * Department schema
 */
export const departmentSchema = createSelectSchema(departmentsTable)

export type IDepartment = z.infer<typeof departmentSchema>
