import express from 'express'
import { protect } from '../MidelWer/auth.js'
import {  AddCategory, AddProduct, AddSubcategory, deleSubCategory, deleteProduct, getCategory, getProduct, getProductById, getProductCart, getSubCategory, Messages, UpdateProduct } from '../Controls/admin/admin.js'
import upload from '../MidelWer/multer.js'

const router=express.Router()

router.post('/Add-category',protect,upload.array('images',5),AddCategory)
router.get('/Get-category',getCategory)
router.get('/Get-Subcategory/:id',getSubCategory)
router.post('/Add-CategorySub',protect,upload.single('images'),AddSubcategory)
router.get('/getMessage',protect,Messages)

router.post("/Add-Product",protect,upload.any(),AddProduct)
router.delete('/Delete-Product/:id',protect,deleteProduct)
router.get("/Get-products",getProduct)
router.get("/Get-product/:id",getProductById)
router.put('/UpdateProduct/:id',protect,upload.any(),UpdateProduct)
router.delete('/Delete-SubCategory/:id',protect,deleSubCategory)
export default router