import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { usersTable } from './db/schema/users.schema'
import { vars } from './env'
import { departmentsTable } from './db/schema/departments.schema'
import * as schema from './db/schema/'
import nodemailer from 'nodemailer'

export const pgClient = new Pool({
    user: vars.PG_USER,
    host: vars.PG_HOST,
    database: vars.PG_DATABASE,
    password: vars.PG_PASSWORD,
    port: vars.PG_PORT
})

export const db = drizzle({
    client: pgClient,
    logger: vars.ENABLE_PG_LOG,
    schema
})

export const mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: vars.EMAIL,
        pass: vars.EMAIL_PASS
    },
    logger: vars.NODEMAILER_LOGGER, // Enable logging
    debug: vars.NODEMAILER_DEBUG // Enable debug output
})
