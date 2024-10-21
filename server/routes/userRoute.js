const express = require('express');
const { test, updateUser, deleteUser } = require('../controllers/userController');
const verifyUser = require('../utils/verifyUser');

const router = express.Router();

router.get('/test', test);

router.put('/update/:id', verifyUser, updateUser);

router.delete('/delete/:id', verifyUser, deleteUser);

module.exports = router;