export const TIENDANUBE_CONFIG = {
  STORE_ID: '7390235',
  BASE_URL: 'https://api.tiendanube.com',
  ACCESS_TOKEN: 'bcc9ea59470b011b72fcaf1ae1b9dad0c9b91c03',
  USER_AGENT: 'NubePilot (nubepilot@hackathon.com)'
}

export const API_HEADERS = {
  'Authentication': `bearer ${TIENDANUBE_CONFIG.ACCESS_TOKEN}`,
  'Content-Type': 'application/json',
  'User-Agent': TIENDANUBE_CONFIG.USER_AGENT
}

export const PORT = process.env.PORT || 3000
