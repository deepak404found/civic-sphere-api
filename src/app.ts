import express from 'express'
import router from './routers'

const app = express()

app.use(express.json())

app.use((err, _, res, __) => {
    if (err instanceof SyntaxError && 'body' in err) {
        return res.status(400).json({
            message: 'Invalid JSON payload passed.',
            name: 'SyntaxError'
        })
    }

    res.status(500).json({
        message: err.message,
        name: err.name
    })
})

app.use(router)

export default app
