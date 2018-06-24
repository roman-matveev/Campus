var express      = require('express'),
    router       = express.Router();

var Campground   = require('../models/campground'),
    middleware   = require('../middleware');

var nodeGeocoder = require('node-geocoder'),
    options = {
        provider: 'google',
        httpAdapter: 'https',
        apiKey: process.env.GEOCODER_API_KEY,
        formatter: null
    },
    geocoder = nodeGeocoder(options);

router.get("/", function(req, res) {
    Campground.find({}, function(err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds, page: "campgrounds"});
        }
    });
});

router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

router.post("/", middleware.isLoggedIn, function(req, res) {
    var name   = req.body.name,
        image  = req.body.image,
        desc   = req.body.desc,
        price  = req.body.price,
        author = {id: req.user._id, username: req.user.username};

    geocoder.geocode(req.body.loc, function(err, geo) {
        if (err || !geo.length) {
            req.flash("error", "Invalid address.");
            return res.redirect("back");
        }

        var lat = geo[0].latitude,
            lng = geo[0].longitude,
            loc = geo[0].formattedAddress;

        var newCampground = {name: name, image: image, desc: desc, price: price, author: author, lat: lat, lng: lng, loc: loc};

        Campground.create(newCampground, function(err, createdCampground) {
            if (err) {
                console.log(err);
            } else {
                res.redirect("/campgrounds");
            }
        });
    });
});

router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(
        function(err, foundCampground) {
            if (err || !foundCampground) {
                req.flash("error", "Campground not found.");
                res.redirect("back");
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
    geocoder.geocode(req.body.loc, function(err, geo) {
        if (err || !geo.length) {
            req.flash("error", "Invalid address.");
            return res.redirect("back");
        }

        req.body.campground.lat = geo[0].latitude;
        req.body.campground.lng = geo[0].longitude;
        req.body.campground.loc = geo[0].formattedAddress;

        Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
            if (err) {
                res.redirect("back");
            } else {
                res.redirect("/campgrounds/" + req.params.id);
            }
        });
    });
});

router.delete("/:id", middleware.isCampgroundAuthor, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            req.flash("error", "Campground not found.");
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;
