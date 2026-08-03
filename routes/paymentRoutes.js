const express = require("express");
const router = express.Router();

const {
    requestPayment,
    verifyPayment
} = require("../controllers/paymentController");

router.post("/request", requestPayment);

router.get("/verify", verifyPayment);

module.exports = router;