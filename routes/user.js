const express = require('express')
const router = express.Router();
const wrapAsync = require('../utilis/wrapAsyncError');
const User = require("../models/user.js")
const passport = require("passport")
const ExpressError = require("../utilis/ExpressError.js")
const {UserSchema} = require("../schema.js")

const validateUser =(req,res,next)=>{
  let {error}=UserSchema.validate(req.body)
  
  if(error){
    throw new ExpressError(400,error)
  }
  else{
    next()
  }
  
}
// to get a signup form
router.get("/",(req,res)=>{
    res.render("users/signUp.ejs")
})

//signup user
router.post("/",
    validateUser,async(req,res)=>{
    try{
  let {username,email,password}=req.body
   const newUser = new User({email,username})
   const registerdUser = await User.register(newUser, password)
   console.log(registerdUser)
   req.flash("success","welcome to study-planner")
   res.redirect("/tasks")
    }
    catch(e){
        req.flash("error","please create account")
        res.send(e.message)
    }
})

//too login form
router.get("/login",(req,res)=>{
    res.render("users/login.ejs")
})

//to login user
router.post("/login",passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),
async(req,res)=>{
    req.flash("success","Welcome to Study-Planner")
    res.redirect("/tasks")

})

//to logout user
router.get("/logout",(req,res)=>{
   req.logout((err)=>{
    if(err){
        return next(err)
    }
    req.flash("success","logged out..")
    res.redirect("/tasks")
   })
})


module.exports= router