const express = require('express');
const router = express.Router();
const {authCheck} = require('../middlewares/auth.middleware');
const {
    userCart,
    getUserCart,
    emptyCart,
    saveAddress,
    applyCouponToUserCart,
    createOrder,
    orders,
    addToWishList,
    wishlist,
    removeFromWishlist,
    createCashOrder,
} = require('../controllers/user.controller');

/*router.get('/user',(req, res) => {
    res.status(200).json({Message: 'Welcome new User!'});
});*/
router.post('/user/cart', authCheck, userCart); //Save cart
router.get('/user/cart', authCheck, getUserCart); //Get cart
router.delete('/user/cart', authCheck, emptyCart); //Empty cart
router.post('/user/address', authCheck, saveAddress);
router.post('/user/order', authCheck, createOrder);
router.post('/user/cash-order', authCheck, createCashOrder); //Cash on Delivery
router.get('/user/orders', authCheck, orders);
router.post('/user/cart/coupon', authCheck, applyCouponToUserCart); //Coupon
router.post('/user/wishlist', authCheck, addToWishList); //Add wishlist
router.get('/user/wishlist', authCheck, wishlist); //View wishlist
router.put('/user/wishlist/:productId', authCheck, removeFromWishlist); //Remove wishlist

module.exports = router;
