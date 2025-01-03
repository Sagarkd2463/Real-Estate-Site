const express = require('express');
const { createListing, deleteListing, updateListing, getListing, getListings } = require('../controllers/listingController');
const verifyToken = require('../utils/verifyUser');

const router = express.Router();

router.post('/create', verifyToken, createListing);

router.get('/get/:id', getListing);

router.get('/get', getListings);

router.patch('/update/:id', verifyToken, updateListing);

router.delete('/delete/:id', verifyToken, deleteListing);

module.exports = router;