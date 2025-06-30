const slugify = require('slugify');
const Product = require('../Model/productModel');

const createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            countInStock,
            brand,
            images,
            category,
            isFeatured
        } = req.body;

        if (!name || !price || !countInStock || !category) {
            return res.status(400).json({ success: false, message: "Missing required fields." });
        }

        const slug = slugify(name, { lower: true });

        const existing = await Product.findOne({ slug });
        if (existing) {
            return res.status(400).json({ success: false, message: "Product already exists." });
        }

        const newProduct = new Product({
            name,
            slug,
            description,
            price,
            countInStock,
            brand,
            images,
            category,
            isFeatured: isFeatured || false
        });

        await newProduct.save();

        return res.status(201).json({
            success: true,
            message: "Product created successfully.",
            data: newProduct
        });

    } catch (error) {
        console.error("Product Create Error:", error);
        return res.status(500).json({ success: false, message: "Server error.", error: error.message });
    }
};

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .populate('category', 'name slug')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, message: "All products fetched successfully.", data: products });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch products", error: error.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const { product_id } = req.query;
        if (!product_id) {
            return res.status(400).json({ message: "product_id is missing." });
        }
        const product = await Product.findById({ _id: product_id }).populate('category', 'name');
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found." });
        }
        res.status(200).json({ success: true, message: "Product details fetched successfully.", data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error getting product", error: error.message });
    }
};
const updateProduct = async (req, res) => {
    try {
        const { product_id } = req.query;
        const updated = await Product.findByIdAndUpdate(
            { _id: product_id },
            { ...req.body, slug: slugify(req.body.name || "") },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.status(200).json({ success: true, message: "Product updated successfully.", data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating product", error: error.message });
    }
};
const deleteProduct = async (req, res) => {
    try {
        const { product_id } = req.query;
        const deleted = await Product.findByIdAndDelete({ _id: product_id });
        if (!deleted) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting product", error: error.message });
    }
};


module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
}