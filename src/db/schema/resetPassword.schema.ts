import { boolean, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'
import { usersTable } from './users.schema'
import { relations } from 'drizzle-orm'
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import { z } from 'zod'

export const resetPasswordTable = pgTable('reset_password', {
    id: uuid('id').defaultRandom().primaryKey(),
    user: uuid('user')
        .notNull()
        .references(() => usersTable.id, {
            onDelete: 'cascade'
        }),
    otp: varchar('otp', { length: 60 }).notNull().unique(),
    verified: boolean('verified').notNull().default(false),
    createdAt: timestamp('created_at').notNull().defaultNow()
})

export const resetPassUserRelation = relations(resetPasswordTable, ({ one }) => ({
    user: one(usersTable, {
        fields: [resetPasswordTable.user],
        references: [usersTable.id]
    })
}))

/**
 * Schema for inserting reset password
 */
export const insertResetPasswordSchema = createInsertSchema(resetPasswordTable, {
    user: z.string(),
    otp: z.string().length(6),
    verified: z.boolean().default(false)
}).omit({
    createdAt: true,
    id: true
})

export type IAddResetPassword = z.infer<typeof insertResetPasswordSchema>

export const updateResetPasswordSchema = createUpdateSchema(resetPasswordTable, {
    verified: z.boolean().optional()
}).omit({
    createdAt: true,
    id: true,
    otp: true,
    user: true
})

export type IUpdateResetPassword = z.infer<typeof updateResetPasswordSchema>

export const selectResetPasswordSchema = createSelectSchema(resetPasswordTable)

export type IResetPassword = z.infer<typeof selectResetPasswordSchema>
