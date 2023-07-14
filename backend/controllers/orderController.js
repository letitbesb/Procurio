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


//get a single order details -->data of one  particular order WHO ordered 
exports.getSingleOrder= catchAsyncError(async(req,res,next)=>{
    const order = await orderModel.findById(req.params.id).populate(
        "user",
        "name email"
        );  //what does populate do?
        //--> what does populate does is that it uses the already found user id 
        //in the product and goes to the "user" database 
        //and then finds the name and email and returns it 

    //if order not present
    if(!order){
        return next(new ErrorHandler("No order found with this ID",404));
    }

    res.status(200).json({
        success: true,
        order: order
    });
})

// get orders of the logged in USER
exports.myOrders= catchAsyncError(async(req,res,next)=>{
    const order = await orderModel.find({user:req.user._id});
      
    res.status(200).json({
        success: true,
        order: order
    });
})