const express = require("express");
const router = express.Router();
const categoria = require("../controller/categoria");
const isAuthenticated = require("../helpers/authenticate");

router.get("/", categoria.getAllCategoria);
router.get("/:id", categoria.getCategoria);
router.post("/", isAuthenticated, categoria.addCategoria);
router.put("/:id", isAuthenticated, categoria.editCategoria);
router.delete("/:id", isAuthenticated, categoria.deleteCategoria);

module.exports = router;
