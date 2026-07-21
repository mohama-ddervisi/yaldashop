const { printInvoice } = require("../controllers/invoiceController");
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

router.post("/", createOrder);

router.get("/", getOrders);

router.get("/my", authMiddleware, getMyOrders);

router.get("/:id/invoice", printInvoice);

router.get("/:id", getOrder);

router.patch("/:id/status", updateOrderStatus);



module.exports = router;