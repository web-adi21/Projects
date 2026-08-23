const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

//signup

router.get("/signup", wrapAsync(async (req, res) => {
  res.render("user/signup.ejs");
}));

router.post("/signup", wrapAsync(async (req, res) => {
  try{
    let {username, email,password } = req.body;
    const newUser = new User({email,username});
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if(err){
        return next(err);
      }
      req.flash("success", "User was registered successfully!");
    res.redirect("/listings");
    })
    
  } catch(err) {
    req.flash("error", err.message)
    res.redirect("/signup");
  }
  
}));

//login

router.get("/login", wrapAsync(async (req, res) => {
  res.render("user/login.ejs");
}));


router.post("/login",saveRedirectUrl, passport.authenticate("local", {failureRedirect: "/login",failureFlash: true}), async(req,res) => {
 req.flash("success","Welcome back to WanderLust!");
 if(res.locals.redirectUrl){
  res.redirect(res.locals.redirectUrl);
 }else{
  res.redirect("/listings");
 }
 
});

//logout

router.get("/logout", (req,res,next) => {
console.log(req.user);
if(req.user){
  req.logOut((err) => {
    if(err) {
      next(err);
    }
    req.flash("success", "You are logged Out!");
    res.redirect("/listings")
    })
  } else{
    req.flash("error","You are not logged in!");
    res.redirect("/listings");
  }
  
});

module.exports = router;