const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync.js');

const {validateReview} = require("../middleware.js");

const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");




//Reviews
router.post("/",validateReview, wrapAsync(async(req,res) => {
  
  let selectedListing = await Listing.findById(req.params.id);
  
  let newReview = new Review(req.body.review);

  selectedListing.reviews.push(newReview);
  await newReview.save();
  await selectedListing.save();
  console.log("new review saved");
  req.flash("success", "Review added!");
  res.redirect(`/listings/${req.params.id}`);
}));

router.delete("/:reviewId", wrapAsync(async(req,res) => {
  let { id , reviewId} = req.params;
  await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
  await Review.findByIdAndDelete(reviewId);
  console.log("Review deleted");
   req.flash("error", "Review deleted!");
  res.redirect(`/listings/${id}`);
}))

module.exports = router;