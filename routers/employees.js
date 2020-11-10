const express = require("express");

const router = express.Router();

//Import Controllers
const {createEmployee, getEmployees, getEmployee, updateEmployee, deleteEmployee} = require("../controllers/employee");
const advancedResults = require("../middlewares/advancedResults");
const { protect, authorize } = require("../middlewares/auth");
const Employee = require("../models/employees");

router.route("/").post(protect,authorize("admin"), createEmployee);
router.route("/").get(protect,authorize("admin"),advancedResults(Employee), getEmployees);
router.route("/:id")
.get(protect,authorize("admin"), getEmployee)
.put(protect, authorize("admin"), updateEmployee)
.delete(protect, authorize("admin"), deleteEmployee)
;


module.exports = router;