const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync.js');

const {validateReview, isLoggedIn, isReviewWriter} = require("../middleware.js");

const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");




//Reviews
router.post("/",isLoggedIn,validateReview, wrapAsync(async(req,res) => {
   
  let {id} = req.params;

  let selectedListing = await Listing.findById(id);
  console.log(id);
  
  let newReview = new Review(req.body.review);
  
    newReview.writer = req.user._id;
    selectedListing.reviews.push(newReview);
    await newReview.save();
    await selectedListing.save();
    console.log("new review saved");
    req.flash("success", "Review added!");
    res.redirect(`/listings/${id}`);
  
  

  
}));

router.delete("/:reviewId",isLoggedIn,isReviewWriter, wrapAsync(async(req,res) => {
  
  let { id , reviewId} = req.params;

  await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
  await Review.findByIdAndDelete(reviewId);
  console.log("Review deleted");
   req.flash("error", "Review deleted!");
  res.redirect(`/listings/${id}`);
}))

module.exports = router;