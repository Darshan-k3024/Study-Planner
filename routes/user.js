const express = require('express')
const router = express.Router();
const wrapAsync = require('./utils/wrapAsyncError.js');
const User = require("../models/user.js")
const passport = require("passport")
const ExpressError = require("../utils/ExpressError.js")
const { UserSchema } = require("../schema.js")
//post-login middleware
const { saveRedirectUrl } = require("../middleware/isloggedin.js")
const userController = require("../controllers/user.js");
const user = require('../models/user.js');

const validateUser = (req, res, next) => {
    let { error } = UserSchema.validate(req.body)

    if (error) {
        throw new ExpressError(400, error)
    }
    else {
        next()
    }

}
// to get a signup form
router.get("/", (req, res) => {
    res.render("users/signUp.ejs")
})

//signup user
router.post("/",
    validateUser,userController.signUp )

//too login form
router.get("/login", (req, res) => {
    res.render("users/login.ejs")
})

//to login user
router.post("/login",
    //post-login middleware
    saveRedirectUrl, 
    passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),
   userController.login )

//to logout user
router.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }
        req.flash("success", "logged out..")
        res.redirect("/tasks")
    })
})


module.exports = router