const ErrorResponse = require("./error");

const errorHandler = (err, req, res, next) => {

    let error = { ...err };
    error.message = err.message;
    console.log(err);

    //Validation Error
    if(err.name === "ValidationError"){
        const message = Object.values(err.errors).map(val => val.message);
        // error.statusCode = 400;
        // error.message = message
        error = new ErrorResponse(message, 400);

    }
    //Cast Error
    if(err.name === "CastError"){
        // console.log(err.errors);
        const message = `Resource not found with id: ${error.value}`;
        // error.statusCode = 400;
        // error.message = message
        error = new ErrorResponse(message, 400);

    }

    //Duplicate Entry Error
    if(err.code === 11000){
        const message = `Duplicate Field Value Entered`;
        // error.statusCode = 400;
        // error.message = message
        error = new ErrorResponse(message, 400);
    }


    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || "Server Error"
    })
}

module.exports = errorHandler;