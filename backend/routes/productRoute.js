const express=require('express');
const { getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getSingleProduct, 
    createProductReview,
    getAllReviewsOfProduct,
    deleteReviewOfProduct
    } = require('../controllers/productController');
const {isAuthUser,authorizeRoles}=require("../middleware/auth");

const router=express.Router();

router.route("/products").get(getAllProducts)

router.route("/admin/products/new")
.post(isAuthUser,authorizeRoles("admin"),createProduct)


router.route("/admin/products/:id")
    .put(isAuthUser,authorizeRoles("admin"),updateProduct)
    .delete(isAuthUser,authorizeRoles("admin"),deleteProduct)

router.route("/review").put(isAuthUser,createProductReview);



router.route("/reviews")
    .get(getAllReviewsOfProduct)
    .delete(isAuthUser,deleteReviewOfProduct);


router.route("/products/:id").get(getSingleProduct);
module.exports=router