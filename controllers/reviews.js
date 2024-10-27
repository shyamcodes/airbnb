const Review = require('../models/review');
const Listing = require("../models/listing");

module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newRewiew = new Review(req.body.review);
    newRewiew.author = req.user._id;
    console.log(newRewiew)
    listing.reviews.push(newRewiew);

    await newRewiew.save();
    await listing.save();
    req.flash("success", "New Review Created!")

    // console.log('new review saved')
    res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Created!")

    res.redirect(`/listings/${id}`);
};