const User = require("../models/userModel");
const Listing = require("../models/listingModel");
const errorHandler = require("../utils/error");
const bcryptjs = require('bcryptjs');


const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return next(errorHandler(401, "Unauthorized User"));
    }

    try {
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                gender: req.body.gender,
                avatar: req.body.avatar,
            },
        }, { new: true });

        const { password, ...userInfo } = updatedUser._doc;

        res.status(200).json(userInfo);
    } catch (error) {
        next(error.message);
    }
};

const deleteUser = async (req, res, next) => {

    if (req.user.id !== req.params.id) {
        return next(errorHandler(401, "Only delete your own account!!"));
    }

    try {
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie('access_token');
        res.status(200).json('User has been deleted!');
    } catch (error) {
        next(error.message);
    }
};

const getUserListings = async (req, res, next) => {

    if (req.user.id === req.params.id) {
        try {

            const listings = await Listing.find({ userRef: req.params.id });
            res.status(200).json(listings);
        } catch (error) {
            next(error.message);
        }
    } else {
        return next(errorHandler(401, 'You can only view your own listings!'));
    }
};

const getUser = async (req, res, next) => {

    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return next(errorHandler(404, 'User not found!'));
        }

        const { password: pass, ...userinfo } = user._doc;

        res.status(200).json(userinfo);
    } catch (error) {
        next(error.message);
    }
};

module.exports = {
    updateUser,
    deleteUser,
    getUserListings,
    getUser
};