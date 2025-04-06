const express = require("express");
const router = express.Router();

//===================================================================================================

const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
// const Listing = require("../models/listing");
const listingSchema = require("../schema/listingSchema");
const { isLoggedIn } = require("../middlewares");
const { isOwnwer } = require("../middlewares");

const listingController = require("../controllers/listings");

//===================================================================================================

const multer = require("multer");

const {cloudinary} = require("../cloudconfig");
const {storage} = require("../cloudconfig");

const upload = multer({ storage: storage });


//===================================================================================================

const validateListing = (req, res, next) => {
    let schemaValidationResult = listingSchema.validate(req.body);
    console.log("schemaValidationResult[Listing] =>", schemaValidationResult);
    if (schemaValidationResult.error) { throw new ExpressError(400, schemaValidationResult.error) }
    else { next() }
}

//===================================================================================================

//INDEX ROUTE
router.get("/", wrapAsync(listingController.index));

//NEW ROUTE
router.get("/new", isLoggedIn, wrapAsync(listingController.new));

//SHOW ROUTE
router.get("/:id", wrapAsync(listingController.show));

//CREATE ROUTE
router.post("/", isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(listingController.create));
// router.post("/", upload.single("listing[image]"), (req, res, next)=>{
//     console.log(req.file)
//     res.send(req.file)
// });

//EDIT ROUTE
router.get("/:id/edit", isLoggedIn, isOwnwer, wrapAsync(listingController.edit));

//UPDATE ROUTE
router.put("/:id", isLoggedIn, isOwnwer, upload.single("listing[image]"), validateListing, wrapAsync(listingController.update));

//DELETE ROUTE
router.delete("/:id", isLoggedIn, isOwnwer, wrapAsync(listingController.delete));

//===================================================================================================

module.exports = router;