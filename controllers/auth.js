//Import Helper Functions
const { asyncHandler } = require("../middlewares/asyncHandler");
const ErrorResponse = require("../middlewares/error");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
//Import Models
const User = require("../models/users");
const { match } = require("assert");


//@desc     Register User
//@route    POST api/v1/auth/register 
//@scope    Public
exports.registerUser = asyncHandler(async (req, res, next) => {
    

    //Only User can register
    req.body.role = "user";

    //Register User
    const user = await User.create(req.body);

    //Send Response back
    sendLoginToken(user, 201, res);

});


//@desc     Login User
//@route    POST api/v1/auth/login 
//@scope    Public
exports.loginUser = asyncHandler(async (req, res, next) => {
    const {email, password} = req.body;
    
    //If Email Password Doesnt Matched
    if(!email || !password){
        return next(new ErrorResponse({
            type: "Field Error",
            message:"Please provide email or password"
        }, 400))
    }

    //Check Email Exists
    const user = await User.findOne({email}).select("+password");

    if(!user){
        return next(new ErrorResponse("Unable to Authenticate Username or password dont match", 400))
    }

    //Password Matching with User Model using helper function
    if(!await user.matchPassword(password)){
        return next(new ErrorResponse("Unable to Authenticate Username or password dont match", 400))

    }
    
    sendLoginToken(user, 200, res);

});

//@desc     Forgot Password
//@route    POST api/v1/auth/forgotpassword 
//@scope    Public
exports.forgotPassword = asyncHandler(async(req, res, next) => {
    const user = await User.findOne({email : req.body.email});
    //Check For User
    if(!user){
         return next(new ErrorResponse(`There is no user with that email`, 404))
    }
    //Get Reset Token
    const resetToken = await user.getResetPasswordToken();
    await user.save({validateBeforeSave: false})
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;
    res.status(200).json({
        data: resetUrl
    })
});

//@desc     Reset Password
//@route    PUT api/v1/auth/resetpassword/:token
//@scope    Public
exports.resetPassword = asyncHandler(async(req, res, next) => {

    //Extract and verify password
    const {password} = req.body;
    if(!password){
        return next(new ErrorResponse(`Please provide password`, 400))
    }

    //Check Token and Verify with database
    const resetPasswordToken = crypto.createHash('sha256')
    .update(req.params.token)
    .digest('hex');

    //Find if there is any reset password token is generated within 10 minutes
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: {$gt: Date.now()}
    })
    if(!user){
        return next(new ErrorResponse(`Invalid Token`, 403))
    }

    //Set Password and Clear token data
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    sendLoginToken(user, 200, res);

})

//@desc     Update Password
//@route    PUT api/v1/auth/updatepassword
//@scope    Private
exports.updatePassword = asyncHandler(async(req, res, next) => {
    const {currentPassword, newPassword} = req.body;

    //Check if both current and new password entered
    if(!currentPassword || !newPassword){
        return next(new ErrorResponse("Provide Current And New Password", 400))
    }
    //Find user by logged in user id
    const user = await User.findById(req.user.id).select('+password');
    if(!user){
        return next(new ErrorResponse("Not Authorized to access this route", 400))
    }
    //Match Old Password 
    const matchPassword = await user.matchPassword(currentPassword);
    if(!matchPassword){
        return next(new ErrorResponse("Please enter correct password", 400))
    }
    //Set New Password
    user.password = newPassword;
    //Save to Model
    await user.save();
    //Send Response
    sendLoginToken(user, 200, res);
});


//@desc     Get Me
//@route    GET /api/v1/auth/getme
//@access   Private
exports.getMe = asyncHandler(async(req, res, next)=> {
    const user = await User.findById(req.user.id);
    if(!user){
        return next(new ErrorResponse("Not Authorized to access this page", 404))
    }
    res.status(200).json({
        success: true,
        data: user
    })
})



//@desc     Log Out User
//@route    GET /api/v1/auth/logout
//@access   Private
exports.logout = asyncHandler(async(req, res, next) =>{
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true 
    })
    res.status(200).json({
        success: true,
        data: {}
    })
})



//Generate Login Token
const sendLoginToken = async (user, statusCode, res) => {
    
    //Generate Token Using User Model Helper Function
    const token = await user.generateJsonWebToken();

    //Cookie Options
    const options = {
        expires: new Date(Date.now + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    }

    //IF production mode then make cookie secure
    if(process.env.NODE_ENV === "production"){
        options.secure = true;
    }

    //Sending Response with token and cookie
    res.status(statusCode)
    .cookie('token', token, options)
    .json({
        success: true,
        token: token
    })
}

