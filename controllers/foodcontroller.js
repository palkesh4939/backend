import foodModel from "../models/foodmodel.js";
import fs from 'fs'

// add food item
const addFood = async (req, res) => {
  try {
    // Log req.file to confirm multer has processed the image
    console.log("Uploaded file:", req.file);

    // Create a new food item with image path from req.file
    const food = new foodModel({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: req.file ? req.file.filename : null, // Use req.file.path for the image field
    });

    console.log("Food item to be saved:", food);

    // Save to MongoDB
    await food.save();
    res.json({ success: true, message: "Food Added" });
  } catch (err) {
    console.log("Error saving food item:", err);
    res.json({ success: false, message: "Error adding food item" });
  }
};

const listfood = async (req,res)=>{
   try{
      const food = await foodModel.find({});
      res.json({success:true , data:food})
   }catch(err){
       console.log(err);
       res.json({success:false , message:"Error"})
   }
}


const removefood = async (req, res)=>{
     try{
        const food = await foodModel.findById(req.body.id);
        fs.unlink(`uploads/${food.image}` , ()=>{})

        await foodModel.findByIdAndDelete(req.body.id);
        res.json({success:true , message :"Food removed"})
        
     }catch(err){
         console.log(err);
         res.json({success:false , message :"Error"})
         
     }
}


// const updatePrices = async () => {
//   try {
//     // const result = await foodModel.updateMany(
//     //   {}, // Empty filter to apply to all documents
//     //   [{ $set: { price: { $divide: ["$multiply", 8] } } }] // Multiply price by 8
//     // );
//   const result=  await foodModel.updateMany(
//     { price: null }, // Filter to target documents where price is null
//     { $set: { price: 0 } } // Set price to a specific number, e.g., 0
//   );
//     console.log(`${result.modifiedCount} items updated.`);
//   } catch (error) {
//     console.error("Error updating prices:", error);
//   }
// };

// // Run the update

// // updatePrices();



const edititem =async (req, res)=>{
  try{
    const result = await foodModel.findById(req.body.itemid);
    res.json({success:true , message :result});
    
  }catch(err){
    res.json({success:false , message :"ERROR"});
  }
}

const editform = async (req, res)=>{
     const{_id , ...updatedata} = req.body;
    try{
      await foodModel.findByIdAndUpdate(_id , updatedata );
      res.json({success:true})
    }catch(err){
      console.log(err);
      res.json({success:false})
    }
}



export { addFood  , listfood , removefood , edititem , editform};
