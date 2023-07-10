const productModel= require("../models/productModel");
const orderModel= require("../models/orderModel");
const ErrorHandler=require("../utils/errorHandler");
const catchAsyncError= require("../middleware/catchAsyncErrors");
const apifeat= require("../utils/apiFeatures");


// Create new Order
exports.newOrder = catchAsyncError(async (req, res, next) => {
    console.log(200);
        const {
            orderItems,
            shippingInfo,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            paymentInfo,
        } = req.body;
        console.log(200);
        const order = await orderModel.create({
            orderItems,
            shippingInfo,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            paymentInfo,
            paidAt: Date.now(),
            user: req.user.id,
        });
        console.log(201);
        res.status(201).json({
            success: true,
            order,
        });
});