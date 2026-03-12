import { tiendanubeClient } from '../config/axios.js'
import { config } from '../config/index.js'

export const tiendanubeService = {
  async getProducts () {
    const response = await tiendanubeClient.get(`/${config.tiendanube.storeId}/products`)
    return response.data
  },

  async injectTrackerScript () {
    const response = await tiendanubeClient.post(`/${config.tiendanube.storeId}/scripts`, {
      src: config.tracker.scriptUrl
    })
    return response.data
  },

  async getOrders (params = {}) {
    try {
      const response = await tiendanubeClient.get(`/${config.tiendanube.storeId}/orders`, { params })
      return response.data
    } catch (error) {
      if (error.response?.status === 404) {
        return []
      }
      throw error
    }
  },

  async getProduct (productId) {
    const response = await tiendanubeClient.get(`/${config.tiendanube.storeId}/products/${productId}`)
    return response.data
  },

  async getOrder (orderId) {
    const response = await tiendanubeClient.get(`/${config.tiendanube.storeId}/orders/${orderId}`)
    return response.data
  }
}
