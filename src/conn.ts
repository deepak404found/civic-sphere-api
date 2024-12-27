import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { employeesTable } from './db/schema/employees.schema'
import { vars } from './env'
import { departmentsTable } from './db/schema/departments.schema'
import * as schema from './db/schema/'

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
