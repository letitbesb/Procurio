const productModel= require("../models/productModel");
const ErrorHandler=require("../utils/errorHandler");
const catchAsyncError= require("../middleware/catchAsyncErrors");
const apifeat= require("../utils/apiFeatures");


//first we create product
exports.createProduct= catchAsyncError(async(req,res,next)=>{

    req.body.user= req.user.id;

    const product=await productModel.create(req.body);
    
    res.status(201).json({
        success: true,
        product
    })
});

//get all the products
exports.getAllProducts= catchAsyncError(async (req,res)=>{

    // console.log(200);
    const prodCount= await productModel.countDocuments();
    const resultsPerPage=8;
    const apifeats= new apifeat(productModel.find(),req.query)
    .search()
    .filter()
    .pagination(resultsPerPage);  //to limit search results and divide into pages
    const prods= await apifeats.query;
    res.status(200).json({
        success: true,
        prods,
        prodCount
    });
});

//get single product
exports.getSingleProduct= catchAsyncError(async (req,res,next)=>{
    const prod= await productModel.findById(req.params.id);
    if(!prod){
        return next(new ErrorHandler("Product not found",404));
    }
    res.status(200).json({
        success: true,
        prod
    })
});


//update a product --> admin access only
exports.updateProduct= catchAsyncError(async(req,res,next)=>{
    const prod= await productModel.findById(req.params.id);
    if(!prod){
        return next(new ErrorHandler("Product not found",404));
    }
    newprod= await productModel.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:true
    });
    res.status(200).json({
        success: true,
        newprod
    })
});

//delete product
exports.deleteProduct= catchAsyncError(async (req,res,next)=>{
    const prod=await productModel.findById(req.params.id);
    if(!prod){
        return next(new ErrorHandler("Product not found",404));
    }
    await prod.deleteOne();

    res.status(200).json({
        success: true,
        message: "product deleted successfully"
    })
});

//create new review or update the review
exports.createProductReview= catchAsyncError(async (req,res,next)=>{
    const {rating,comment,productId}=req.body;
    
    const product = await productModel.findById(productId);
    if(!product){
        return next(new ErrorHandler(`No product exists with the Id : ${productId}`,400));
    }

    const review={
        user: req.user._id,   //this is that schema object which isAuth puts, so _id is the name of the id in schema!!
        name:req.user.name,
        rating:Number(rating), //wrap it into a number if maybe user send a string
        comment,
    };

    
    const isReviewed = await product.reviews.find(rev=> rev.user.toString()===req.user._id); //get all reviews which were given by the same ID wala user as the one putting a review now

    if(isReviewed){
        product.reviews.forEach(rev=>{
            if(rev.user.toString()===req.user._id.toString()){ //update only those reviews which were done by the current user
                rev.rating=rating,
                rev.comment=comment
            }
        })
    }
    else{
        product.reviews.push(review);
        product.numOfReviews=product.reviews.length
    }

    let avg=0
    product.reviews.forEach(rev=>{
        avg=avg+rev.rating;
    });
    product.ratings = avg/product.reviews.length;
    await product.save({validateBeforSave: false});
    res.status(200).json({
        success:true,
    });
});


//get all reviews of a product
exports.getAllReviewsOfProduct= catchAsyncError(async (req,res,next)=>{
    const product= await productModel.findById(req.body.productId);
    if(!product){
        return next(new ErrorHandler(`No product exists with the Id : ${productId}`,400));
    }

    res.status(200).json({
        success: true,
        reviews: product.reviews
    });

});

//get delete review of a product
exports.deleteReviewOfProduct= catchAsyncError(async (req,res,next)=>{
    const product= await productModel.findById(req.query.productId);  //this req.query.productID is diff than req.query.id 
    if(!product){
        return next(new ErrorHandler(`No product exists with the Id : ${productId}`,400));
    }

    const reviews = product.reviews.filter( rev=> rev._id.toString()!==req.query.id.toString()) //find all reviews which dont need to be deleted
    //above line : req.query.id is the ID OF the review! one review has unque id! 


    //calculating average
    let avg=0
    reviews.forEach(rev=>{
        avg=avg+rev.rating;
    });
    const ratings = avg/reviews.length;

    const numOfReviews = reviews.length;
    
    await productModel.findByIdAndUpdate(req.query.productId,{  //updating...
        reviews,
        ratings,
        numOfReviews,
    },
    {
        new: true,
        runValidators : true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true
    });

});