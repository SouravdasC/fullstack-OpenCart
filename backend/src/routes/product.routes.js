import express, { Router } from "express"
import { createProduct, createProductReview, deleteProduct, deleteReview, getAllAdminProduct, getAllProduct, getProductDetails, getProductReview, updateProduct } from "../controllers/product.controller.js"
import { isAuthenticatedUser } from "../middlewares/auth.middleware.js"
import { authorizeRoles } from "../middlewares/authorizeRoles.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"

const productRouter = Router()

productRouter.route("/products").get(getAllProduct)

productRouter.route("/admin/products").get(isAuthenticatedUser, authorizeRoles("admin"), getAllAdminProduct)

productRouter.route("/admin/product/new").post(isAuthenticatedUser, authorizeRoles("admin"),  upload.array('images', 5),createProduct)

productRouter.route("/admin/product/:id").put(isAuthenticatedUser, authorizeRoles("admin"),upload.array("images", 5) , updateProduct).delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct)

productRouter.route("/product/:id").get(getProductDetails)

productRouter.route("/review").put(isAuthenticatedUser, createProductReview)

productRouter.route("/review/:id").get(getProductReview);
productRouter.route("/reviews").delete(isAuthenticatedUser, deleteReview);


// productRouter.route("/reviews").get(getProductReview).delete(isAuthenticatedUser, deleteReview)

export default productRouter