import mongoose from "mongoose";

 export const connectDB = async ()=>{
    
    await mongoose.connect('mongodb+srv://palkeshpund:gulabo123@cluster0.e4hmo.mongodb.net/food-del').then(()=>console.log("DB Connected"))
}