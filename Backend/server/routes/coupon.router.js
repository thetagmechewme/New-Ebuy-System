const express = require ('express');
const router = express.Router();
const { authCheck, adminCheck } = require('../middlewares/auth.middleware');
const { createCoupon, removeCoupon, listCoupon }  = require('../controllers/coupon.controller');

router.post('/coupon', authCheck, adminCheck, createCoupon);
router.get('/coupons', listCoupon);
router.delete('/coupon/:couponId', authCheck, adminCheck, removeCoupon);

module.exports = router;
