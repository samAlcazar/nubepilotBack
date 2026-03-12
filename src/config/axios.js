import axios from 'axios'

export const tiendanubeClient = axios.create({
  baseURL: 'https://api.tiendanube.com/v1',
  headers: {
    'Content-Type': 'application/json'
  }
})

tiendanubeClient.interceptors.request.use((config) => {
  config.headers.Authentication = `bearer ${process.env.TIENDANUBE_ACCESS_TOKEN}`
  return config
})

export const openaiClient = axios.create({
  baseURL: 'https://api.openai.com/v1',
  headers: {
    'Content-Type': 'application/json'
  }
})

openaiClient.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${process.env.OPENAI_API_KEY}`
  return config
})
