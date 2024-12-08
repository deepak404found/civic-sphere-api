import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core'
import { db } from '../../conn'
import { sql } from 'drizzle-orm'

export const employeesTable = pgTable('employees', {
    id: uuid().defaultRandom().primaryKey(),
    username: varchar({ length: 12 }).notNull(),
    full_name: varchar({ length: 30 }),
    email: varchar({ length: 255 }),
    phone: varchar({ length: 12 }),
    role: varchar({ length: 12 }).notNull(),
    department: varchar({ length: 30 }).notNull(),
    pass: varchar({ length: 60 }).notNull()
})
