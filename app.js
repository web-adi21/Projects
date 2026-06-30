const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require('path');
const Listing = require("./models/listing.js");
const methodOverride = require("method-override")

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
 

app.get("/", (req, res) => {
  res.send("this is root");
})




app.get("/listings" , async (req , res) => {
  try {
  let allListings = await Listing.find({});

      res.render("listings/index.ejs", { allListings });
  } catch(err) {
      console.log(err);
      res.send("error occured while getting data from the database");
  }
  
})

app.get("/listings/new", (req , res) => {
 try{
    res.render("new.ejs")
 }catch(error) {
  console.log(error);
 }
})
 
app.post("/listings", async (req,res) => {
  const {title , image , price , description , location , country} = req.body;
  const newListing = new Listing({
    title : title,
    description: description,
    image: {
      filename: "listingimage",
      url: image
    },
    price:price,
    location: location, 
    country: country
  })
  await newListing.save();
  
  res.redirect("/listings")
})




app.get("/listings/:id/edit", async (req , res) => {
  let { id } = req.params;
  let selectedListing = await Listing.findById(id);

  res.render("edit.ejs" , { selectedListing })
})

app.put("/listings/:id", async (req , res) => {
  console.log("req received");
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id , {...req.body.listing});
  res.redirect(`/listings/${id}`)
})

app.get("/listings/:id", async (req , res) => {
  let { id } = req.params;
  console.log(id);
  let selectedListing = await Listing.findById(id);
  console.log(selectedListing);
  res.render("show.ejs", { selectedListing });
})



app.listen(3000, () => {
  console.log("server is listening on port 3000");
})