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
const session = require("express-session");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js")


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

const sessionOptions = {
  secret: "secretcode",
  resave: false,
  saveUninitialized: true
};

app.use(session(sessionOptions));

 

app.get("/", (req, res) => {
  res.send("this is root");
})

app.use("/listings", listings);

app.use("/listings/:id/reviews", reviews);








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