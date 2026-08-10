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
const Review = require("./models/reviews.js")


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

 

app.get("/", (req, res) => {
  res.send("this is root");
})

//server side Validations

const validateListing = (req,res,next) => {
  let {error} = listingSchema.validate(req.body);
    if(error) {
      let errMsg = error.details.map((el) => el.message).join(",")
      throw new ExpressError(400, errMsg);
    } else {
      next();
    }
}

const validateReview = (req,res,next) => {
  let {error} = reviewSchema.validate(req.body);
    if(error) {
      let errMsg = error.details.map((el) => el.message).join(",")
      throw new ExpressError(400, errMsg);
    } else {
      next();
    }
}

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


//All listings route

app.get("/listings" , wrapAsync(async (req , res) => {
  try {
  let allListings = await Listing.find({});

      res.render("listings/index.ejs", { allListings });
  } catch(err) {
      console.log(err);
      res.send("error occured while getting data from the database");
  }
  
}));


//New listing route
app.get("/listings/new", (req , res) => {
 try{
    res.render("new.ejs")
 }catch(error) {
  console.log(error);
 }
})
 


app.post("/listings",validateListing, wrapAsync(async (req, res, next) => {
    
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

//edit route

app.get("/listings/:id/edit", wrapAsync(async (req , res) => {
  let { id } = req.params;
  let selectedListing = await Listing.findById(id);

  res.render("edit.ejs" , { selectedListing })
}));

app.put("/listings/:id",validateListing, wrapAsync(async (req , res) => {
  console.log("req received");
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id , {...req.body.listing});
  res.redirect(`/listings/${id}`)
}));


//Delete route
app.delete("/listings/:id", wrapAsync(async (req,res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings")
}));


//show route
app.get("/listings/:id", wrapAsync(async (req , res) => {
  let { id } = req.params;
  console.log(id);
  let selectedListing = await Listing.findById(id);
  console.log(selectedListing);
  res.render("show.ejs", { selectedListing });
}));

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