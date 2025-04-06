const { model } = require("mongoose");
const Listing = require("../models/listing");

//INDEX ROUTE
module.exports.index = async (req, res, next)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings })
}

//NEW ROUTE
module.exports.new = async (req, res, next) => {
    // console.log("REQ.USER ==>>", req.user);
    // console.log("USER AUTHENTICATED ==>>", req.isAuthenticated())
    res.render("listings/new.ejs");
}

//SHOW ROUTE
module.exports.show = async (req, res) => {
    const { id } = req.params;
    const listingResponse = await Listing.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    }).populate("owner");

    console.log("listingResponse =>",listingResponse);
    
    if (listingResponse) {
        res.render("listings/show.ejs", { listing: listingResponse });
    } else {
        req.flash("error", "Listing You Requested Is Not Available !");
        res.redirect("/listings");  
    }   
      
}

//CREATE ROUTE
module.exports.create = async (req, res, next) => {
    const listing = req.body.listing;   
    const newListing = new Listing(listing);
    newListing.owner = req.user;

    newListing.image.filename = req.file.filename;
    newListing.image.url = req.file.path;  

    let createResponse = await newListing.save();
    if (createResponse) {
        req.flash("success", "Listing Created !!!");
        res.redirect("/listings");
    } else {
        req.flash("error", "Listing Creation Error");
        res.redirect("/listings");
    }
}

//EDIT ROUTE
module.exports.edit = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    listing.image.url = (listing.image.url).replace("upload/", "upload/c_fill,h_250,w_300/");

    res.render("listings/edit.ejs", { listing });
}

//UPDATE ROUTE
module.exports.update = async (req, res) => {
    const { id } = req.params;
    const updatedListing = req.body.listing;

    console.log("updatedListing=>", updatedListing)

    console.log("file",req.file);

    let updateResponse = await Listing.findByIdAndUpdate(id, updatedListing);
    console.log("updateResponse1", updateResponse);

    if(req.file){
        updateResponse.image.filename = req.file.filename;
        updateResponse.image.url = req.file.path;

        updateResponse.save();
    }
    
    console.log("updateResponse2", updateResponse);

    if (updateResponse) {
        req.flash("success", "Listing Updated !!!");
        res.redirect("/listings/" + id);
    } else {
        req.flash("error", "Listing Update Error");
        res.redirect("/listings/" + id);
    }
    
}

//DELETE ROUTE
module.exports.delete = async (req, res) => {
    const { id } = req.params;
    let deleteResponse = await Listing.findByIdAndDelete(id);
    if (deleteResponse) {
        req.flash("success", "Listing Deleted !!!");
        res.redirect("/listings");
    } else {
        req.flash("error", "Listing Delete Error");
        res.redirect("/listings");
    }
}


