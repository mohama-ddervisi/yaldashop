const express = require("express");
const router = express.Router();

const upload = require("../middlewares/upload");

const {
    getProducts
} = require("../controllers/adminProductController");

const {
    createProduct,
    updateProduct,
    deleteProduct,
    deleteProductImage
} = require("../controllers/productController");

router.get("/", getProducts);

router.post("/", (req, res, next) => {
    console.log("POST HIT");
    next();
},
upload.array("images", 5),
createProduct
);


router.put(
    "/:id",
    upload.array("images", 5),
    updateProduct
);

router.delete(

    "/:id",

    deleteProduct

);
router.delete(

    "/image/:id",

    deleteProductImage

);
router.post("/", (req, res, next) => {
    console.log("POST HIT");

    next();

},
(req, res, next) => {

    console.log("AFTER POST HIT");

    next();

},

upload.array("images", 5),

(req, res, next) => {

    console.log("AFTER UPLOAD");

    next();

},

createProduct
);
module.exports = router;