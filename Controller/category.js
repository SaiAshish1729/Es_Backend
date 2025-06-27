const Category = require("../Model/categoryModel");
const slugify = require('slugify');

const createCategory = async (req, res) => {
    try {
        let { name, description, image } = req.body;
        name = name.trim();
        const slug = slugify(name, { lower: true });
        const categoryExists = await Category.findOne({ slug });

        if (categoryExists) {
            return res.status(400).send({ message: "This category already exists." })
        }

        const newCategory = Category({
            name, slug, description: description || '',
            image: image || ''
        });
        await newCategory.save();
        return res.status(201).send({ success: true, message: "New caregory created successfully.", data: newCategory })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Server error while creating category.", error });
    }
}

const categoryList = async (req, res) => {
    try {
        const allCategories = await Category.find({});
        return res.status(200).send({ success: true, message: "Category list fetched successfully", allCategories });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Server error while fetching category list.", error });
    }
}
const singleCategory = async (req, res) => {
    try {
        const { category_id } = req.query;
        const category = await Category.findOne({ _id: category_id });
        if (!category) {
            return res.status(404).json({ message: "No categoru found with given id" })
        }
        return res.status(200).send({ success: true, message: "Single category fetched successfully.", data: category });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Server error while fetching single category.", error });
    }
}
const deleteCategory = async (req, res) => {
    try {
        const { category_id } = req.query;
        if (!category_id) {
            return res.status(400).send({ message: "category_id is required." })
        }
        const category = await Category.findOne({ _id: category_id });
        if (!category) {
            return res.status(404).json({ message: "No categoru found with given id" })
        }
        const removeCategory = await Category.deleteOne({ _id: category_id });
        return res.status(200).json({ message: "Category deleted succesfuuly.", data: removeCategory });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Server error while delteing category.", error });
    }
}

module.exports = {
    createCategory,
    categoryList,
    singleCategory,
    deleteCategory,
}