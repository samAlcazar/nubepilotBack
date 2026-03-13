import { Router } from 'express'
import { tiendanubeController } from '../controllers/index.js'

const router = Router()

router.get('/products', tiendanubeController.products.getAll)
router.get('/products/:id', tiendanubeController.products.getById)

router.get('/categories', tiendanubeController.categories.getAll)
router.get('/categories/:id', tiendanubeController.categories.getById)

router.post('/coupons', tiendanubeController.coupons.create)
router.get('/coupons', tiendanubeController.coupons.getAll)
router.get('/coupons/:id', tiendanubeController.coupons.getById)
router.put('/coupons/:id', tiendanubeController.coupons.update)
router.delete('/coupons/:id', tiendanubeController.coupons.delete)

router.post('/discounts', tiendanubeController.discounts.create)
router.get('/discounts', tiendanubeController.discounts.getAll)
router.get('/discounts/:id', tiendanubeController.discounts.getById)
router.put('/discounts/:id', tiendanubeController.discounts.update)
router.delete('/discounts/:id', tiendanubeController.discounts.delete)

router.post('/orders', tiendanubeController.orders.create)
router.get('/orders', tiendanubeController.orders.getAll)
router.get('/orders/:id', tiendanubeController.orders.getById)
router.put('/orders/:id', tiendanubeController.orders.update)
router.delete('/orders/:id', tiendanubeController.orders.delete)

export default router
