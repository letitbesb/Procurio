const mongoose = require("mongoose");
const validator=require("validator");
const bcrypt= require("bcryptjs");
const jwt= require("jsonwebtoken");
const crypto = require('crypto');

const userSchema= new mongoose.Schema({
    name:{
        type:  String,
        required: [true,"Name cannot be empty"],
        maxLength:[30,"Name cannot exceed 30 characters"],
        minlength:[4,"Name should have more than 3 characters"],
    },
    email:{
        type:String,
        required:[true,"Email cannot be empty"],
        unique:true,
        validate:[validator.isEmail,"Enter a valid email address"],
    },
    password:{
        type:String,
        required: [true,"Please enter a password"],
        minlength:[8,"Password must be at least 8 characters long"],
        select:false, //doesnt show up in find() results
    },
    avatar:{
        public_id:{
            type:String,
            required: true,
        },
        url:{
            type:String,
            required: true,
        }
    },
    role:{
        type:String,
        default:"user",
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,
});


//below code will run this function when .save() will be called on the given schema
userSchema.pre("save",async function(next){

    if(!this.isModified("password")){  //if password isnt changed, then dont hash and move on
        next();
    }
    this.password = await bcrypt.hash(this.password,10); //hash the password
});

userSchema.methods.comparePassword = async function(passwordEntered) {
    const val= await bcrypt.compare(passwordEntered, this.password);
    return val;
};

userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

//generating password reset token
userSchema.methods.getPasswordResetToken = function () {
    const resetToken= crypto.randomBytes(20).toString("hex");

    //hashing and adding resetpasword token  to userschema 
    this.resetPasswordToken= crypto.createHash("sha256")
    .update(resetToken)
    .digest("hex");

    this.resetPasswordExpire= Date.now()+15*60*1000; //expire from now in given time
    return resetToken;
}

module.exports = mongoose.model("User",userSchema);