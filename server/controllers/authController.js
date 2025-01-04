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

const oauthHandler = async (req, res, next, platform) => {
    try {
        const { name, email, photo } = req.body;

        if (!name || !email || !photo) {
            return next(errorHandler(400, "Invalid Request", "Missing required fields: name, email, or photo."));
        }

        let existingUser = await User.findOne({ email });

        if (existingUser) {
            const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
            const { password: pass, ...userinfo } = existingUser._doc;

            return res
                .cookie('access_token', token, { httpOnly: true })
                .status(200)
                .json(userinfo);
        }

        // Generate a secure password for new users
        const generatedPassword = `${Math.random().toString(36).slice(-8)}${Math.random().toString(36).slice(-8)}`;
        const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

        const usernameBase = name.split(" ").join("").toLowerCase();
        const uniqueUsername = `${usernameBase}${Math.random().toString(36).slice(-4)}`;

        const newUser = new User({
            username: uniqueUsername,
            email,
            password: hashedPassword,
            avatar: photo,
        });

        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        const { password: pass, ...userinfo } = newUser._doc;

        res
            .cookie('access_token', token, { httpOnly: true })
            .status(200)
            .json(userinfo);
    } catch (error) {
        console.error(`${platform} OAuth Handler Error:`, error.message);
        next(errorHandler(500, "Server Error", `Failed to process ${platform} OAuth login.`));
    }
};

const google = async (req, res, next) => {
    await oauthHandler(req, res, next, "Google");
};

const facebook = async (req, res, next) => {
    await oauthHandler(req, res, next, "Facebook");
};

const github = async (req, res, next) => {
    await oauthHandler(req, res, next, "GitHub");
};

const signout = async (req, res, next) => {
    try {
        res.clearCookie('access_token');
        res.status(200).json('User has been logged out!!');
    } catch (error) {
        next(error);
    }
};

module.exports = {
    signin,
    signup,
    google,
    facebook,
    github,
    signout,
};