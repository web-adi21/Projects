const express = require("express");

const User = require("../models/user.js");



//SignUp post
module.exports.userSignPost = async (req, res) => {
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
};

//SignUp Get

module.exports.userSignGet = async (req, res) => {
  res.render("user/signup.ejs");
};

//loginGet 

module.exports.userLogGet = async (req, res) => {
  res.render("user/login.ejs");
};

//LogPost

module.exports.userLogPost = async(req,res) => {
 req.flash("success","Welcome back to WanderLust!");
 if(res.locals.redirectUrl){
  res.redirect(res.locals.redirectUrl);
 }else{
  res.redirect("/listings");
 }
};

//Logout

module.exports.userLogOut = async (req,res,next) => {
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
};