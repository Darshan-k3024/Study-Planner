const express = require('express')
const router = express.Router();
const Task = require('../models/task')
const Notes = require('../models/notes')
const wrapAsync = require('../utilis/wrapAsyncError')
const ExpressError = require("../utilis/ExpressError.js")
const {TaskSchema,UpdateSchema}= require("../schema.js")
const{isloggedin}=require("../middleware/isloggedin.js")
const cookieParser = require('cookie-parser')
const session = require("express-session")
const flash = require("connect-flash");


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
router.get("/", async(req, res) => {

  const tasks = await Task.find();   

  res.render("index.ejs", { tasks })  
})
//new task route
router.get("/new", isloggedin,(req, res) => {
  res.render("new.ejs")
})
//create route
router.post("/",validatetask,
   wrapAsync(async (req, res) => {
    // let result =TaskSchema.validate(req.body)
    // console.log(result)
    // if (result.error) {
    //   throw new ExpressError(400,result.error)
      
    // }
    
  const { title, subject, description, dueDate, priority, status } = req.body;

  const newTask = new Task({
    title,
    subject,
    description,
    dueDate,
    priority: priority?.trim(),
    status: status?.trim(),
  });

  await newTask.save();
  console.log("Task was saved:", newTask);
  req.flash("success","New task created .!")

  res.redirect("/tasks");
})
);
//show route
router.get("/show/:id",isloggedin, async (req, res) => {

  let {id}= req.params
  let Tasks = await Task.findById(id).populate("notes")

  res.render("show.ejs",{Tasks})
})
//edit route
router.get("/:id/edit",isloggedin,async(req,res)=>{
  let {id}= req.params
  let Tasks = await Task.findById(id)
     res.render("edit.ejs",{Tasks})
})
//upate route
router.patch("/:id",validateUpdate,
  wrapAsync(async(req,res)=>{
   const {id}= req.params
   const newDescription=req.body.description
   const newStatus=req.body.status
   const updatedTask = await Task.findByIdAndUpdate(
    id,
    { description:newDescription,
      status:newStatus,
    },
    { runValidators: true, new: true },
   

  )
  console.log(updatedTask)
  req.flash("success","Task update successfully..!")
  res.redirect("/tasks")



}))

//distroy route
router.delete("/:id",isloggedin,async(req,res)=>{
   let {id}= req.params

   let deleteTask = await Task.findByIdAndDelete(id)
   console.log(deleteTask)
   req.flash("success","Task deleted successfully..!")
   res.redirect("/tasks")
})

module.exports = router