const express = require('express');
const {subCategoryCreate, subCategoryRead, subCategoryUpdate, subCategoryRemove, subCategoryList} = require('../controllers/subcategory.controller');
const router = express.Router();
const {authCheck, adminCheck} = require("../middlewares/auth.middleware");


router.post('/subcategory', authCheck, adminCheck, subCategoryCreate );
router.get('/subcategories',subCategoryList );
router.get('/subcategory/:slug', subCategoryRead );
router.put('/subcategory/:slug', authCheck, adminCheck, subCategoryUpdate );
router.delete('/subcategory/:slug', authCheck, adminCheck, subCategoryRemove );

module.exports = router;
