const { asyncHandler } = require("../middlewares/asyncHandler");
const ErrorResponse = require("../middlewares/error");
const employees = require("../models/employees");
const Employee = require("../models/employees");


//@desc     CreateEmployee
//@route    POST api/v1/employees/ 
//@scope    Private/Admin
exports.createEmployee = asyncHandler(async (req, res, next) => {
    
    const employee = await Employee.create(req.body);

    res.status(200).json({
        success: true,
        data: employee
    })
});

//@desc     Get Employee
//@route    GET api/v1/employees/ 
//@scope    Private/Admin

exports.getEmployees = asyncHandler(async(req, res, next) => {
    
    res.status(200).json(res.advancedResults)

})
//@desc     Get Employee
//@route    GET api/v1/employees/:id
//@scope    Private/Admin
exports.getEmployee = asyncHandler(async(req, res, next)=>{
    const employee = await Employee.findById(req.params.id);

    if(!employee){
        return next(new ErrorResponse(`No Employee with id ${req.params.id} found`));
    }
    res.status(200).json({
        success: true,
        data: employee
    })
})

//@desc     Update Employee
//@route    PUT api/v1/employees/:id
//@scope    Private/Admin
exports.updateEmployee = asyncHandler(async(req, res, next) => {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if(!employee){
        return next(new ErrorResponse(`No Employee with id ${req.params.id} found`));
    }
    
    res.status(200).json({
        success: true,
        data: employee
    })
})

//@desc     Delete Employee
//@route    DELETE api/v1/employees/:id
//@scope    Private/Admin
exports.deleteEmployee =  asyncHandler( async(req, res, next) => {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if(!employee){
        return next(new ErrorResponse(`No Employee with id ${req.params.id} found`));
    }
    res.status(200).json({
        success: true,
        data: {}
    })
})