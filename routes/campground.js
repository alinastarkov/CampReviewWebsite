var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

router.get("/", function(req,res){
    Campground.find({},function(err,allCampgrounds){
        if (err) {
            console.log(err);
        } else {
             res.render("campgrounds/index",{campgrounds:allCampgrounds});
        }
    });
});

// CREATE - ADD A CAMPGROUND 

router.post("/",middleware.isLoggedIn,function(req,res){
    var name = req.body.name; 
    var url = req.body.url;
    var des = req.body.description;
    var author = {
        id: req.user._id, 
        username: req.user.username
    }
    var newCampground = {name: name, image: url, description: des, author: author};
    Campground.create(newCampground,function(err, newCamp){
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

// NEW FORM TO CREATE

router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

// SHOW FORM 

router.get("/:id",function(req,res) {
      //find the campground ID
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if (err) {
            console.log(err);
        } else {
            //render 
        res.render("campgrounds/show", {campground:foundCampground});
        }
    });
});

// Edit route 
router.get("/:id/edit",middleware.checkCampgroundOwnerShip,function(req,res){
        Campground.findById(req.params.id, function(err, foundCampground){
                res.render("campgrounds/edit", {campground: foundCampground});
        }); 
});

// Update route 

router.put("/:id", middleware.checkCampgroundOwnerShip, function(req,res){
    //find and update the correct campground 
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if (err) {
            res.redirect("/campgrounds");
        } else {
                //redirect show page
            res.redirect("/campgrounds/"+ req.params.id)
        }
    });
});

//Destroy campground route 

router.delete("/:id", middleware.checkCampgroundOwnerShip,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        if (err) {
            res.redirect("/campgrounds");
        } else {
             res.redirect("/campgrounds");
        }
    })
});



module.exports = router;