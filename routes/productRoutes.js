const {
    getProducts,
    updateProduct,
    createProduct,
    deleteProduct
} = require("../controllers/productController");

const upload = require("../middlewares/upload");
const { createProduct } = require("../controllers/productController");

const express = require("express");

const router = express.Router();

router.get("/", getProducts);

router.put("/:id", updateProduct);

router.delete("/:id", deleteProduct);

router.delete("/:id", deleteProduct);
module.exports = router;

router.post(
    "/",
  upload.array("images", 5),
    createProduct
);