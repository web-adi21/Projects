const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require('path');
const Listing = require("./models/listing.js");

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
 

app.get("/", (req, res) => {
  res.send("this is root");
})

app.get("/testlisting" , (req , res) => {
  let sampleListing = new Listing({
    title : "my house",
    description :"a great house",
    price: 5000,
    location : "shahganj",
    country : "India"
  });

  sampleListing.save()
    .then(() => {
      console.log("sampleListing was saved");
    })
    .catch((err) => {
      console.log(err);
    })
})



app.listen(3000, () => {
  console.log("server is listening on port 3000");
})