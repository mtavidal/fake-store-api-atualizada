const express = require('express')
const router = express.Router()
const user = require('../controller/user')
const isAuthenticated = require("../helpers/authenticate");

router.get('/', isAuthenticated, user.getAllUser)
router.get('/:id', isAuthenticated, user.getUser)
router.post('/', user.addUser)
router.put('/:id', isAuthenticated, user.editUser)
router.patch('/:id', isAuthenticated, user.editUser)
router.delete('/:id', isAuthenticated, user.deleteUser)

module.exports = router