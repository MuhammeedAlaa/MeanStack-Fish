const express = require('express');
const router = express.Router();
const authController = require('./../controllers/authController');
const fishController = require('./../controllers/fishController');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, 'public/assets');
  },
  filename: (req, file, callBack) => {
    callBack(null, `fishes/${Date.now()}${file.originalname}`);
  }
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024, fieldSize: 20 * 1024 * 1024 } //max 2 MB
});

router.get('/user', fishController.getFishes);
router.get('/fish/:id', authController.protect, fishController.getFisheId);
router.get('/', authController.protect, fishController.getFishes);
router.delete('/:id', authController.protect, fishController.deleteFish);
router.delete('/', authController.protect, fishController.deleteAllFish);
router.patch(
  '/:id',
  upload.single('file'),
  authController.protect,
  fishController.updateFish
);
router.get('/amounts', authController.protect, fishController.getAmounts);
router.post(
  '/',
  upload.single('file'),
  authController.protect,
  fishController.addFish
);
module.exports = router;
