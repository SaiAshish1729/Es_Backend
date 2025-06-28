const express = require("express");
const { userRegistration, userLogin, loggedInUserProfile, addToCart, fetchMyCart } = require("../Controller/userController");
const { Authentication } = require("../Middleware/userAuth");
const router = express.Router();

router.post("/register-user", userRegistration);
router.post("/user-login", userLogin);
router.get("/me", Authentication, loggedInUserProfile);
router.post("/add-to-cart", Authentication, addToCart);
router.get("/my-cart", Authentication, fetchMyCart);


module.exports = router