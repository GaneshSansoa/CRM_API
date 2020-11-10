const mongoose = require("mongoose");


//Base Order Schema with Discriminator Key Order Type
const OrderSchema = new mongoose.Schema({
    name:{
        type:String,
        required: [true, "Please provide a order name"],
    },
    designType:{
        type: String,
        required: [true, "Please provide a design type"],
        enum: ["full", "name"],
        default: "full"
    },
    width: String,
    height: String,
    additionalInformation:{
        type: String,
        maxlength: 500,
    },
    delieveryType: {
        type: String,
        required: [true, "Please set a delievery type"],
        enum: ["normal", "express"],
        default: "normal"
    },
    designFiles: {
        type: Array,
        required: true
    },
    user:{
        type: mongoose.Schema.ObjectId,
        ref:  "User",
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now()
    }

}, {discriminatorKey: 'orderType'})

const Order = mongoose.model("Order", OrderSchema);

//Artwork Schema
const ArtWorkSchema = new mongoose.Schema({
    vinael:Boolean,
    singleColor: Boolean,
    processColor:Boolean,
    panetoneColor:{
        type: Boolean,
        default: false
    },
    formatRequired:String
});

//Artwork and Quotations Models
const Artwork = Order.discriminator('artwork', ArtWorkSchema)
const ArtworkQuotation = Order.discriminator('artwork-quotation', ArtWorkSchema)


//Digitizing Schema
const DigitizingSchema = new mongoose.Schema({
    visibleTrims: {
        type:Boolean,
        default: true
    
    },
    colorAsPerArtwork: {
        type: Boolean,
        default: true
    },
    asPerArtworkSpecify: String,
    fillBackground: {
        type: Boolean,
        default: false
    },
    targetEmbriodery: {
        type: String,
        required: true,
        enum:[
            "piquo/polo",
            "caps",
            "cotton/twill",
            "jacket-black",
            "fleece",
            "sweat-shirt",
            "jumper",
            "other"
        ],
        default: "piquo/polo"
    },
    embrioderyMachine:String,
    embrioderyFileFormat:{
        type: String,
        default: "Eth"
    },
    runOnMachine:{
        type: Boolean,
        default: false
    }

});

//Digitizing and Quotation Models
const Digitizing = Order.discriminator('digitizing', DigitizingSchema)
const DigitizingQuotation = Order.discriminator('digitizing-quotation', DigitizingSchema)


//Export All Modules
module.exports = {
    Order,
    Artwork,
    ArtworkQuotation,
    Digitizing,
    DigitizingQuotation
};