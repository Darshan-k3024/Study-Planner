const express = require('express')
const router = express.Router();
const Task = require('../models/task')
const Notes = require('../models/notes')
const wrapAsync = require('../utilis/wrapAsyncError')
const ExpressError = require("../utilis/ExpressError.js")
const {TaskSchema,UpdateSchema}= require("../schema.js")
const{isloggedin,isOwener}=require("../middleware/isloggedin.js")
const User = require("../models/user.js")
const cookieParser = require('cookie-parser')
const session = require("express-session")
const flash = require("connect-flash");
const taskController = require("../controllers/tasks.js")


//middleware for create route
const validatetask =(req,res,next)=>{
  let {error}=TaskSchema.validate(req.body)
  
  if(error){
    throw new ExpressError(400,error)
  }
  else{
    next()
  }
  
}

//middleware for update route
const validateUpdate =(req,res,next)=>{
  let {error}=UpdateSchema.validate(req.body);
  if(error){
    throw new ExpressError(400,error)
  }
  else{
    next()
  }

}
//root route
router.get("/",taskController.root)

//new task route
router.get("/new", isloggedin,(req, res) => {
  res.render("new.ejs")
})

//create route
router.post("/",validatetask,
   wrapAsync(taskController.create)
);

//show route
router.get("/show/:id",taskController.show);
//edit route

router.get("/:id/edit",isloggedin,isOwener,taskController.edit)
//upate route
router.patch("/:id",isloggedin,isOwener,validateUpdate,
  wrapAsync(taskController.update))

//distroy route   
router.delete("/:id",isloggedin,isOwener,taskController.distroy)

module.exports = router