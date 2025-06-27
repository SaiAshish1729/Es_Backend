const jwt = require("jsonwebtoken");
const User = require("../Model/userModel");

const Authentication = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(400).send({ status: 400, message: "Unauthorized! Please provide token" });
        }
        const tokenParts = token.split(" ");
        if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
            return res.status(400).send({ status: 400, message: "Invalid token format! Expected 'Bearer <token>'" });
        }

        const tokenWithoutBearer = tokenParts[1];

        // Verify the token
        const verifytoken = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);

        const rootUser = await User.findOne({ _id: verifytoken.userId }).select("-password");
        if (!rootUser) {
            return res.status(404).json({ message: "Access denied.User not found while authentication." })
        }

        req.token = tokenWithoutBearer;
        req.user = rootUser;
        req.userId = rootUser._id;

        next();

    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Error occured authentication.", error });
    }
}

const adminAuth = async (req, res, next) => {
    try {
        if (req.user && req.user.role === 'admin') {
            next();
        } else {
            res.status(401).send({ message: "Not authorized as an admin." });
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    Authentication,
    adminAuth
}