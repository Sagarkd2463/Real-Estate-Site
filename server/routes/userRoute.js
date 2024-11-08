const express = require('express');
const { updateUser, deleteUser, getUserListings } = require('../controllers/userController');
const verifyToken = require('../utils/verifyUser');

const router = express.Router();

router.put('/update/:id', verifyToken, updateUser);

router.delete('/delete/:id', verifyToken, deleteUser);

router.get('/listings/:id', verifyToken, getUserListings);

module.exports = router;