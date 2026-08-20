module.exports.isLoggedIn = (req, res, next) => {
  console.log(req.user);
  if(!req.isAuthenticated()) {
    req.flash("error","Please Login to Continue!");
    return res.redirect("/login");
  }
  next();
}