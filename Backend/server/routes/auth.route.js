const {userCreateUpdate, currentUser} = require ("../controllers/auth.controller");
const express = require('express');
const {authCheck, adminCheck} = require("../middlewares/auth.middleware");
const router = express.Router();

router.post('/user-create-or-update', authCheck , userCreateUpdate);
router.post('/current-user', authCheck , currentUser);
router.post('/current-admin', authCheck , adminCheck , currentUser);

module.exports = router;
