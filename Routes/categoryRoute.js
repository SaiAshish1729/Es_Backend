const express = require("express");
const { createCategory, categoryList, singleCategory, deleteCategory } = require("../Controller/category");
const { Authentication, adminAuth } = require("../Middleware/userAuth");
const router = express.Router();

router.post("/add-category", Authentication, adminAuth, createCategory);
router.get("/all-categories", Authentication, adminAuth, categoryList);
router.get("/single-category", Authentication, adminAuth, singleCategory);
router.delete("/delete-category", Authentication, adminAuth, deleteCategory);

module.exports = router