const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require('../utils/wrapAsync.js');

const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

//signup

router.route("/signup")
    .get( wrapAsync(userController.userSignGet))
    .post( wrapAsync(userController.userSignPost));


//login
router.route("/login")
    .get( wrapAsync(userController.userLogGet))
    .post(saveRedirectUrl, passport.authenticate("local", {failureRedirect: "/login",failureFlash: true}), wrapAsync(userController.userLogPost));


//logout
router.get("/logout",wrapAsync(userController.userLogOut));

module.exports = router;