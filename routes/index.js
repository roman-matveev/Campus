var express  = require('express'),
    passport = require('passport'),
    router   = express.Router();

var User     = require('../models/user');

router.get("/", function(req, res) {
    res.render("home");
});

router.get("/register", function(req, res) {
    res.render("register", {page: "register"});
});

router.post("/register", function(req, res) {
    var newUsername = new User({username: req.body.username}),
        newPassword = req.body.password;

    User.register(newUsername, newPassword, function(err, user) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("/register");
        } passport.authenticate("local") (req, res, function() {
            req.flash("success", "Welcome to Campus, " + user.username + "!");
            res.redirect("/campgrounds");
        });
    });
});

router.get("/login", function(req, res) {
    res.render("login", {page: "login"});
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res) {});

router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged out successfully.");
    res.redirect("/campgrounds");
});

module.exports = router;
