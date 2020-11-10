//Core MOdules
const express = require("express");
const router = express.Router({mergeParams: true});
const dotenv = require("dotenv");
dotenv.config({path: "./config/config.env"});

const {Order} = require("../models/orders");
const User = require("../models/users");


const {createOrder, getOrders, getOrder} = require("../controllers/orders");
const advancedResults = require("../middlewares/advancedResults");
const { protect, authorize } = require("../middlewares/auth");
const uploadFiles = require("../utils/uploadFiles");

router.route("/").post(protect, authorize("user","member", "admin"), uploadFiles({
    path: process.env.FILE_UPLOAD_PATH,
    size: process.env.MAX_FILE_UPLOAD,
    regex: /\.(jpg|jpeg|jpe|jfif|png|pdf|doc|docx|xls|tif|tiff|gif|pcx|cdr|cpt|ai|eps|wmf|pct|bmp)$/,    
}), createOrder);
router.route("/").get(protect, authorize("member", "user", "admin"), advancedResults(Order, {
    path: "user",
    select: "username email"
}), getOrders);
router.route("/:id").get(protect, authorize("member", "user", "admin"), getOrder);

module.exports = router;
