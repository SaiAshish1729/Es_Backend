const express = require("express");
const { Authentication, adminAuth } = require("../Middleware/userAuth");
const { createProduct, getAllProducts, getProductById, deleteProduct } = require("../Controller/productController");
const router = express.Router();

router.post("/add-product", Authentication, adminAuth, createProduct);
router.get("/all-products", getAllProducts);
router.get("/single-product", Authentication, adminAuth, getProductById);
router.delete("/delete-product", Authentication, adminAuth, deleteProduct);

module.exports = router