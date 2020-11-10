//Core Module Requires
const express = require("express");
const router = express.Router();

//Importing Controllers
const {registerUser, loginUser, forgotPassword, resetPassword, updatePassword, logout, getMe} = require("../controllers/auth");
const { protect } = require("../middlewares/auth");

//Routers
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logout);
router.route("/getme").get(protect, getMe);
router.route("/forgotpassword").post(forgotPassword);
router.route("/resetpassword/:token").put(resetPassword);
router.route("/updatepassword").put(protect, updatePassword);


//Exporting Route
module.exports = router;