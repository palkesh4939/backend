// import orderModel from "../models/orderModel.js";
// import userModel from "../models/userModel.js";
// import { Stripe } from "stripe";

// //placing user order for frontend
// // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// const placeorder = async (req, res) => {

//     const frontend_url = 'http://localhost:5173';

//   try {
//     const newOrder = new orderModel({
//       userId: req.body.userid,
//       items: req.body.items,
//       amount: req.body.amount,
//       address: req.body.address,
//     });

//     await newOrder.save();
//     await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

//     const line_items = req.body.items.map((item) => ({
//       price_data: {
//         currency: "inr",
//         product_data: {
//           name: item.name,
//         },
//         unit_amount: item.price * 100 * 80,
//       },
//       quantity: item.quantity,
//     }));

//     line_items.push({
//       price_data: {
//         currency: "inr",
//         product_data: {
//           name: "Delivery Charges",
//         },
//         unit_amount: 2 * 100 * 80,
//       },
//       quantity: 1,
//     });

//     const session = await Stripe.Checkout.session.create({
//         line_items : line_items,
//         mode:"payment",
//         success_url:`${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
//         cancel_url:`${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
//     })
//     res.json({success:true , session_url:session.url})

// } catch (err) {
//     console.log(err);
//     res.json({success:false , message:"ERROR"})
//   }
// };

// export { placeorder };

// // extra files

import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Razorpay from "razorpay";

// Initialize Razorpay instance
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const placeorder = async (req, res) => {
  const frontend_url = "http://localhost:5174";

  try {
    // Create a new order in the database
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });

    await newOrder.save();
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    // Calculate the total amount in paise (Razorpay uses INR in paise)
    const totalAmount =
      req.body.items.reduce(
        (acc, item) => acc + item.price * 100 * 80 * item.quantity,
        0
      ) +
      2 * 100 * 80;

     

    // Create a Razorpay order
    const razorpayOrder = await razorpayInstance.orders.create({
      amount: totalAmount,
      currency: "INR",
      receipt: `order_rcptid_${newOrder._id}`,
    });

    // Send the order ID to the frontend
    res.json({
      success: true,
      orderId: newOrder._id,
      razorpayOrderId: razorpayOrder.id,
      frontendVerifyUrl: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancelUrl: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "ERROR" });
  }
};
const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success == "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "paid" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: true, message: "Not Paid" });
    }
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "ERROR" });
  }
};

const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (err) {
    console.log(err);
    res.json({ success: false, data: "ERROR" });
  }
};

const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "ERROR" });
  }
};

const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId , {status:req.body.status});
    res.json({success:true , message:"Status Updated"});
  } catch (err) {
    console.log(err);
    res.json({success:false , message:"ERROR"})
  }
};

export { placeorder, verifyOrder, userOrders, listOrders, updateStatus };
