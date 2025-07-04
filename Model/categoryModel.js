// models/Category.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    description: {
        type: String,
        default: '',
        trim: true
    },
    image: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
