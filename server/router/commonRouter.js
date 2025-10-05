import express from 'express'
import {  addToCart, getCart, removeFromCart, singUp, singIn, Subscribe, updateCartItem, getFilters, getProduct, ConfirmSubscribe, ResetEmail, CheckEmail, Newpassword } from '../Controls/common/common.js'
import { getProductById, getProductCart } from '../Controls/admin/admin.js'
import { protect } from '../MidelWer/auth.js'

const router=express.Router()

router.post('/SignUp',singUp)
router.post("/SignIn",singIn)
router.get("/Get-product/:id",getProductById)
router.get("/Get-ProductCart",getProductCart)
router.post('/Subscribe',Subscribe)
router.get('/confirm-subscribe/:token',ConfirmSubscribe )
router.get('/GetProduct',getProduct)
router.post('/ResetEmail',ResetEmail)
router.post('/CheckEmail',CheckEmail)
router.post('/NewPassword',Newpassword)
// Cart routes
router.post('/AddToCart', protect, addToCart)
router.get('/GetProductCart/:userId', protect, getCart)
router.put('/cart-update', updateCartItem)
router.delete('/DeletePrdCart', removeFromCart)
router.get("/filters", getFilters);

export default router