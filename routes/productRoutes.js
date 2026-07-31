const express = require("express");
const router = express.Router();

const upload = require("../middlewares/upload");

const {
    getProducts,
    updateProduct,
    createProduct,
    deleteProduct
} = require("../controllers/productController");

router.get("/", getProducts);

router.post(
    "/",
    upload.array("images", 5),
    createProduct
);

router.put("/:id", updateProduct);

router.delete("/:id", deleteProduct);

module.exports = router;