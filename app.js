if (process.env.NODE_ENV != "production") {
    require('dotenv').config()
}
console.log(process.env.SECRET)


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


// const wrapAsync = require('./utils/wrapAsync.js');
// const Listing = require("./models/listing.js");
// const { listingSchema, reviewSchema } = require('./schema.js');
// const Review= require('./models/review.js');


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js");


//db connection
// const MONGO_URI = 'mongodb://127.0.0.1:27017/wanderlust'
const dbUrl = process.env.MONGO_URI;
async function main() {
    mongoose.connect(dbUrl);
}
main()
    .then((res) => {
        console.log("DB connection succesful")
    })
    .catch((err) => {
        console.log(err)
    })



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", () => {
    console.log("ERROR in MONGO SESSION STORE", err);
});


const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 1000,
        httpOnly: true,
    },
};

//routes settings
// app.get("/", (req, res) => {
//     res.send("i am root route")
// })



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});



// app.get("/demouser", async (req, res) => {
//     let fakeUser = new User({
//         email: "rahul@gmail.com",
//         username: "rahul"
//     })
//     let registeredUser = await User.register(fakeUser, "helloworld");
//     res.send(registeredUser);
//     console.log(registeredUser)
// });



// const validateListing = (req, res, next) => {
//     let { error } = listingSchema.validate(req.body)
//     if (error) {
//         let errMsg = error.details.map((el) => el.message).join(",");
//         throw new ExpressError(400, error);
//     } else {
//         next();
//     }
// }

// const validateReview = (req, res, next) => {
//     let { error } = reviewSchema.validate(req.body)
//     if (error) {
//         let errMsg = error.details.map((el) => el.message).join(",");
//         throw new ExpressError(400, error);
//     } else {
//         next();
//     }
// }



app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// //index route
// app.get("/listings", wrapAsync(async (req, res) => {
//     const allListings = await Listing.find({})
//     res.render("listings/index.ejs", { allListings })
// }))

// //new route
// app.get("/listings/new", (req, res) => {
//     res.render("listings/new.ejs")
// })

// //show route
// app.get("/listings/:id", wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     const listing = await Listing.findById(id).populate("reviews"); //jo reviews hai jo har listing k sath h uhne populate krna hai
//     res.render("listings/show.ejs", { listing });
// }));

// //Create Route
// app.post("/listings", validateListing,
//     wrapAsync(async (req, res, next) => {
//         // const { title, description, image, price, loaction, country } = req.body
//         const newListing = new Listing(req.body.listing);
//         await newListing.save();
//         res.redirect("/listings");
//     })
// );

// //Edit Route
// app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     const listing = await Listing.findById(id);
//     res.render("listings/edit.ejs", { listing });
// }));

// //Update Route
// app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     await Listing.findByIdAndUpdate(id, { ...req.body.listing });
//     res.redirect(`/listings/${id}`);
// }));


// //Delete Route
// app.delete("/listings/:id", wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     let deletedListing = await Listing.findByIdAndDelete(id);
//     console.log(deletedListing);
//     res.redirect("/listings");
// }));

//Reviews 
// //Post route
// app.post("/listings/:id/reviews", validateReview, wrapAsync(async (req, res) => {
//     let listing = await Listing.findById(req.params.id);
//     let newRewiew = new Review(req.body.review);

//     listing.reviews.push(newRewiew);

//     await newRewiew.save();
//     await listing.save();

//     // console.log('new review saved')
//     res.redirect(`/listings/${listing._id}`);
// }));

// //delete route
// app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
//     let { id, reviewId } = req.params;

//     await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
//     await Review.findByIdAndDelete(reviewId);

//     res.redirect(`/listings/${id}`);
// }))

// app.get("/testListing", (req, res) => {
//     let sampleListings = new Listing({
//         title: "my new billa",
//         description: "by beach",
//         price: 50000,
//         location: "goa",
//         country: "india",
//     });

//     sampleListings
//         .save()
//         .then((res) => {
//             console.log(res)
//         })
//         .catch((err) => {
//             console.log(err)
//         })
//     res.send("success")    
// })


//middleware

app.all('*', (req, res, next) => {
    next(new ExpressError(404, "Page not found!"))
})
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Somthing went wrong!" } = err;
    res.status(statusCode).render("error.ejs", { message });
    // res.status(statusCode).send(message)
    // res.send("Something went wrong");
})


app.listen(8080, () => {
    console.log("Server is listening 8080")
})