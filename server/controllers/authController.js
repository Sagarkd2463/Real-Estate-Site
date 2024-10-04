const User = require('../models/userModel');
const bcryptjs = require('bcryptjs');
const errorHandler = require('../utils/error');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User({ username, email, password: hashedPassword });

    try {
        await newUser.save();
        res.status(201).json("User created successfully!!!");
    } catch (error) {
        next(error);
    }
};

const signin = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const validUser = await User.findOne({ email });
        if (!validUser) return next(errorHandler(404, "Unauthorize User", "User not found!"));

        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) return next(errorHandler(404, "Unauthorize User", "Password was incorrect!"));

        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
        const { password: pass, ...userinfo } = validUser._doc;

        res.cookie('access_token', token, { httpOnly: true }).status(200).json(userinfo);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    signin,
    signup,
};