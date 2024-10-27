const User = require("../models/user");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        let newUser = new User({ username, email });
        let registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        //sign up with login
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            };
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";   // NOTE:- ager ham login se phle kisi route pe nhi hoge to undefined ho jaiga (res.locals.redirectUrl) isliye hme choti si choti cheeze dekhtni hoti phle konsa function triger ho rha or konsa nhi phir or condition lga dege ager ye undefind hai to ye dikha do ( let redirectUrl = res.locals.redirectUrl || "/listings";)
    res.redirect(redirectUrl);
};

module.exports.logout =  (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "you are logged out!");
        res.redirect("/listings");
    });
};