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

var multer = require('multer'),
    storage = multer.diskStorage({
        filename: function(req, file, callback) {
            callback(null, Date.now() + file.originalname);
        }
    });

var imageFilter = function(req, file, err) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return err(new Error('Only image files are allowed!'), false);
    } err(null, true);
};

var upload = multer({storage: storage, fileFilter: imageFilter});

var cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'dnyhaoh7w',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

router.get("/", function(req, res) {
    var noMatch = null;
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');

        Campground.find({name: regex}, function(err, allCampgrounds) {
            if (err) {
                console.log(err);
            } else {
                if (allCampgrounds.length < 1) {
                    noMatch = "No campgrounds matched this search.";
                }
                res.render("campgrounds/index", {campgrounds: allCampgrounds, page: "campgrounds", noMatch: noMatch});
            }
        });
    } else {
        Campground.find({}, function(err, allCampgrounds) {
            if (err) {
                console.log(err);
            } else {
                res.render("campgrounds/index", {campgrounds: allCampgrounds, page: "campgrounds", noMatch: noMatch});
            }
        });
    }
});

router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

router.post("/", middleware.isLoggedIn, upload.single('image'), function(req, res) {
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

        cloudinary.uploader.upload(req.file.path, function(result) {
            var image   = result.secure_url,
                imageId = result.public_id;

            var newCampground = {name: name, image: image, imageId: imageId, desc: desc, price: price, author: author, lat: lat, lng: lng, loc: loc};

            Campground.create(newCampground, function(err, createdCampground) {
                if (err) {
                    req.flash('error', err.message);
                    return res.redirect('back');
                } res.redirect("/campgrounds");
            });
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

router.put("/:id", middleware.isCampgroundAuthor, upload.single('image'), function(req, res) {
    Campground.findById(req.params.id, async function(err, campground) {
        if (err) {
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            if (req.file) {
                try {
                    await cloudinary.uploader.destroy(campground.imageId);
                    var result = await cloudinary.uploader.upload(req.file.path);
                    campground.imageId = result.public_id;
                    campground.image = result.secure_url;
                } catch (err) {
                    req.flash("error", err.message);
                    res.redirect("back");
                }
            }

            geocoder.geocode(req.body.loc, function(err, geo) {
                if (err || !geo.length) {
                    req.flash("error", err.message);
                    return res.redirect("back");
                }

                req.body.lat     = geo[0].latitude;
                req.body.lng     = geo[0].longitude;
                req.body.loc     = geo[0].formattedAddress;
                campground.name  = req.body.name;
                campground.desc  = req.body.desc;
                campground.price = req.body.price;
                campground.save();
                res.redirect("/campgrounds/" + campground._id);
            });
        }
    });
});

router.delete("/:id", middleware.isCampgroundAuthor, function(req, res) {
    Campground.findById(req.params.id, async function(err, campground) {
        if (err) {
            req.flash("error", "Campground not found.");
            return res.redirect("back");
        } try {
            await cloudinary.uploader.destroy(campground.imageId);
            campground.remove();
            res.redirect("/campgrounds");
        } catch (err) {
            req.flash("error", err.message);
            res.redirect("back");
        }
    });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router;
