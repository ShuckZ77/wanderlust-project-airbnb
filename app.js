if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
    console.log(process.env) // remove this after you've confirmed it is working
}

const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
// const axios = require('axios');
const ejsMate = require('ejs-mate')
const session = require("express-session");
const flash = require("connect-flash");
const MongoStore = require('connect-mongo');

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");


//===================================================================================================

const ExpressError = require("./utils/ExpressError");

//===================================================================================================

app.set("view engine","ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

//===================================================================================================

// const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';
const dbURL = process.env.ATLASDB_URL;
main().then(()=>{
    console.log("Connection to MongoDB is OK")
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect(dbURL);
}

//===================================================================================================

const store = MongoStore.create({
    mongoUrl: dbURL,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24*3600
  })

const sessionOptions = {
    store: store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}

app.use(session(sessionOptions));
app.use(flash());

//===================================================================================================

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//===================================================================================================

app.use((req, res, next) => {
    console.log("==== REQUEST OBJECT ====");
    // console.log(req.file);
    console.log("==== -------------- ====");
    console.log("==== RESPONSE OBJECT ====");
    // console.log(res);
    console.log("==== -------------- ====");
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    console.log("REQUEST.USER > ", req.user)
    next();
});

//===================================================================================================

const listingsRouter = require("./routes/listings");
const reviewsRouter = require("./routes/reviews");
const userRouter = require("./routes/user");

//===================================================================================================

//ROOT ROUTE
// app.get("/", async (req, res, next) => {
//     res.send("ROOT PAGE");
// });

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

//===================================================================================================

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "PAGE NOT FOUND !!!"))
})

app.use((err, req, res, next) => {
    console.warn(err);
    let {statusCode=500, message="SOMETHING IS CRAZY !!!"} = err;
    res.status(statusCode).render("error.ejs", {message})
})

app.listen(port,()=>{
    console.log(`Server is listening to port = ${port}`)
});



