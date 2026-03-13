import { Router } from 'express'
import { eventsController, analyticsController } from '../controllers/index.js'

const router = Router()

router.post('/events/product-view', eventsController.createProductView)
router.get('/analytics/product-views', analyticsController.getProductViews)
router.post('/analytics/product-metrics', analyticsController.saveProductMetrics)
router.get('/analytics/product-metrics', analyticsController.getProductMetrics)
router.get('/analytics/discount-recommendations', analyticsController.getDiscountRecommendations)
router.post('/analytics/apply-discount', analyticsController.applyDiscount)

export default router
