const express = require("express");
const router = express.Router({mergeParams: true});

//===================================================================================================

const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const Review = require("../models/review");
const reviewSchema = require("../schema/reviewSchema");
const { isLoggedIn } = require("../middlewares");
const { isReviewAuthor } = require("../middlewares");

const reviewController = require("../controllers/reviews");

//===================================================================================================

const validateReview = (req, res, next) => {
    let schemaValidationResult = reviewSchema.validate(req.body);
    console.log("schemaValidationResult[Review] =>", schemaValidationResult);
    if (schemaValidationResult.error) { throw new ExpressError(400, schemaValidationResult.error) }
    else { next() }
}


//===================================================================================================

//REVIEWS ROUTE
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.reviews));

//DELETE REVIEW ROUTE
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.deleteReview));

//===================================================================================================

module.exports = router;