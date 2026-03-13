import express from 'express'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors({
  origin: ['http://localhost:5173', 'https://saalcazar2.mitiendanube.com/', 'https://nubepilot.vercel.app/'],
  credentials: true
}))

app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'NubePilot API', version: '1.0.0' })
})

app.listen(PORT, () => {
  console.log(`Servidor en puerto ${PORT}`)
})
