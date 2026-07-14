const express = require("express");

const router = express.Router();

const {

    getDiscounts,
    createDiscount,
    updateDiscount,
    applyDiscount

} = require("../controllers/discountController");

router.get("/", getDiscounts);

router.post("/", createDiscount);
router.post("/apply", applyDiscount);
module.exports = router;