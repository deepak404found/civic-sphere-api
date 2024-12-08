import app from './app'
import { vars } from './env'
import { db, pgClient } from './conn'
import { logger } from './helpers/logger'
import { sql } from 'drizzle-orm'

async function main() {
    console.log('Starting server...')

    app.listen(vars.PROT, () => {
        logger.info(`Server running on: http://localhost:${vars.PROT} 🚀`)
    }).on('error', (err) => {
        logger.error('Error starting server', err)
        process.exit(1)
    })
}

main()
