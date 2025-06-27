const mongoose = require("mongoose");

const Connection = async () => {
    const URL = "mongodb://127.0.0.1:27017/ES_Database"
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Database Connected Successfully!");
    } catch (error) {
        console.log("Error whine Connection", error)
    }
}
module.exports = Connection