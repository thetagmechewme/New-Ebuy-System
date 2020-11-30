const express = require('express');
const router = express.Router();
const { auth } = require('../firebase/index.fb')
const { authCheck, adminCheck } = require('../middlewares/auth.middleware');
const {orders, orderStatus} = require('../controllers/admin.controller');

router.get('/admin/orders', authCheck, adminCheck, orders);
router.put('/admin/order-status', authCheck, adminCheck, orderStatus);

module.exports = router;
