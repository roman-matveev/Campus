var express    = require('express'),
    router     = express.Router();

var Campground = require('../models/campground'),
    middleware = require('../middleware');

router.get("/", function(req, res) {
    Campground.find({}, function(err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});

router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

router.post("/", middleware.isLoggedIn, function(req, res) {
    var name          = req.body.name,
        image         = req.body.image,
        desc          = req.body.desc,
        author        = {id: req.user._id, username: req.user.username},
        newCampground = {name: name, image: image, desc: desc, author: author};

    Campground.create(newCampground, function(err, createdCampground) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(
        function(err, foundCampground) {
            if (err) {
                console.log(err);
            } else {
                res.render("campgrounds/show", {campground: foundCampground});
            }
    });
});

router.get("/:id/edit", middleware.isCampgroundAuthor, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

router.put("/:id", middleware.isCampgroundAuthor, function(req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

router.delete("/:id", middleware.isCampgroundAuthor, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;
