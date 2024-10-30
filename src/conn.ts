import { Client } from 'pg'
import { vars } from './env'

export const pgClient = new Client({
    user: vars.PG_USER,
    host: vars.PG_HOST,
    database: vars.PG_DATABASE,
    password: vars.PG_PASSWORD,
    port: vars.PG_PORT
})
