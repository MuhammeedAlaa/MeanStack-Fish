const express = require('express');
const authController = require('../controllers/authController');
const adminController = require('../controllers/adminContoller');
const orderController = require('../controllers/orderController');
const router = express.Router();
router.post('/address', orderController.createAddress);
router.patch('/addressupdate', orderController.updateAddress);
router.post('/login', authController.login);
router.patch(
  '/registration-token',
  authController.protect,
  adminController.setRegistrationToken
);
router.get('/admins', authController.protect, adminController.admin);
router.post('/signup', authController.protect, authController.signup);
router.patch('/updateMe', authController.protect, adminController.updateMe);
// get the history of notifications
router.get(
  '/notifications',
  authController.protect,
  adminController.getNotificationsHistory
);

module.exports = router;
