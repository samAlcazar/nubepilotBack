import 'dotenv/config'
import app from './app.js'
import { PORT } from './config/constants.js'

app.listen(PORT, () => {
  console.log(`Servidor en puerto ${PORT}`)
})
