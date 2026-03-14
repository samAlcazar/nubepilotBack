import OpenAI from 'openai'
import { productViews, groupEventsByProductId, productMetrics, updateProductMetrics, getProductMetrics } from '../utils/analytics.js'
import tiendanubeService from '../services/tiendanubeService.js'

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1'
})

const GROQ_MODEL = 'llama-3.3-70b-versatile'

const buildRecommendationsWithFallback = (metrics) => {
  return metrics
    .filter(m => m.views > m.purchases && (m.views - m.purchases) >= 100)
    .map(m => ({
      product_id: m.product_id,
      message: 'Te recomendamos que hagas un descuento por el 10% del precio'
    }))
}

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
  getDiscountRecommendations: async (req, res, next) => {
    try {
      const metrics = getProductMetrics()

      if (metrics.length === 0) {
        return res.json([])
      }

      // Fetch real product data to give AI full context
      let products = []
      try {
        products = await tiendanubeService.products.getAll()
      } catch {
        // If products can't be fetched, proceed with metrics only
      }

      const productMap = products.reduce((acc, p) => {
        acc[String(p.id)] = p
        return acc
      }, {})

      const context = metrics.map(m => {
        const product = productMap[String(m.product_id)]
        const variant = product?.variants?.[0]
        const conversionRate = m.views > 0 ? ((m.purchases / m.views) * 100).toFixed(1) : '0.0'
        return {
          product_id: m.product_id,
          name: product?.name?.es || product?.name?.en || `Producto ${m.product_id}`,
          price: variant?.price || 'desconocido',
          promotional_price: variant?.promotional_price || null,
          views: m.views,
          purchases: m.purchases,
          conversion_rate: `${conversionRate}%`
        }
      })

      const systemPrompt = `Eres un analista de e-commerce experto. 
Analiza los datos de productos y sus métricas de rendimiento y determina cuáles necesitan un descuento para impulsar las ventas.
Responde ÚNICAMENTE con un array JSON válido, sin texto adicional, sin markdown, sin explicaciones fuera del JSON.
Si ningún producto necesita descuento, responde con [].
Formato de cada elemento: {"product_id": <número>, "message": "<recomendación concreta en español, máx 150 caracteres>"}`

      const userPrompt = `Estos son los productos de la tienda con sus métricas actuales:
${JSON.stringify(context, null, 2)}

Recomienda descuentos solo para productos que realmente lo necesiten (por ejemplo, muchas visitas pero pocas compras, baja conversión, o precio elevado vs competencia estimada). Sé específico en cada mensaje de recomendación.`

      let recommendations
      try {
        const completion = await groq.chat.completions.create({
          model: GROQ_MODEL,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.4,
          max_tokens: 1024
        })

        const raw = completion.choices[0]?.message?.content?.trim() || '[]'
        recommendations = JSON.parse(raw)

        if (!Array.isArray(recommendations)) {
          throw new Error('AI response is not an array')
        }
      } catch {
        // Fallback to hardcoded rule if AI fails
        recommendations = buildRecommendationsWithFallback(metrics)
      }

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
        {
          price: variant.price,
          compare_at_price: variant.price,
          promotional_price: newPrice
        }
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
