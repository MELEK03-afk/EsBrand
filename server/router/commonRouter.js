import express from 'express'
import {  addToCart, getCart, updateCartItem, removeFromCart, singUp, singIn, Subscribe } from '../Controls/common/common.js'
import { getProductById, getProductCart } from '../Controls/admin/admin.js'
import { protect } from '../MidelWer/auth.js'

const router=express.Router()

router.post('/SignUp',singUp)
router.post("/SignIn",singIn)
router.get("/Get-product/:id",getProductById)
router.get("/Get-ProductCart",getProductCart)
router.post('/Subscribe',Subscribe)
// Cart routes
router.post('/AddToCart', protect, addToCart)
router.get('/GetProductCart/:userId', protect, getCart)
router.put('/cart-update', protect, updateCartItem)
router.delete('/DeletePrdCart', protect, removeFromCart)

export default router