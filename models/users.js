//Import Core Modules
const mongoose = require("mongoose");

//Import Helper Modules
const brcypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

//Building User Schema
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide a username"]
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength:6,
        select: false
    },
    resetPasswordToken:String,
    resetPasswordExpire: Date,
    role:{
        type: String,
        required: true,
        default: "user",
        enum: ["user", "member"]
    },

    createdAt:{
        type: Date,
        default: Date.now()
    }
})
//Encrypt Password
UserSchema.pre("save", async function(next){

    //If Forgot Password Pressed means dont want to update Password
    if(!this.isModified('password')){
        next();
    }
    //Encrypt as Normal
    this.password = await brcypt.hash(this.password, 10);
    next();
});
//Match Password
UserSchema.methods.matchPassword = function(inputPassword){
    return brcypt.compare(inputPassword, this.password)
}
//Generate JWT Token
UserSchema.methods.generateJsonWebToken = function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}

//Generate Hash Password Token

UserSchema.methods.getResetPasswordToken = async function(){
    //Generate TOken

    const resetToken =await crypto.randomBytes(20).toString('hex');
    console.log(resetToken);
    //Hash TOken and set to resetPassword field
    this.resetPasswordToken = await crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');


    //Set Expire
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    console.log(this.resetPasswordExpire);
    return resetToken;
}



module.exports = mongoose.model("User", UserSchema);