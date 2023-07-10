const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("./catchAsyncErrors");
const jwt= require("jsonwebtoken");
const User= require("../models/usermodel");

exports.isAuthUser= catchAsyncError( async (req,res,next)=>{
    const {token}= req.cookies;

    if(!token){
        return next(new ErrorHandler("Please login to access this resource",400));
    }

    const decodedData= jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decodedData.id); //this is very imp
    //we will provide req.user with the object of the schmea, so now we can get id email and all characterics of the schema througb req. user
    //basically if auth passes, then we will kind of like pass it through here and give it a extra useful req.user object through which 
    // our future job is easier

    next();
});

exports.authorizeRoles = (...roles) =>{

    //...roles is an arry containing all roles, altho in our case only admin is there
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){ // if array contains the role of the current user logged in through cookie
            return next(new ErrorHandler(
                `Role: ${req.user.role} is not allowed to access this resource `,403
            ));
        }
        next(); //if he is admin, then simply call next redirect
    };
};