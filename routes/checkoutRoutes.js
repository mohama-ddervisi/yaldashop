const express = require("express");

const router = express.Router();

const {

    getCheckout

} = require("../controllers/checkoutController");

router.get("/", getCheckout);

module.exports = router;