export const TIENDANUBE_CONFIG = {
  STORE_ID: '7390235',
  BASE_URL: 'https://api.tiendanube.com',
  ACCESS_TOKEN: '7a588eb8f36969a2aa12ec28f2d7ede53b227225',
  USER_AGENT: 'NubePilot (nubepilot@hackathon.com)'
}

export const API_HEADERS = {
  'Authentication': `bearer ${TIENDANUBE_CONFIG.ACCESS_TOKEN}`,
  'Content-Type': 'application/json',
  'User-Agent': TIENDANUBE_CONFIG.USER_AGENT
}

export const PORT = process.env.PORT || 3000
