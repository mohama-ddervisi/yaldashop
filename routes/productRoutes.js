const upload = require("../middlewares/upload");
const { createProduct } = require("../controllers/productController");

const express = require("express");

const router = express.Router();

const {

    getProducts,
    updateProduct

} = require("../controllers/productController");

router.get("/", getProducts);

router.put("/:id", updateProduct);

module.exports = router;

router.post(
    "/",
  upload.array("images", 5),
    createProduct
);