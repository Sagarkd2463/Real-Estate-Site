const express = require('express');
const { signup, signin, google, facebook, github, signout } = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signup);

router.post('/signin', signin);

router.post('/google', google);

router.post('/facebook', facebook);

router.post('/github', github);

router.get('/signout', signout);

module.exports = router;
