const Listing = require("../models/listing");


//Index
  module.exports.index = async (req , res) => {
    try {
    let allListings = await Listing.find({});
    
      
        res.render("listings/index.ejs", { allListings });
    } catch(err) {
        console.log(err);
        res.send("error occured while getting data from the database");
    }
    
  };



//new 
  module.exports.newGet = async (req , res) => {
    
    try{
        res.render("listings/new.ejs")
    }catch(error) {
      console.log(error);
    }

  };

  module.exports.newPost = async (req, res, next) => {
      
      const newListing = new Listing(req.body.listing);
      console.log(req.user);
      newListing.owner = req.user._id;
      await newListing.save();
      req.flash("success", " New Listing Created!");
      res.redirect("/listings");
  };

//show

module.exports.show = async (req , res) => {
  let { id } = req.params;
  console.log(id);
let selectedListing = await Listing.findById(id)
                                  .populate({path:"reviews",populate:{
                                    path:"writer"
                                  }})
                                  .populate("owner");
  if(selectedListing){
    console.log(selectedListing);
    res.render("listings/show.ejs", { selectedListing });
    console.log(selectedListing);
  } else{
    req.flash("error","Listing does not exists!!");
    res.redirect("/listings")
  }
  
};

//edit

module.exports.edit = async (req , res) => {

  let { id } = req.params;
  let selectedListing = await Listing.findById(id).populate('owner');
  console.log(selectedListing);
  if(selectedListing.owner.username == req.user.username){
    res.render("listings/edit.ejs" , { selectedListing });
  }else{
    req.flash("error","You are not authorized to edit that listing!");
    res.redirect("/listings");
  }
};

//update

module.exports.update = async (req , res) => {
  console.log("req received");
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id , {...req.body.listing});
  req.flash("success", "Listing updated!")
  res.redirect(`/listings/${id}`)
};

//delete

module.exports.delete = async (req,res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("warning","Listing Deleted!")
  res.redirect("/listings")
};