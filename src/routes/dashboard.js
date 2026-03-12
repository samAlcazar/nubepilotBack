import { Router } from 'express'
import { dashboardController } from '../controllers/dashboardController.js'

const router = Router()

router.get('/data', dashboardController.getDashboardData)
router.get('/recommendations', dashboardController.getRecommendations)
router.get('/products', dashboardController.getProducts)
router.get('/orders', dashboardController.getOrders)
router.post('/track-product-view', dashboardController.trackProductView)
router.get('/product-views', dashboardController.getProductViews)

export default router
