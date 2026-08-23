const express = require("express");
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const listingController = require("../controllers/listings.js");

const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");




//Index route

router.get("/" , wrapAsync(listingController.index));

//new route

router.get("/new",isLoggedIn, listingController.newGet)

router.post("/",validateListing, wrapAsync(listingController.newPost));

//show route
router.get("/:id", wrapAsync(listingController.show));

//edit route

router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.edit));

//update route

router.put("/:id",isLoggedIn,isOwner,validateListing, wrapAsync(listingController.update));

//Delete route
router.delete("/:id",isLoggedIn,isOwner, wrapAsync(listingController.delete));


module.exports = router;