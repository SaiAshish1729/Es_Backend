const User = require("../Model/userModel");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utills/token");
const Product = require("../Model/productModel");
const Cart = require("../Model/cartModel");

const userRegistration = async (req, res) => {
    try {
        const { name, email, password, phone, street, apartment, zip, city, country } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(403).json({ message: "This user already exists." });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = User({
            name, email, password: hashedPassword, phone,
            address: {
                street, apartment, zip, city, country
            }
        });
        await newUser.save();
        return res.status(201).json({ success: true, message: "User registration done successfully.", data: { newUser } })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error while user registration.", error });
    }
}
const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return res.status(403).json({ message: "Invalid password" });
        }
        const token = await generateToken(res, existingUser._id);

        return res.status(200).send({ success: true, message: "User sign in successfully.", token: token, user_name: existingUser.name })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error while sign in.", error });
    }
}

const loggedInUserProfile = async (req, res) => {
    try {
        const user = req.user;
        return res.status(200).send({ success: true, message: "User profile fetched successfully.", data: user })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Server error while fetching logged in user's profile.", error });
    }
}
// `````````````````````````````````````````````````````````````````````````````````````````````````````
//                                   ========>>> cart area ======>>>
// ,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
const addToCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { product, quantity } = req.body;
        if (!product || !quantity || quantity < 1) {
            return res.status(400).json({ message: 'Product and valid quantity are required.' });
        }

        const productExists = await Product.findById(product);
        if (!productExists) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({
                user: userId,
                items: [{ product, quantity }]
            });
        } else {
            // Check if the product already exists in the cart
            const itemIndex = cart.items.findIndex(item => item.product.toString() === product);

            if (itemIndex > -1) {
                // Product exists, update quantity
                cart.items[itemIndex].quantity = quantity;
            } else {
                // Product does not exist, add to cart
                cart.items.push({ product, quantity });
            }
        }

        await cart.save();
        return res.status(200).json({ success: true, message: 'Item added to cart successfully', cart });

    } catch (error) {
        console.error('Add to cart error:', error);
        return res.status(500).json({ message: 'Server error while adding item to cart.', error });
    }
};
const fetchMyCart = async (req, res) => {
    try {
        const userId = req.user._id;
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).send({ message: "There is nothing to show in your cart." })
        }
        return res.status(200).json({ success: true, message: 'Cart items fetched successfully', cart });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error while fetching cart.', error });
    }
}


module.exports = {
    userRegistration,
    userLogin,
    loggedInUserProfile,
    addToCart,
    fetchMyCart,

}