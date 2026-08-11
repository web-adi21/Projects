const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require('path');
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate")
const wrapAsync = require('./utils/wrapAsync.js')
const ExpressError = require('./utils/ExpressError.js');
const {listingSchema, reviewSchema} = require("./schema.js");
const Review = require("./models/reviews.js");

const listings = require("./routes/listing.js");


main()
  .then(() => {
    console.log("connection succesfully established"); 
  })
  .catch((err) => {
    console.log(err);
  })

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}; 

 
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);

  

 const validateReview = (req,res,next) => {
   let {error} = reviewSchema.validate(req.body);
     if(error) {
       let errMsg = error.details.map((el) => el.message).join(",")
       throw new ExpressError(400, errMsg);
     } else {
       next();
     }
 }

app.get("/", (req, res) => {
  res.send("this is root");
})

app.use("/listings", listings);

//Reviews
app.post("/listings/:id/reviews",validateReview, wrapAsync(async(req,res) => {
  let selectedListing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);

  selectedListing.reviews.push(newReview);
  await newReview.save();
  await selectedListing.save();
  console.log("new review saved");
  res.redirect(`/listings/${req.params.id}`);
}));

app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async(req,res) => {
  let { id , reviewId} = req.params;
  await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
  await Review.findByIdAndDelete(reviewId);
  console.log("Review deleted");

  res.redirect(`/listings/${id}`);
}))








app.all("*", (req,res,next) => {
  next(new ExpressError(404, 'Page not found!'));
});

app.use((err,req,res,next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render('error.ejs', {message});
})




app.listen(3000, () => {
  console.log("server is listening on port 3000");
})