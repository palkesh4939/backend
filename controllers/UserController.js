import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import validator from 'validator'


const loginUser = async (req, res)=>{
     const {email , password} = req.body;
     console.log(email);
     try{
        const user = await userModel.findOne({email});
        console.log(user);
        
        if(!user){
            return res.json({success:false , message:"User Does'nt exist"})
        }
        const isMatch = await bcrypt.compare(password , user.password);
        if(!isMatch){
            res.json({success:false , message:"Invalid Credentials"})
        }

        const token = createToken(user._id);
        res.json({success:true , token});

     }catch(err){
         console.log(err);
         res.json({success:false , message:err})
         
     }
}

const createToken = (id)=>{
    return jwt.sign({id} ,process.env.JWT_SECRET );
}

const registerUser = async (req,res)=>{
      const {name , password , email} = req.body;
      
      try{
        const exists = await userModel.findOne({email});
        if(exists){
            return res.json({success:false , message:"User already Exits"})
        }

        if(!validator.isEmail(email)){
            return res.json({success:false , message:"Please enter a valid email"})
        }
        
        if(password.length < 8){
            return res.json({success:false , message:"Please enter a strong password"})
        }

        //hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password , salt);

        const newUser = new userModel({
            name:name ,
            email :email,
            password :hashedPassword
        })

        const user = await newUser.save();
        const token = createToken(user._id);
        res.json({success:true , token})

      }catch(err){
         console.log(err);
         res.json({success:false, message:"ERROR"})
         
      }
}

export {loginUser , registerUser}