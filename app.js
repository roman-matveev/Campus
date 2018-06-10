var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect("mongodb://localhost/campus");

var cgSchema = new mongoose.Schema({
    name: String,
    image: String,
    desc: String,
});

var Campground = mongoose.model("Campground", cgSchema);
// Campground.create({
//     name: "Granite Hill",
//     image: "https://pixabay.com/get/e837b1072af4003ed1584d05fb1d4e97e07ee3d21cac104497f8c77ca2eabcbe_340.jpg",
//     desc: "This is a giant granite hill."
// }, function(err, campground) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log("Campground created:");
//         console.log(campground);
//     }
// });

app.get("/", function(req, res) {
    res.render("home");
});

app.get("/campgrounds", function(req, res) {
    Campground.find({}, function(err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("index", {campgrounds:allCampgrounds});
        }
    });
});

app.post("/campgrounds", function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.desc;
    var newCampground = {name: name, image: image, desc: desc};

    Campground.create(newCampground, function(err, createdCampground) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

app.get("/campgrounds/new", function(req, res) {
    res.render("new");
});

app.get("/campgrounds/:id", function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            res.render("show", {campground:foundCampground});
        }
    });
});

app.listen(8000, function() {
    console.log("Running server on port 8000.");
});
