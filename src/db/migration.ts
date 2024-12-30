import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { db } from '../conn'
import { logger } from '../helpers/logger'

export async function migration() {
    await migrate(db, {
        migrationsFolder: './drizzle'
    })
    logger.info('Migration completed')
}
