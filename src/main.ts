import app from './app'
import { vars } from './env'
import { pgClient } from './conn'
import { logger } from './helpers/logger'

async function main() {
    console.log('Starting server...')

    pgClient
        .connect()
        .then(() => {
            console.log('Connected to PostgreSQL database')
            app.listen(vars.PROT, () => {
                logger.info(`Server running on: http://localhost:${vars.PROT} 🚀`)
            }).on('error', (err) => {
                logger.error('Error starting server', err)
                process.exit(1)
            })
        })
        .catch((err) => {
            logger.error('Error connecting to PostgreSQL database', err)
        })
}

main()
