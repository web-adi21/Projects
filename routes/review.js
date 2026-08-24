const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync.js');
const reviewController = require("../controllers/reviews.js");

const {validateReview, isLoggedIn, isReviewWriter} = require("../middleware.js");






//Reviews
router.post("/",isLoggedIn,validateReview, wrapAsync(reviewController.post));

router.delete("/:reviewId",isLoggedIn,isReviewWriter, wrapAsync(reviewController.delete))

module.exports = router;