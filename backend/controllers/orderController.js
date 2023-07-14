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
});


//get all orders on website --ADMIN
exports.getAllOrders= catchAsyncError(async(req,res,next)=>{
    const orders = await orderModel.find();
    let totalamt=0;
    orders.forEach(order=>{
        totalamt+=order.totalPrice;
    });
    res.status(200).json({
        success: true,
        totalamt,
        orders,
    });
});


//update order status --ADMIN
exports.updateOrder= catchAsyncError(async(req,res,next)=>{
    const order = await orderModel.findById(req.params.id); 
    
    if (!order) {
        return next(new ErrorHandler("Order not found with this Id", 404));
    }

    if(order.orderStatus==="Delivered"){
        return next(new ErrorHandler("You have already delivered this product", 400));
    }
    
    order.orderItems.forEach(async (zx)=>{
        await updateStock(zx.product,zx.quantity);
    });  //updating the stock 

    order.orderStatus=req.body.status;  //set new status as given by user

    if(req.body.status==="Delivered"){
        order.deliveredAt=Date.now();
    }  //if delovered then set time

    await order.save({validateBeforeSave: false});

    res.status(200).json({
        success: true,
    });
});

//helper function to update stock
async function updateStock(id,quantity){
    const product=await productModel.findById(id);
    product.Stock-=quantity;
    await product.save({validateBeforeSave: false});;
}


// delete Order -- Admin
exports.deleteOrder = catchAsyncError(async (req, res, next) => {
  const order = await orderModel.findById(req.params.id);

  if (!order) {
    return next(new ErrorHander("Order not found with this Id", 404));
  }

  await order.deleteOne();

  res.status(200).json({
    success: true,
  });

});