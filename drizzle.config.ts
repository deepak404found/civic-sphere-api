import { defineConfig } from 'drizzle-kit'
import { vars } from './src/env'

export default defineConfig({
    dialect: 'postgresql', // "mysql" | "sqlite" | "postgresql"
    schema: './src/db/**/*.schema.ts',
    // driver: 'pglite',
    out: './drizzle',
    dbCredentials: {
        user: vars.PG_USER,
        host: vars.PG_HOST,
        database: vars.PG_DATABASE,
        password: vars.PG_PASSWORD,
        port: vars.PG_PORT,
        ssl: vars.PG_SSL
    }
})
