import express from 'express'
import cors from 'cors'
import eventsRouter from './routes/events.js'
import tiendanubeRouter from './routes/tiendanube.js'

const app = express()

const defaultAllowedOrigins = [
  'http://localhost:5173',
  'https://saalcazar2.mitiendanube.com',
  'https://nubepilot.vercel.app'
]

const envAllowedOrigins = (process.env.CORS_ALLOWED_ORIGINS || '')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean)

const allowedOrigins = new Set([...defaultAllowedOrigins, ...envAllowedOrigins])

app.use(cors({
  origin: (origin, callback) => {
    // Allow same-server and non-browser requests (e.g. curl/Postman).
    if (!origin) {
      return callback(null, true)
    }

    const normalizedOrigin = origin.replace(/\/$/, '')

    if (allowedOrigins.has(normalizedOrigin)) {
      return callback(null, true)
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`))
  },
  credentials: true
}))

app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'NubePilot API', version: '1.0.0' })
})

app.use('/api', eventsRouter)
app.use('/api/tiendanube', tiendanubeRouter)

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  })
})

export default app
