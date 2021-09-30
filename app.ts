import express from 'express'
import mongoose from 'mongoose'
import config from 'config'
import cors from 'cors';
import cookieParser from 'cookie-parser'
import FuelStationRouter from './routes/fuelstation.routes'
import UserRouter from './routes/auth.routes';
import errorMiddleware from './middlewares/auth.middleware';

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use('/api', FuelStationRouter, UserRouter)
app.use(errorMiddleware)

async function start() {
    try {
        mongoose.connect(config.get('mongoURI'))
        console.log('Connected to DB')

        const PORT = config.get('port')
        app.listen(PORT, () => {
            console.log(`On port ${PORT}...`)
        })

    } catch (e) {
        console.error(e)
        process.exit(1)
    }
}

start()