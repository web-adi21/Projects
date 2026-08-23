const express = require("express");
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');

const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");




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

router.get("/new",isLoggedIn, (req , res) => {
  
  try{
      res.render("new.ejs")
  }catch(error) {
    console.log(error);
  }

})

router.post("/",validateListing, wrapAsync(async (req, res, next) => {
    
    const newListing = new Listing(req.body.listing);
    console.log(req.user);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", " New Listing Created!");
    res.redirect("/listings");
}));

//show route
router.get("/:id", wrapAsync(async (req , res) => {
  let { id } = req.params;
  console.log(id);
let selectedListing = await Listing.findById(id).populate("reviews").populate("owner");
  if(selectedListing){
    console.log(selectedListing);
    res.render("show.ejs", { selectedListing });
    console.log(selectedListing);
  } else{
    req.flash("error","Listing does not exists!!");
    res.redirect("/listings")
  }
  
}));

//edit route

router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(async (req , res) => {

  let { id } = req.params;
  let selectedListing = await Listing.findById(id);
  if(selectedListing.owner.username == req.user.username){
    res.render("edit.ejs" , { selectedListing });
  }else{
    req.flash("error","You are not authorized to edit that listing!");
    res.redirect("/listings");
  }
  

  
}));

//update route

router.put("/:id",isLoggedIn,isOwner,validateListing, wrapAsync(async (req , res) => {
  console.log("req received");
  let { id } = req.params;
 
  await Listing.findByIdAndUpdate(id , {...req.body.listing});
  req.flash("success", "Listing updated!")
  res.redirect(`/listings/${id}`)
}));

//Delete route
router.delete("/:id",isLoggedIn,isOwner, wrapAsync(async (req,res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("warning","Listing Deleted!")
 
  res.redirect("/listings")
}));


module.exports = router;