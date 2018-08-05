require('dotenv').config();

var express               = require('express'),
    bodyParser            = require('body-parser'),
    mongoose              = require('mongoose'),
    passport              = require('passport'),
    LocalStrategy         = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose'),
    methodOverride        = require('method-override'),
    flash                 = require('connect-flash'),
    app                   = express();

var Campground            = require('./models/campground'),
    Comment               = require('./models/comment'),
    User                  = require('./models/user'),
    indexRoutes           = require('./routes/index'),
    campgroundRoutes      = require('./routes/campgrounds'),
    commentRoutes         = require('./routes/comments'),
    seedDB                = require('./seeds');

mongoose.connect(process.env.DATABASE_URL);

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();

app.use(require('express-session') ({
    secret: ",F[bU,W+9PHy/4jYBrMe",
    resave: false,
    saveUninitialized: false
}));

app.locals.moment = require('moment');

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error       = req.flash("error");
    res.locals.success     = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

var port = process.env.PORT || 8000;
app.listen(port, function() {
    console.log("1");
});
