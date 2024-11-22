import userModel from "../models/userModel.js";

//add item to user cart
const addToCart = async (req, res) => {
  try {
    let UserData = await userModel.findById(req.body.userId);
    let cartData = await UserData.cartData;
    if (!cartData[req.body.itemId]) {
      cartData[req.body.itemId] = 1;
    } else {
      cartData[req.body.itemId] += 1;
    }
    await userModel.findByIdAndUpdate(req.body.userId, { cartData });
    res.json({ success: true, message: "Added to cart" });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "ERROR" });
  }
};

//remove items from user cart

const removeFromCart = async (req, res) => {
  try {
    let UserData = await userModel.findById(req.body.userId);
    let cartData = await UserData.cartData;
    if (cartData[req.body.itemId] > 0) {
      cartData[req.body.itemId] -= 1;
    }
    await userModel.findByIdAndUpdate(req.body.userId, { cartData });
    res.json({ success: true, message: "Remove From cart" });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "ERROR" });
  }
};

// fetchUser Cart data

const getCart = async (req, res) => {
  try {
    let UserData = await userModel.findById(req.body.userId);
    let cartData = await UserData.cartData;
    res.json({ success: true, cartData });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "ERROR" });
  }
};

export { addToCart, removeFromCart, getCart };
