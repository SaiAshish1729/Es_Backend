const express = require("express");
const { userRegistration, userLogin, loggedInUserProfile, addToCart } = require("../Controller/userController");
const { Authentication } = require("../Middleware/userAuth");
const router = express.Router();

router.post("/register-user", userRegistration);
router.post("/user-login", userLogin);
router.get("/me", Authentication, loggedInUserProfile);
router.post("/add-to-cart", Authentication, addToCart)


module.exports = router