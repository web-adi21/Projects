const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({accessToken: mapToken});
const Category = require("../models/category.js")

//Index
module.exports.index = async (req, res) => {
    try {
        let query = {};
        
        
        const queryLocation = req.query.queryLocation; 
        
        
        if (queryLocation) {
            query.location = { $regex: queryLocation, $options: 'i' };
        }
        
        const queryCategory = req.query.category;
        if (queryCategory) {
    
        const categoryObj = await Category.findOne({ name: queryCategory });
    
    
        if (categoryObj) {
        query.category = categoryObj._id; 
        } else {
        query.category = null; 
        }
    }
        
        const allListings = await Listing.find(query);
        
       
        res.render("listings/index.ejs", { allListings });

    } catch (err) {
        console.log(err);
        res.send("An error occurred while getting data from the database.");
    }
};



//new 
  module.exports.newGet = async (req , res) => {
    
    try{

        const allCategories = await Category.find({});
        res.render("listings/new.ejs",{allCategories});
    }catch(error) {
      console.log(error);
      res.send("Error Loading The form");
    }

  };

  module.exports.newPost = async (req, res, next) => {

     let response = await geocodingClient.forwardGeocode({
     query: req.body.listing.location,
     limit: 1
   })
     .send();

     
     
     

      let url = req.file.path;
      let filename = req.file.filename;
      console.log(url,"...",filename)
      const newListing = new Listing(req.body.listing);
      console.log(req.user);
      newListing.owner = req.user._id;
      newListing.image = {url , filename};
      newListing.geometry = response.body.features[0].geometry;
      let savedListing = await newListing.save();
      console.log(savedListing);
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
  const allCategories = await Category.find({});
  let selectedListing = await Listing.findById(id).populate('owner');
  console.log(selectedListing);
  if(selectedListing.owner.username == req.user.username){
    let editImgUrl = selectedListing.image.url;
    editImgUrl = editImgUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs" , { selectedListing , editImgUrl , allCategories });
  }else{
    req.flash("error","You are not authorized to edit that listing!");
    res.redirect("/listings");
  }
};

//update

module.exports.update = async (req , res) => {
  let { id } = req.params;
  let selectedListing = await Listing.findByIdAndUpdate(id , {...req.body.listing});
  if(req.file){
    let filename = req.file.filename;
    let url = req.file.path;
    selectedListing.image = {url , filename};
    await selectedListing.save();
  }
  
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