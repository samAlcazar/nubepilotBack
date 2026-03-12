import express from 'express'
import cors from 'cors'
import dashboardRoutes from './src/routes/dashboard.js'
import { config } from './src/config/index.js'

const app = express()

app.use(cors({
  origin: ['http://localhost:5173', 'https://saalcazar2.mitiendanube.com/'],
  credentials: true
}))

app.use(express.json())

app.use('/api/dashboard', dashboardRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'NubePilot API', version: '1.0.0' })
})

app.listen(config.port, () => {
  console.log(`Servidor en puerto ${config.port}`)
})
