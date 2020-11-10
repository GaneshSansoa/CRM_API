const jwt = require("jsonwebtoken");
const ErrorResponse = require("./error")
const { asyncHandler } = require("./asyncHandler");
const User = require("../models/users");

exports.protect = asyncHandler(async (req, res, next) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        
        //Set Bearer Token in Headers
        token = req.headers.authorization.split(" ")[1];
    }

    //Set Token in Cookie
    // else if(req.cookies.token){
    //     token = req.cookies.token;
    // }

    if(!token){
        return next(new ErrorResponse("Not Authorized to Access this route", 403))
    }
    try {
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decodedData.id);
        if(!req.user){
            return next(new ErrorResponse("Not Authorized to Access this route", 403))
        }
        next();
    } catch (error) {
        return next(new ErrorResponse("Not Authorized to Access this route", 403))
    }


})

exports.authorize = (...roles) => (req, res, next) =>  {
    console.log(req.user);
    if(!roles.includes(req.user.role)){
        return next(new ErrorResponse(`User ${req.user.id} with role ${req.user.role} is not authorized`, 403))
    }
    next();
}