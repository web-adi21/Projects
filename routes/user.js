const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

//signup

router.get("/signup", wrapAsync(userController.userSignGet));

router.post("/signup", wrapAsync(userController.userSignPost));

//login

router.get("/login", wrapAsync(userController.userLogGet));


router.post("/login",saveRedirectUrl, passport.authenticate("local", {failureRedirect: "/login",failureFlash: true}), wrapAsync(userController.userLogPost));

//logout

router.get("/logout",wrapAsync(userController.userLogOut));

module.exports = router;