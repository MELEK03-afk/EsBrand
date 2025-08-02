import mongoose from 'mongoose'

const SubscribeSchema=mongoose.Schema({
    email:{type:String,required:true,unique:true},
},{timestamps:true})

export default mongoose.model('Subscribes',SubscribeSchema)