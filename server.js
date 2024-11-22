import express from 'express';
import cors from 'cors'
import { connectDB } from './config/db.js';
import foodRouters from './routes/foodRoute.js';
import userRouter from './routes/UserRoute.js';
import 'dotenv/config.js'
import CartRouter from './routes/CartRoute.js';
import orderRouter from './routes/orderRoute.js';




//app config 
const app = express();
const port =process.env.PORT ||  4000;


//middleware
app.use(express.json());
app.use(cors());

app.use('/images' , express.static('uploads'));

// db connection
connectDB()

app.get('/' , (req,res)=>{
    res.send("HELLO")
})
// api endpoint
app.use('/api/food', foodRouters );
app.use('/api/user',userRouter);
app.use('/api/cart',  CartRouter)
app.use('/api/order' ,orderRouter )

app.listen(port , ()=>{
    console.log(`Server Started On http://localhost:${port}`);
});

