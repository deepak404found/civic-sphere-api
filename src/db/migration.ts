import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { db } from '../conn'

export async function main() {
    await migrate(db, {
        migrationsFolder: './drizzle/migrations'
    })
}

main()
