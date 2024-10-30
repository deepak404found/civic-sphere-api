import app from './app'
import { vars } from './env'
import { pgClient } from './conn'

async function main() {
    console.log('Starting server...')

    pgClient
        .connect()
        .then(() => {
            console.log('Connected to PostgreSQL database')
            app.listen(vars.PROT, () => {
                console.log(`Server running on: http://localhost:${vars.PROT} 🚀`)
            }).on('error', (err) => {
                console.error(err)
                process.exit(1)
            })
        })
        .catch((err) => {
            console.error('Error connecting to PostgreSQL database', err)
        })
}

main()
