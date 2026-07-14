const express = require("express");
const cors = require("cors");
require("dotenv").config();

const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const adminProductRoutes = require("./routes/adminProductRoutes");
const discountRoutes = require("./routes/discountRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use((req, res, next) => {
    console.log("REQUEST:", req.method, req.url);
    next();
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/uploads", express.static("uploads"));
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/auth", authRoutes);
app.use("/admin/products", (req, res, next) => {
    console.log("SERVER:", req.method, req.url);
    next();
});

app.use("/admin/products", adminProductRoutes);

app.use("/discounts", discountRoutes);
app.use("/checkout", checkoutRoutes);

app.get("/", (req, res) => {
  console.log("Home route visited");
  res.send("Yalda Shop Server Works!");
});

const PORT = 3000;
app.use((err, req, res, next) => {
    console.error("GLOBAL ERROR:");
    console.error(err);

    res.status(500).json({
        success: false,
        message: err.message
    });
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});