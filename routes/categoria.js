const express = require("express");
const router = express.Router();
const categoria = require("../controller/categoria");

router.get("/", categoria.getAllCategoria);
router.get("/:id", categoria.getCategoria);
router.post("/", categoria.addCategoria);
router.put("/:id", categoria.editCategoria);
router.delete("/:id", categoria.deleteCategoria);

module.exports = router;
