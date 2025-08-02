import mongoose from 'mongoose'

const userSchema=mongoose.Schema({
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    phoneNumber:{type:Number},
    role:{type:String,enum:["User","Admin","Owner"],default:"User"},
},{timestamps:true})

export default mongoose.model('User',userSchema)