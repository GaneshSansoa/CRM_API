const { asyncHandler } = require("../middlewares/asyncHandler");
const ErrorResponse = require("../middlewares/error");
const {Order, Artwork, Digitizing, ArtworkQuotation, DigitizingQuotation} = require("../models/orders")
const OrderLog = require("../models/orderLogs")
// const {uploadFile} = require("../utils/fileUpload");
const path = require("path");
const { truncate } = require("fs");




//@desc     Create Order
//@route    POST api/v1/orders/ 
//@scope    Private/Member/Admin
exports.createOrder = (asyncHandler(async(req, res, next) => {

    //Check Order Type
    if(!req.query.type){
        return next(new ErrorResponse("Please provide a order type", 400));
    }

    

    //Pusing User and Files Path
    req.body.user = req.user.id;
    req.body.designFiles = res.filenames;


    //Check If order is filled by admin or user
    let accepted = false;
    if(req.user.role === "admin"){
        accepted = true;
    }


    let order;

    //Checking Kind of Order and Creating respectively
    switch(req.query.type){
        case "artwork":
            order = await Artwork.create(req.body)

        break;
        case "artwork-quotation":
            order = await ArtworkQuotation.create(req.body)
            
        break;
        case "digitizing":
            order = await Digitizing.create(req.body)
            
        break;
        case "digitizing-quotation":
            
            order = await DigitizingQuotation.create(req.body)
        break;
        default:
            return next(new ErrorResponse("Please provide a correct order type", 400))
    }
    let logs = [{
        orderRole: req.user.role,
        accepted,
        user:req.user.id 
    }]
    let orderData = {
        orderId: order.id,
        logs
    }
    const orderLogs = await OrderLog.create(orderData);
    console.log(orderLogs);
    //Send Back Response
    res.status(200).json({
        success: true,
        data: order,
    })
    
}))


//@desc     Get Orders
//@route    GET api/v1/orders/ 
//@scope    Private/Member/Admin
exports.getOrders = asyncHandler(async (req, res, next) => {

    if(req.user.role !== "admin"){
        const orders = await Order.find({user: req.user.id});
        //Check Order
        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        })
    }
    else{
        res.status(200).json(res.advancedResults);
    }

})
//@desc     Create Order
//@route    GET api/v1/orders/:id
//@scope    Private/Member/Admin
exports.getOrder = asyncHandler(async (req, res, next) => {

    const order = await Order.findById(req.params.id);
    if(!order){
        return next(new ErrorResponse(`No Order with ${req.params.id} found`,  404));
    }

    if(order.user.toString() !== req.user.id && req.user.role !== "admin"){
        return next(new ErrorResponse(`Not Authorized to view this router`, 403));
    }
    res.status(200).json({
        success: true,
        data: order
    })

   
})