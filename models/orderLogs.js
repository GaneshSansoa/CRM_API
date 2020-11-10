const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
    orderRole: {
        type: String,
        required: true,
    },
    accepted:{
        type: Boolean,
        required: true,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },
    acceptedAt:{
        type: Date
    }

})


const orderLogSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.ObjectId,
        ref: "Order",
        required: true
    },
    logs:[logSchema],
    createdAt:{
        type: Date,
        default: Date.now()
    }
})




module.exports = mongoose.model("OrderLog", orderLogSchema);