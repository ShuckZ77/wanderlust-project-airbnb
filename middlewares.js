const Listing = require("./models/listing");
const Review = require("./models/review");

module.exports.isLoggedIn = async (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "Please Log In !!!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = async (req, res, next)=>{
    if(req.session.redirectUrl) res.locals.redirectUrl = req.session.redirectUrl;
    next();
}

module.exports.isOwnwer = async (req, res, next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    console.log("listing.owner >> ",listing.owner);
    console.log("req.user._id >> ",req.user._id);
    console.log(listing.owner.toString())
    console.log(req.user._id.toString())

    
    // AnotherMongoDocument._id.toString()
    // JSON.stringify(AnotherMongoDocument._id)
    // results.userId.equals(AnotherMongoDocument._id)


    if(listing.owner.equals(req.user._id)){
       return next();
    }else{
        req.flash("error", "You are not the owner of this listing")
        return res.redirect("/listings/"+id);
    }
    
}

module.exports.isReviewAuthor = async (req, res, next)=>{
    let { id, reviewId } = req.params;
    
    let review = await Review.findById(reviewId);

    if(review.author.equals(req.user._id)){
        return next();
    }

    req.flash("error", "You are not the author of this review !");
    return res.redirect("/listings/"+id);
}