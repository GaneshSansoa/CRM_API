const mongoose = require("mongoose");
//Identity Card Schema
const identityCardSchema = new mongoose.Schema({
    identityType: {
        type: String,
        required: [true, "Plesae provide an identity card"]
    },
    uid: {
        type: String,
        required: [true, "Please provide an id number"]
    }
})


const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide employee name"]
    },
    fatherName:{
        type: String,
        required:[true, "Please provide father's name"]
    },
    gender:{
        type: String,
        required: [true, "Please provide gender"],
        enum: [
            "male",
            "female",
            "other"
        ]
    },
    dob:{
        type: Date,
        required:[true, "Please provide date of birth"]
    },
    phone: {
        type: Number,
        required: [true, "Please provide mobile number"],
        min: 10
    },
    email:{
        type: String,
        required: [true, "Please provide an email"],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    address: {
        type: String,
        required:[true, "Please provide an address"],
    },
    city: {
        type: String,
        required:[true, "Please provide a city"]
    },
    state:{
        type: String,
        required: [true, "Please provide a state"]
    },
    country: {
        type: String,
        required: [true, "Please provide country"]
    },
    identityCard:
    {
        type: [identityCardSchema],
        required: [true, "Please provide at least one identity information"],
        default: undefined // For Array Required Put Default undefined
    },
    department: {
        type: String,
        required: [true, "Please provide a department"]
    },
    jobType: {
        type: String,
        required: [true, "Please provide a job nature"],
        enum: [
            "full-time",
            "part-time"
        ]
    },
    salary:{
        type: Number,
        required: [true, "Please provide salary of the employee"]
    },
    joiningDate:{
        type: Date,
        required: [true, "Please provide joining date"]
    },
    createdAt:{
        type: Date,
        default: Date.now()
    }

})






module.exports = mongoose.model("Employee", employeeSchema)