const express = require('express');
const { test, updateUser } = require('../controllers/userController');
const verifyUser = require('../utils/verifyUser');

const router = express.Router();

router.get('/test', test);

router.post('/update/:id', verifyUser, updateUser);

module.exports = router;