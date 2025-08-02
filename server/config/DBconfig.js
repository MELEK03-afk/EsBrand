import mongoose from "mongoose";
import colors from "colors";

const URL = process.env.MONGO_CONNECT

const connectToMongooset = async () => {
    try {
        await mongoose.connect(URL)
        console.log("Database connected successfully".green.underline)
    } catch (error) {
        console.log("Database connection failed:".red, error);
    }
}

export default connectToMongooset