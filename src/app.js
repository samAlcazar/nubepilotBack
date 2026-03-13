import express from 'express'
import cors from 'cors'
import eventsRouter from './routes/events.js'
import tiendanubeRouter from './routes/tiendanube.js'

const app = express()

app.use(cors({
  origin: ['http://localhost:5173', 'https://saalcazar2.mitiendanube.com/', 'https://nubepilot.vercel.app/'],
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
