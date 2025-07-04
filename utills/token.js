const jwt = require("jsonwebtoken");

const generateToken = async (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
    return token;
}

module.exports = {
    generateToken
}