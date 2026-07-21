
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
const userRoutes = require("./routes/userRoutes");
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
app.use("/users", userRoutes);
const path = require("path");

app.use("/admin/products", (req, res, next) => {
    console.log("SERVER:", req.method, req.url);
    next();
});
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use("/admin/products", adminProductRoutes);

app.use("/discounts", discountRoutes);
app.use("/checkout", checkoutRoutes);
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});


const PORT = process.env.PORT || 3000;

app.use((err, req, res, next) => {
    console.error("GLOBAL ERROR:");
    console.error(err);

    res.status(500).json({
        success: false,
        message: err.message
    });
});
app.get("/admin", (req, res) => {
    res.render("admin/dashboard");
});

app.get("/admin", (req, res) => {
    console.log("ADMIN ROUTE HIT");
    res.render("admin/dashboard");
});
if (process.env.VERCEL !== "1") {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = app; 