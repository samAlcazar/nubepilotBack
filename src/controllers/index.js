import { productViews, groupEventsByProductId } from '../utils/analytics.js'
import tiendanubeService from '../services/tiendanubeService.js'

export const eventsController = {
  createProductView: (req, res, next) => {
    try {
      const { store_id, product_id, product_name, timestamp, url } = req.body

      const event = {
        id: Date.now(),
        store_id,
        product_id,
        product_name,
        timestamp: timestamp || new Date().toISOString(),
        url
      }

      productViews.push(event)

      res.status(201).json(event)
    } catch (error) {
      next(error)
    }
  }
}

export const analyticsController = {
  getProductViews: (req, res, next) => {
    try {
      const aggregated = groupEventsByProductId(productViews)
      res.json(aggregated)
    } catch (error) {
      next(error)
    }
  }
}

export const tiendanubeController = {
  products: {
    getAll: async (req, res, next) => {
      try {
        const products = await tiendanubeService.products.getAll()
        res.json(products)
      } catch (error) {
        next(error)
      }
    },
    getById: async (req, res, next) => {
      try {
        const { id } = req.params
        const product = await tiendanubeService.products.getById(id)
        res.json(product)
      } catch (error) {
        next(error)
      }
    }
  },

  coupons: {
    create: async (req, res, next) => {
      try {
        const coupon = await tiendanubeService.coupons.create(req.body)
        res.status(201).json(coupon)
      } catch (error) {
        next(error)
      }
    },
    getAll: async (req, res, next) => {
      try {
        const coupons = await tiendanubeService.coupons.getAll()
        res.json(coupons)
      } catch (error) {
        next(error)
      }
    },
    getById: async (req, res, next) => {
      try {
        const { id } = req.params
        const coupon = await tiendanubeService.coupons.getById(id)
        res.json(coupon)
      } catch (error) {
        next(error)
      }
    },
    update: async (req, res, next) => {
      try {
        const { id } = req.params
        const coupon = await tiendanubeService.coupons.update(id, req.body)
        res.json(coupon)
      } catch (error) {
        next(error)
      }
    },
    delete: async (req, res, next) => {
      try {
        const { id } = req.params
        await tiendanubeService.coupons.delete(id)
        res.status(204).send()
      } catch (error) {
        next(error)
      }
    }
  },

  discounts: {
    create: async (req, res, next) => {
      try {
        const discount = await tiendanubeService.discounts.create(req.body)
        res.status(201).json(discount)
      } catch (error) {
        next(error)
      }
    },
    getAll: async (req, res, next) => {
      try {
        const discounts = await tiendanubeService.discounts.getAll()
        res.json(discounts)
      } catch (error) {
        next(error)
      }
    },
    getById: async (req, res, next) => {
      try {
        const { id } = req.params
        const discount = await tiendanubeService.discounts.getById(id)
        res.json(discount)
      } catch (error) {
        next(error)
      }
    },
    update: async (req, res, next) => {
      try {
        const { id } = req.params
        const discount = await tiendanubeService.discounts.update(id, req.body)
        res.json(discount)
      } catch (error) {
        next(error)
      }
    },
    delete: async (req, res, next) => {
      try {
        const { id } = req.params
        await tiendanubeService.discounts.delete(id)
        res.status(204).send()
      } catch (error) {
        next(error)
      }
    }
  },

  orders: {
    create: async (req, res, next) => {
      try {
        const order = await tiendanubeService.orders.create(req.body)
        res.status(201).json(order)
      } catch (error) {
        next(error)
      }
    },
    getAll: async (req, res, next) => {
      try {
        const orders = await tiendanubeService.orders.getAll()
        res.json(orders)
      } catch (error) {
        next(error)
      }
    },
    getById: async (req, res, next) => {
      try {
        const { id } = req.params
        const order = await tiendanubeService.orders.getById(id)
        res.json(order)
      } catch (error) {
        next(error)
      }
    },
    update: async (req, res, next) => {
      try {
        const { id } = req.params
        const order = await tiendanubeService.orders.update(id, req.body)
        res.json(order)
      } catch (error) {
        next(error)
      }
    },
    delete: async (req, res, next) => {
      try {
        const { id } = req.params
        await tiendanubeService.orders.delete(id)
        res.status(204).send()
      } catch (error) {
        next(error)
      }
    }
  }
}
