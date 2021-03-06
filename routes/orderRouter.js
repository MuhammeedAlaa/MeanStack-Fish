const express = require('express');
const router = express.Router();
const orderController = require('./../controllers/orderController');
const authController = require('./../controllers/authController');
router.patch('/sendorder', orderController.createOrder);
router.delete('/:id', orderController.deleteOrder);
router.get('/days', orderController.getDays);
router.get('/getorders', authController.protect, orderController.getAllUsers);
router.patch('/ordersent', authController.protect, orderController.sentOrder);

module.exports = router;
