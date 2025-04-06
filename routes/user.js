const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user");
const passport = require("passport");

const {saveRedirectUrl} = require("../middlewares");

//===================================================================================================

router.get("/signup", async (req, res, next) => {
    res.render("users/signup.ejs");
})

router.post("/signup", async (req, res, next) => {
    let { username, email, password } = req.body;
    const newUser = new User({
        email,
        username
    });
    const registeredUser = await User.register(newUser, password);
    console.log("registeredUser =>", registeredUser);
    req.login(registeredUser, (err) => {
       
        if (err) return next(err);
        req.flash("success", "Welcome To Wanderlust !!!")
        res.redirect("/listings");
    })   
        
});

router.get("/login", async (req, res, next) => {
    res.render("users/login.ejs");
});

router.post("/login", saveRedirectUrl,
    passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
    async (req, res, next) => {        
        req.flash("success", "Welcome! You're Logged In.");
        // res.redirect("/listings");
        console.log("REDIRECT URL > ", res.locals.redirectUrl);
        res.redirect(res.locals.redirectUrl||"/listings");
    }
);

//LOGOUT ROUTE
router.get("/logout", async (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash("success", "You Are Logged Out !");
        res.redirect("/listings");
    });    
    
})


//===================================================================================================

module.exports = router;