const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const User = require("../models/user.js");
const passport = require("passport");

//signup

router.get("/signup", wrapAsync(async (req, res) => {
  res.render("signup.ejs");
}));

router.post("/signup", wrapAsync(async (req, res) => {
  try{
    let {username, email,password } = req.body;
    const newUser = new User({email,username});
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.flash("success", "User was registered successfully!");
    res.redirect("/listings");
  } catch(err) {
    req.flash("error", err.message)
    res.redirect("/signup");
  }
  
}));

//login

router.get("/login", wrapAsync(async (req, res) => {
  res.render("login.ejs");
}));


router.post("/login", passport.authenticate("local", {failureRedirect: "/login",failureFlash: true}), async(req,res) => {
 req.flash("success","Welcome back to WanderLust!");
 res.redirect("/listings");
});

module.exports = router;