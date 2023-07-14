const express = require("express");

const router = express.Router();
const {isAuthUser,authorizeRoles} = require("../middleware/auth");
const { newOrder, myOrders, getSingleOrder, getAllOrders, updateOrder, deleteOrder } = require("../controllers/orderController");


router.route("/order/new").post(isAuthUser,newOrder);
router.route("/order/me").get(isAuthUser,myOrders);
router.route("/orders/:id").get(isAuthUser,getSingleOrder);

router.route("/admin/orders").get(isAuthUser,authorizeRoles("admin"),getAllOrders);

router.route("/admin/order/:id").put(isAuthUser,authorizeRoles("admin"),updateOrder)
                                .delete(isAuthUser,authorizeRoles("admin"),deleteOrder);


module.exports =router;