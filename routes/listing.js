const express = require("express");
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const listingController = require("../controllers/listings.js");

const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

//new Form
router.get("/new",isLoggedIn, wrapAsync(listingController.newGet));

//edit route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.edit));

router.route("/")
    //Index route
  .get( wrapAsync(listingController.index))
    //new route
  .post(isLoggedIn,validateListing, wrapAsync(listingController.newPost));

router.route("/:id")
  //show route
  .get( wrapAsync(listingController.show))
  //update route
  .put(isLoggedIn,isOwner,validateListing, wrapAsync(listingController.update))
  //delete route
  .delete(isLoggedIn,isOwner, wrapAsync(listingController.delete))







module.exports = router;