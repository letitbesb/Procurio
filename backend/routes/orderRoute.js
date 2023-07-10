const express = require("express");

const router = express.Router();
const {isAuthUser,authorizeRoles} = require("../middleware/auth");
const { newOrder } = require("../controllers/orderController");


router.route("/order/new").post(isAuthUser,newOrder);


module.exports =router;