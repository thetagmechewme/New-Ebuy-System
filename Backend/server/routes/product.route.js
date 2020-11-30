const express = require('express');
const {
    createProduct,
    listAllProducts,
    removeProduct,
    readProduct,
    updateProduct,
    listProducts,
    productCount,
    productStar,
    listRelated,
    searchFilters,
} = require('../controllers/product.controller');
const router = express.Router();
const {authCheck, adminCheck} = require('../middlewares/auth.middleware');

router.post('/product', authCheck, adminCheck, createProduct);
router.get('/products/total', productCount);
router.get('/products/:count', listAllProducts);
router.delete('/product/:slug', authCheck, adminCheck, removeProduct);
router.get('/product/:slug', readProduct);
router.put('/product/:slug', authCheck, adminCheck, updateProduct);
router.post('/products', listProducts);
router.put('/product/star/:productId', authCheck, productStar);
router.get('/product/related/:productId', listRelated);
router.post('/search/filters', searchFilters);

module.exports = router;
