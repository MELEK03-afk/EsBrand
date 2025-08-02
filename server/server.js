import express from 'express'
import colors from 'colors'
import multer from 'multer'
import cors from 'cors'
import connectToMongooset from './config/DBconfig.js'
import commonRouter from './router/commonRouter.js'
import ownerRouter from './router/owenrRouter.js'
import adminRouter from './router/adminRouter.js'
const port = process.env.PORT || 5000
const app = express()

// Connect to database
connectToMongooset()

app.use(express.json())
app.use(cors())
app.use('/uploads', express.static('uploads'));
app.use('/api', commonRouter)
app.use('/api/Owner', ownerRouter)
app.use('/api/Admin', adminRouter)

app.listen(port, () => {
    console.log(`server is running on port ${port}`.blue.underline)
}).on('error', (error) => {
    console.error('Server failed to start:', error)
})