import { productViews, groupEventsByProductId, productMetrics, updateProductMetrics, getProductMetrics } from '../utils/analytics.js'
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
  },
  saveProductMetrics: (req, res, next) => {
    try {
      const { product_id, views, purchases } = req.body
      const metrics = updateProductMetrics(product_id, { views, purchases })
      res.json(metrics)
    } catch (error) {
      next(error)
    }
  },
  getProductMetrics: (req, res, next) => {
    try {
      res.json(getProductMetrics())
    } catch (error) {
      next(error)
    }
  },
  getDiscountRecommendations: (req, res, next) => {
    try {
      const metrics = getProductMetrics()
      const recommendations = metrics
        .filter(m => m.purchases > m.views && (m.purchases - m.views) >= 100)
        .map(m => ({
          product_id: m.product_id,
          message: 'Te recomendamos que hagas un descuento por el 10% del precio'
        }))
      res.json(recommendations)
    } catch (error) {
      next(error)
    }
  },
  applyDiscount: async (req, res, next) => {
    try {
      const { product_id, discount_percentage } = req.body

      const product = await tiendanubeService.products.getById(product_id)
      const variant = product.variants?.[0]

      if (!variant) {
        return res.status(404).json({ error: 'Variant not found' })
      }

      const currentPrice = parseFloat(variant.price)
      const discountAmount = currentPrice * (discount_percentage / 100)
      const newPrice = (currentPrice - discountAmount).toFixed(2)

      const updatedVariant = await tiendanubeService.products.updateVariant(
        product_id,
        variant.id,
        { price: newPrice, promotional_price: variant.price }
      )

      res.json({
        message: `Descuento del ${discount_percentage}% aplicado`,
        original_price: variant.price,
        new_price: newPrice,
        variant: updatedVariant
      })
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
    },
    updateVariant: async (req, res, next) => {
      try {
        const { productId, variantId } = req.params
        const variant = await tiendanubeService.products.updateVariant(productId, variantId, req.body)
        res.json(variant)
      } catch (error) {
        next(error)
      }
    }
  },

  categories: {
    getAll: async (req, res, next) => {
      try {
        const categories = await tiendanubeService.categories.getAll()
        res.json(categories)
      } catch (error) {
        next(error)
      }
    },
    getById: async (req, res, next) => {
      try {
        const { id } = req.params
        const category = await tiendanubeService.categories.getById(id)
        res.json(category)
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
