const Listing = require("../models/listing");
const Review = require("../models/review");


//REVIEWS ROUTE
module.exports.reviews = async (req, res, next) => {
    // console.log("req.user =>", req.user)
    const { id } = req.params;
    let listing = await Listing.findById(id);
    let review = req.body.review;

    let newReview = new Review(review);

    newReview.author = req.user._id;

    // console.log("NEW REVIEW =>", newReview)

    listing.reviews.push(newReview);

    console.log(await newReview.save());
    console.log(await listing.save());

    req.flash("success", "Review Created !!!");

    res.redirect("/listings/"+id);
}


//DELETE REVIEW ROUTE
module.exports.deleteReview = async (req, res, next) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review Deleted !!!");

    res.redirect("/listings/" + id);

}