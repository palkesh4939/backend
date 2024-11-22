import mongoose from "mongoose";

 export const connectDB = async ()=>{
    
    await mongoose.connect(process.env.DATABASE_URI).then(()=>console.log("DB Connected"))
}

