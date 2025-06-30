const Cart = require("../Model/cartModel");
const Order = require("../Model/orderModel");

const placeOrder = async (req, res) => {
    try {
        const userId = req.user._id;
        const { paymentMethod } = req.body;

        const cart = await Cart.findOne({ user: userId }).populate('items.product');

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Your cart is empty' });
        }

        let totalPrice = 0;
        const orderItems = [];

        for (const item of cart.items) {
            const product = item.product;

            // Stock check
            if (product.countInStock < item.quantity) {
                return res.status(400).json({
                    message: `Product '${product.name}' is out of stock`
                });
            }

            // Decrease product stock
            product.countInStock -= item.quantity;
            await product.save();

            const itemTotal = product.price * item.quantity;
            totalPrice += itemTotal;

            orderItems.push({
                product: product._id,
                quantity: item.quantity,
                price: product.price
            });
        }

        const user = req.user;

        const order = new Order({
            user: userId,
            orderItems,
            shippingAddress: user.address,
            paymentMethod: paymentMethod || 'COD',
            totalPrice
        });

        await order.save();

        // Clear user's cart
        await Cart.findOneAndDelete({ user: userId });

        return res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            order
        });

    } catch (error) {
        console.error('Error placing order:', error);
        return res.status(500).json({ message: 'Server error while placing order', error });
    }
};
