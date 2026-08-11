const express = require("express");
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const {listingSchema, reviewSchema} = require("../schema.js");
const ExpressError = require('../utils/ExpressError.js');
const Listing = require("../models/listing.js");


const validateListing = (req,res,next) => {
   let {error} = listingSchema.validate(req.body);
     if(error) {
       let errMsg = error.details.map((el) => el.message).join(",")
       throw new ExpressError(400, errMsg);
     } else {
       next();
     }
 }


//Index route

router.get("/" , wrapAsync(async (req , res) => {
  try {
  let allListings = await Listing.find({});

      res.render("listings/index.ejs", { allListings });
  } catch(err) {
      console.log(err);
      res.send("error occured while getting data from the database");
  }
  
}));

//new route

router.get("/listings/new", (req , res) => {
 try{
    res.render("new.ejs")
 }catch(error) {
  console.log(error);
 }
})

router.post("/listings",validateListing, wrapAsync(async (req, res, next) => {
    
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

//show route
router.get("/listings/:id", wrapAsync(async (req , res) => {
  let { id } = req.params;
  console.log(id);
let selectedListing = await Listing.findById(id).populate("reviews");
  console.log(selectedListing);
  res.render("show.ejs", { selectedListing });
}));

//edit route

router.get("/listings/:id/edit", wrapAsync(async (req , res) => {
  let { id } = req.params;
  let selectedListing = await Listing.findById(id);

  res.render("edit.ejs" , { selectedListing })
}));

router.put("/listings/:id",validateListing, wrapAsync(async (req , res) => {
  console.log("req received");
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id , {...req.body.listing});
  res.redirect(`/listings/${id}`)
}));

//Delete route
router.delete("/listings/:id", wrapAsync(async (req,res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
 
  res.redirect("/listings")
}));


module.exports = router;