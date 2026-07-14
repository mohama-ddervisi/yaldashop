const authMiddleware = require("../middlewares/authMiddleware");
console.log("AUTH =", authMiddleware);
const express = require("express");

const router = express.Router();

const {

    createOrder,

    getOrders,

    updateOrderStatus,

    getOrder,

    getMyOrders

} = require("../controllers/orderController");

router.post("/", authMiddleware, createOrder);

router.get("/", getOrders);

router.get("/my", authMiddleware, getMyOrders);

router.get("/:id", authMiddleware, getOrder);

router.patch("/:id/status", updateOrderStatus);

module.exports = router;