const express = require('express')
const router = express.Router()
const cart = require('../controller/cart')
const isAuthenticated = require("../helpers/authenticate");

router.get('/', isAuthenticated, cart.getAllCarts)
router.get('/:id', isAuthenticated, cart.getSingleCart)
router.get('/user/:userid', isAuthenticated, cart.getCartsbyUserid)

router.post('/', isAuthenticated, cart.addCart)
//router.post('/:id',cart.addtoCart)

router.put('/:id', isAuthenticated, cart.editCart)
router.patch('/:id', isAuthenticated, cart.editCart)
router.delete('/:id', isAuthenticated, cart.deleteCart)

module.exports = router
