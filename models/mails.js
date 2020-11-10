const mongoose = require("mongoose");
const {encrypt} = require("../utils/crypto");
const mailSchema = new mongoose.Schema({
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
    iv:{
        type: String
    },
    host: {
        type: String,
        required: [true, "Please provide your mailer url"]
    },
    port: {
        type: Number,
        required: [true, "Please provide mailer PORT"]
    },
    createdAt:{
        type: Date,
        default: Date.now()
    }
})
mailSchema.pre("save", function(next){
    const hash = encrypt(this.password);
    this.password = hash.content;
    this.iv = hash.iv
    next();
})
module.exports = mongoose.model("Mail", mailSchema);