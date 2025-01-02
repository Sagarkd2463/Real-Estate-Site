const Listing = require("../models/listingModel");
const errorHandler = require("../utils/error");

const createListing = async (req, res, next) => {
    try {
        const listing = await Listing.create(req.body);
        return res.status(201).json(listing);
    } catch (error) {
        next(error);
    }
};

const deleteListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);

        if (!listing) {
            return next(errorHandler(404, 'Listing not found!'));
        }

        if (req.user.id !== listing.userRef) {
            return next(errorHandler(401, 'You can only delete your own listings!'));
        }

        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Listing has been deleted!' });
    } catch (error) {
        next(error);
    }
};

const updateListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);

        if (!listing) {
            return next(errorHandler(404, 'Listing not found!'));
        }

        if (req.user.id !== listing.userRef) {
            return next(errorHandler(401, 'You can only update your own listings!'));
        }

        const updatedListing = await Listing.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json(updatedListing);
    } catch (error) {
        next(error);
    }
};

const getListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);

        if (!listing) {
            return next(errorHandler(404, 'Listing not found!'));
        }

        res.status(200).json(listing);
    } catch (error) {
        next(error);
    }
};

const getListings = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 9;
        const startIndex = parseInt(req.query.startIndex) || 0;

        const offer = req.query.offer === 'true' ? true : req.query.offer === 'false' ? false : { $in: [false, true] };
        const furnished = req.query.furnished === 'true' ? true : req.query.furnished === 'false' ? false : { $in: [false, true] };
        const parking = req.query.parking === 'true' ? true : req.query.parking === 'false' ? false : { $in: [false, true] };
        const type = req.query.type && req.query.type !== 'all' ? req.query.type : { $in: ['sale', 'rent'] };

        const searchTerm = req.query.searchTerm || '';
        const sort = req.query.sort || 'createdAt';
        const order = req.query.order === 'asc' ? 1 : -1;

        const listings = await Listing.find({
            name: { $regex: searchTerm, $options: 'i' },
            offer,
            furnished,
            parking,
            type
        })
            .sort({ [sort]: order })
            .limit(limit)
            .skip(startIndex);

        return res.status(200).json(listings);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createListing,
    deleteListing,
    updateListing,
    getListing,
    getListings
};