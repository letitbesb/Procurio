const express = require("express");
const { registerUser,loginUser, logoutUser,forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUsers ,getSingleUser, updateUserRole, deleteUser} = require("../controllers/UserController");
const router = express.Router();
const {isAuthUser,authorizeRoles} = require("../middleware/auth");
const { getAllReviewsOfProduct } = require("../controllers/productController");


router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/password/update").put(isAuthUser,updatePassword);

router.route("/logout").get(logoutUser);

router.route("/me").get(isAuthUser,getUserDetails);
router.route("/me/update").put(isAuthUser,updateProfile);

router.route("/admin/user/:id")
    .get(isAuthUser,authorizeRoles("admin"),getSingleUser)
    .put(isAuthUser,authorizeRoles("admin"),updateUserRole)
    .delete(isAuthUser,authorizeRoles("admin"),deleteUser);


router.route("/admin/users").get(isAuthUser,authorizeRoles("admin"),getAllUsers);



module.exports =router;