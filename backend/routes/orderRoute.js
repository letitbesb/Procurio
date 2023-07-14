const express = require("express");

const router = express.Router();
const {isAuthUser,authorizeRoles} = require("../middleware/auth");
const { newOrder, myOrders, getSingleOrder } = require("../controllers/orderController");


router.route("/order/new").post(isAuthUser,newOrder);
router.route("/order/me").get(isAuthUser,myOrders);
router.route("/order/:id").get(isAuthUser,authorizeRoles("admin"),getSingleOrder);

module.exports =router;