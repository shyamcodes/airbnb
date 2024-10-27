const express = require("express");
const router = express.Router({ mergeParams: true });  //(kuch parameter jo parent ke under use hon sakte hai udhar hame merparams true )
const wrapAsync = require('../utils/wrapAsync.js');
// const Review = require('../models/review.js');
// const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn,isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");


//Post route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

//delete route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview))

module.exports = router;