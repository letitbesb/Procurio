const User = require("../models/usermodel");
const ErrorHandler=require("../utils/errorHandler");
const sendToken=require("../utils/jwtToken");
const catchAsyncError= require("../middleware/catchAsyncErrors");
const sendEmail = require("../utils/sendEmail");
const crypto=require("crypto");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
// const apifeat= require("../utils/apiFeatures");


//register a user --> function
exports.registerUser = catchAsyncError( async(req,res,next)=>{
    const {name,email,password}= req.body; //extract from user request data
    // console.log(password);
    const user = await User.create({
        name,email,password,
        avatar:{
            public_id:"this is a sample id",
            url:"profilepicUrl"
        }
    });

    //generate token and send
    sendToken(user,200,res);
});


//login user
exports.loginUser= catchAsyncError( async (req,res,next)=>{
    
    const {email,password} = req.body;

    if(!email || !password){
        // console.log("aya");
        return next(new ErrorHandler("Please enter email and password",400));
    }
    
    const userFound= await User.findOne({email: email}).select("+password");

    if(!userFound){
        return next(new ErrorHandler("Invalid email or password",400));
    }
    const isPasswordMatched= await userFound.comparePassword(password);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password",400));
    }

    sendToken(userFound,200,res);
});



//logout user!!
exports.logoutUser = catchAsyncError( async (req,res,next)=>{
    res.cookie("token",null,{
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success:true,
        message:"Successfully logged out",
    });
});

//forgot password function
exports.forgotPassword = catchAsyncError( async (req,res,next)=>{
    
    const user = await User.findOne({email:req.body.email});

    if(!user){
        return next(new ErrorHandler("User not found",404));
    }
    const resetToken= await user.getPasswordResetToken();

    //some changes were done like giving value to passswordresettoken filed in shcema, so we save that
    await user.save({validateBfeoreSave:false});

    const resetPasswordUrl= `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;
    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\n If you have not requested this url, then please ignore it.`;

    try {
        await sendEmail({
            email: user.email,
            subject: `Ecommerce password Recovery`,
            message
        });

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
        });

    } catch (error) {
        //if error has happened, then put back those two fileds(expiry date and resetToken) in user schema to undefined again
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire= undefined;

        await user.save({validateBeforeSave: false});

        return next(new ErrorHandler(error.message,500));
        
    }
});


//reset Password
exports.resetPassword = catchAsyncError( async (req,res,next)=>{

    //access token in request
    const toku= req.params.token;

    //creating hash of token
    const resetPasswordToken=  crypto.createHash("sha256")
                                     .update(toku)
                                     .digest("hex");

    const user=await User.findOne({
        resetPasswordToken: resetPasswordToken, 
        resetPasswordExpire:{$gt: Date.now()}, //expiry should be greater than right now
    });

    if(!user){
        return next(new ErrorHandler("Reset password token is invalid",404));
    }

    if(req.body.password != req.body.confirmPassword){
        return next(new ErrorHandler("Passwords don't match!",400));
    }

    user.password= req.body.password; //update
    user.resetPasswordToken=undefined;  //since we've done password reset, these two go back to normal
    user.resetPasswordExpire=undefined;

    await user.save();

    sendToken(user,200,res);  //login !

});


//get details of user
exports.getUserDetails = catchAsyncErrors( async (req, res,next) => {
    const user= await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user,
    })
});


//change password of user
exports.updatePassword = catchAsyncErrors( async (req, res,next) => {
    const user= await User.findById(req.user.id).select("+password"); //becuase password is set to be hidden by default in mongoose, so u vcant see it using normal find
    console.log(user.password);
    const oldPassCheck = await user.comparePassword(req.body.oldPassword);
    if(!oldPassCheck){
        return next(new ErrorHandler("Old password does not match!",400));
    }
    if(req.body.newPassword!==req.body.confirmNewPassword){
        return next(new ErrorHandler("Passwords should match. Check again.",400)); 
    }
    
    user.password = req.body.newPassword; //update new password

    await user.save();

    sendToken(user,200,res);
});


//update user profile
exports.updateProfile = catchAsyncErrors( async (req, res,next) => {
    const newUserData={
        name:req.body.name,
        email:req.body.email,
    }

    //we will add cloudinary later

    const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
    })
});

//get all users data(admin)
exports.getAllUsers = catchAsyncError( async (req,res,next)=>{
    const users= await User.find();

    res.status(200).json({
        success: true,
        users,
    });

});


//get single user data(admin)
exports.getSingleUser = catchAsyncError( async (req,res,next)=>{
    const user= await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`,400));
    }
    res.status(200).json({
        success: true,
        user,
    });

});

//update role of user -- by admin only
exports.updateUserRole = catchAsyncErrors( async (req, res,next) => {
    const newUserData={
        name:req.body.name,
        email:req.body.email,
        role:req.body.role
    }

    const user = await User.findByIdAndUpdate(req.params.id,newUserData,{
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    if(!user){
        return next(new ErrorHandler(`No such user exists with Id: ${req.params.id}`,400));
    }
    
    res.status(200).json({
        success: true,
    })
});

//delete a user -- by admin only
exports.deleteUser = catchAsyncErrors( async (req, res,next) => {
    const user= await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`No such user exists with Id: ${req.params.id}`,400));
    }
    
    await user.remove();

    res.status(200).json({
        success: true,
        message:"User deleted successfully"
    })
});