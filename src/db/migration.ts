import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { db } from '../conn'
import { logger } from '../helpers/logger'
import { sql } from 'drizzle-orm'

export async function migration() {
    try {
        // // Drop the PostGIS extension if needed
        // const dropExtension = true // Set to true if you need to drop PostGIS

        // if (dropExtension) {
        //     logger.info('Dropping PostGIS extension...')
        //     await db.execute(sql`DROP EXTENSION IF EXISTS postgis CASCADE;`)
        //     logger.info('PostGIS extension dropped successfully.')
        // }

        // Run migrations
        await migrate(db, {
            migrationsFolder: './drizzle'
        })

        // Create the PostGIS extension if it doesn't exist
        // await db.execute(sql`CREATE EXTENSION IF NOT EXISTS postgis;`)

        logger.info('Migration completed successfully')
    } catch (error) {
        logger.error('Migration failed:', error)
        throw error
    }
}
