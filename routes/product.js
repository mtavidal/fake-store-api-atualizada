const express = require("express");
const router = express.Router();
const product = require("../controller/product");
const isAuthenticated = require("../helpers/authenticate");

router.get("/", product.getAllProducts);
router.get("/categories", product.getProductCategories);
router.get("/category/:category", product.getProductsInCategory);
router.get("/:id", product.getProduct);
router.post("/", isAuthenticated, product.addProduct);
router.put("/:id", isAuthenticated, product.editProduct);
router.patch("/:id", isAuthenticated, product.editProduct);
router.delete("/:id", isAuthenticated, product.deleteProduct);

module.exports = router;