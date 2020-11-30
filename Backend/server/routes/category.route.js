const express = require('express');
const {categoryCreate, categoryRead, categoryUpdate, categoryRemove, categoryList, getSubcategories} = require('../controllers/category.controller');
const router = express.Router();
const {authCheck, adminCheck} = require('../middlewares/auth.middleware');


router.post('/category', authCheck, adminCheck, categoryCreate );
router.get('/categories',categoryList );
router.get('/category/:slug', categoryRead );
router.put('/category/:slug', authCheck, adminCheck, categoryUpdate );
router.delete('/category/:slug', authCheck, adminCheck, categoryRemove );
router.get('/category/subcategories/:_id', getSubcategories);

module.exports = router;
