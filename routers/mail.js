const express = require("express");
const { mailLogin, readMails } = require("../controllers/mail");
const { protect, authorize } = require("../middlewares/auth");

const router = express.Router();


router.route("/addEmail").post(protect,authorize("admin"), mailLogin);
router.route("/readmails/:id").get(protect,authorize("admin"), readMails);


module.exports = router;