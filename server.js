require('dotenv').config({ path: `${process.cwd()}/.env` });
const express = require("express");
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const PORT = process.env.APP_PORT || 5167;
const categoryRoutes = require("./Routes/categoryRoute");
const userRoutes = require("./Routes/userRoutes");
const productRoutes = require("./Routes/productsRoute");

const Connection = require("./DB/Connection");

// middlewares
const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(morgan("tiny"))
app.use(cors());

app.get("", (req, res) => {
    res.send("Hello")
});

// Routes
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product", productRoutes);

Connection().then(() => {
    app.listen(PORT, () => {
        console.log(`Listening at http://localhost:${PORT}`);
    });
});