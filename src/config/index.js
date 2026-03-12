import dotenv from 'dotenv'

dotenv.config()

export const config = {
  tiendanube: {
    baseUrl: process.env.TIENDANUBE_BASE_URL || 'https://api.tiendanube.com/v1',
    storeId: process.env.TIENDANUBE_STORE_ID,
    accessToken: process.env.TIENDANUBE_ACCESS_TOKEN,
    userAgent: process.env.TIENDANUBE_USER_AGENT || 'NubePilot (contacto@tudominio.com)'
  },
  tracker: {
    scriptUrl: process.env.TRACKER_SCRIPT_URL || 'https://untrimmed-kirstin-rattiest.ngrok-free.dev/scripts/tracker.js'
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL || 'gpt-4'
  },
  port: process.env.PORT || 3000
}
