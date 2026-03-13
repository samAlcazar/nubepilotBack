import { Router } from 'express'
import { eventsController, analyticsController } from '../controllers/index.js'

const router = Router()

router.post('/events/product-view', eventsController.createProductView)
router.get('/analytics/product-views', analyticsController.getProductViews)

export default router
