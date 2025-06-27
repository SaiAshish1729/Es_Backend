require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require("../Model/userModel");

const Connection = require('../DB/Connection');

const seedAdmin = async () => {
    try {
        Connection();

        const hashedPassword = await bcrypt.hash(process.env.ADMIN_EMAIL, 10);

        const admin = User({
            name: 'Super Admin',
            email: 'admin@example.com',
            password: hashedPassword,
            role: 'admin',
        });

        await admin.save();
        console.log("Admin created successfully ✅");
        process.exit(0);
    } catch (error) {
        console.error("❌ Failed to create admin:", error);
        process.exit(1);
    }
};

seedAdmin();
module.exports = seedAdmin
