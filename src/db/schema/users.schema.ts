import { integer, numeric, pgEnum, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import { z } from 'zod'
import { departmentSchema, departmentsTable } from './departments.schema'
import { relations } from 'drizzle-orm'

export enum UserRoleEnum {
    SUPER_ADMIN = 'super_admin',
    ADMIN = 'admin',
    User = 'user'
}

export const usersTable = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey(),
    role: varchar('role', { length: 15 }).notNull(),
    department: uuid('department').references(() => departmentsTable.id, {
        onDelete: 'cascade'
    }),
    district_id: integer('district_id').notNull().unique(),
    district_name_en: varchar('district_name_en', { length: 100 }).notNull(),
    district_name_hi: varchar('district_name_hi', { length: 100 }).notNull(),
    pass: varchar('pass', { length: 60 }).notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    full_name: varchar('full_name', { length: 30 }),
    email: varchar('email', { length: 255 }).unique(),
    phone: varchar('phone', { length: 12 }),
    updatedAt: timestamp('updated_at').$onUpdate(() => new Date())
})

export const usersDepartmentRelation = relations(usersTable, ({ one }) => ({
    department: one(departmentsTable, {
        fields: [usersTable.department],
        references: [departmentsTable.id]
    })
}))

/**
 * Schema for inserting user
 */
export const insertuserschema = createInsertSchema(usersTable, {
    full_name: z.string().min(4).max(30).optional(),
    email: z.string().email().optional(),
    phone: z.string().min(10).max(12).optional(),
    role: z.enum([UserRoleEnum.ADMIN, UserRoleEnum.User]),
    department: z.string(),
    pass: z.string().min(8).max(20),
    district_id: z.coerce.number().int(),
    district_name_en: z.string().min(4).max(100),
    district_name_hi: z.string().min(4).max(100)
}).omit({
    createdAt: true,
    updatedAt: true,
    id: true
})

export type IAddUser = z.infer<typeof insertuserschema>

export const updateuserschema = createUpdateSchema(usersTable, {
    full_name: z.string().min(4).max(30).optional(),
    email: z.string().email().optional(),
    phone: z.string().min(10).max(12).optional(),
    role: z.enum([UserRoleEnum.ADMIN, UserRoleEnum.User]).optional(),
    department: z.string().optional(),
    pass: z.never().optional(),
    district_id: z.coerce.number().int().optional(),
    district_name_en: z.string().min(4).max(100).optional(),
    district_name_hi: z.string().min(4).max(100).optional()
}).omit({
    createdAt: true,
    updatedAt: true,
    id: true
})

export type IUpdateUser = z.infer<typeof updateuserschema>

/**
 * User schema without password to be used in response
 */
export const userschema = createSelectSchema(usersTable)
    .omit({
        pass: true
    })
    .extend({
        department: departmentSchema
    })

export type IUser = z.infer<typeof userschema>
