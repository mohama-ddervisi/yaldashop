const express = require("express");
const cors = require("cors");
require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

app.set("io", io);

io.on("connection", (socket) => {
    console.log("SOCKET CONNECTED:", socket.id);

    socket.on("disconnect", () => {
        console.log("SOCKET DISCONNECTED:", socket.id);
    });
});

app.use((req, res, next) => {
    console.log("REQUEST:", req.method, req.url);
    next();
});

const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const adminProductRoutes = require("./routes/adminProductRoutes");
const discountRoutes = require("./routes/discountRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");
const authRoutes = require("./routes/authRoutes");
const contactRoutes = require("./routes/contactRoutes");
const userRoutes = require("./routes/userRoutes");



app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/uploads", express.static("uploads"));
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/auth", authRoutes);
app.use("/contact", contactRoutes);
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
    console.log("ADMIN ROUTE HIT");
    res.render("admin/dashboard");
});

app.get("/admin/messages", async (req, res) => {

    try {

        const prisma = require("./lib/prisma");

        const messages = await prisma.contactMessage.findMany({

            orderBy: {
                createdAt: "desc"
            }

        });

        res.render("admin/messages", { messages });

    }

    catch (error) {

        console.error(error);
        res.status(500).send("خطا در بارگذاری پیام‌ها");

    }

});

if (process.env.VERCEL !== "1") {
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
const multer = require("multer");

app.use((err, req, res, next) => {
    console.error("GLOBAL ERROR:", err);

    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            success: false,
            message: err.code === "LIMIT_FILE_SIZE"
                ? "حجم عکس بیش از حد مجاز است."
                : err.message
        });
    }

    res.status(500).json({
        success: false,
        message: err.message || "خطای ناشناخته"
    });
});
module.exports = app;