/* eslint-disable camelcase */
import { tiendanubeService } from '../services/tiendanube.js'
import { openaiService } from '../services/openai.js'

const productViews = []

export const dashboardController = {
  async injectTrackerScript (req, res) {
    try {
      const result = await tiendanubeService.injectTrackerScript()
      res.json({ success: true, data: result })
    } catch (error) {
      console.error('Error injecting tracker script:', error.response?.data || error.message)
      res.status(error.response?.status || 500).json({
        error: 'Failed to inject tracker script',
        details: error.response?.data || null
      })
    }
  },

  async getDashboardData (req, res) {
    try {
      const { startDate, endDate } = req.query

      const [products, orders, views] = await Promise.all([
        tiendanubeService.getProducts(),
        tiendanubeService.getOrders({ created_at_min: startDate, created_at_max: endDate }),
        Promise.resolve([...productViews])
      ])

      res.json({
        products,
        orders,
        productViews: views
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      res.status(500).json({ error: 'Failed to fetch dashboard data' })
    }
  },

  async getRecommendations (req, res) {
    try {
      const { startDate, endDate } = req.query

      const [products, orders, views] = await Promise.all([
        tiendanubeService.getProducts(),
        tiendanubeService.getOrders({ created_at_min: startDate, created_at_max: endDate }),
        Promise.resolve([...productViews])
      ])

      const storeData = { products, orders, productViews: views }
      const recommendations = await openaiService.generateRecommendations(storeData)

      res.json({ recommendations: JSON.parse(recommendations) })
    } catch (error) {
      console.error('Error generating recommendations:', error)
      res.status(500).json({ error: 'Failed to generate recommendations' })
    }
  },

  async getProducts (req, res) {
    try {
      const products = await tiendanubeService.getProducts()
      res.json(products)
    } catch (error) {
      console.error('Error fetching products:', error)
      res.status(500).json({ error: 'Failed to fetch products' })
    }
  },

  async getOrders (req, res) {
    try {
      const { startDate, endDate } = req.query
      const orders = await tiendanubeService.getOrders({
        created_at_min: startDate,
        created_at_max: endDate
      })
      res.json(orders)
    } catch (error) {
      console.error('Error fetching orders:', error)
      res.status(500).json({ error: 'Failed to fetch orders' })
    }
  },

  async trackProductView (req, res) {
    try {
      const { store_id, product_id, product_name, timestamp, url } = req.body

      if (!store_id || !product_id) {
        return res.status(400).json({ error: 'store_id and product_id are required' })
      }

      const productView = {
        id: Date.now(),
        store_id,
        product_id,
        product_name: product_name || null,
        timestamp: timestamp || new Date().toISOString(),
        url: url || null
      }

      productViews.push(productView)
      console.log('Product view tracked:', productView)

      res.json({ success: true, data: productView })
    } catch (error) {
      console.error('Error tracking product view:', error)
      res.status(500).json({ error: 'Failed to track product view' })
    }
  },

  async getProductViews (req, res) {
    try {
      const { store_id, product_id } = req.query

      let filtered = [...productViews]

      if (store_id) {
        filtered = filtered.filter(v => v.store_id === store_id)
      }

      if (product_id) {
        filtered = filtered.filter(v => v.product_id === product_id)
      }

      res.json(filtered)
    } catch (error) {
      console.error('Error getting product views:', error)
      res.status(500).json({ error: 'Failed to get product views' })
    }
  }
}
