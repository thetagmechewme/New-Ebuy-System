const express = require('express');
const router = express.Router();
const {authCheck, adminCheck} = require("../middlewares/auth.middleware");
const { uploadImage, removeImage } = require('../controllers/cloudinary.controller');

router.post('/uploadimages', authCheck, adminCheck, uploadImage);
router.post('/removeimages', authCheck, adminCheck, removeImage);

module.exports = router;
