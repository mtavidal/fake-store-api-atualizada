const express = require("express");
const router = express.Router();
const auth = require("../controller/auth");
const isAuthenticated = require("../helpers/authenticate");

router.post("/login", auth.login);
router.get("/check", isAuthenticated, auth.check);

module.exports = router;
