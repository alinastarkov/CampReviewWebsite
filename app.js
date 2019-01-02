var express = require("express"); 
var app = express(); 
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var seedDB = require("./seeds");
var flash = require("connect-flash");
var passport              = require("passport"); 
var LocalStrategy         = require("passport-local"); 
var passportLocalMongoose = require("passport-local-mongoose"); 
var User                  = require("./models/user");
var methodOverride = require("method-override");

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.set("view engine","ejs"); 
seedDB();

// ROUTES 

var commentRoutes    = require("./routes/comments"), 
    campgroundRoutes = require("./routes/campground"), 
    indexRoutes      = require("./routes/index");

//PASSPORT CONFIGURATION

app.use(require("express-session")({
    secret: "Secretword",
    resave: false, 
    saveUninitialized: false
}))


app.use(passport.initialize());
app.use(passport.session()); 
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); 
passport.deserializeUser(User.deserializeUser()); 

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

app.use(indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

// Campground.create({name: "Sunday River", image: "https://www.pc.gc.ca/en/pn-np/ab/banff/activ/camping/~/media/802FD4AF791F4C6886E18CBF4A2B81B2.ashx?w=595&h=396&as=1", description: "worst place in Maine"}, function(err,campground) {
//     if(err) {
//         console.log(err);
//     } else {
//         console.log("NEWLY CREATED CAMPGROUND: "); 
//         console.log(campground);
//     }
// });


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started");
}); 