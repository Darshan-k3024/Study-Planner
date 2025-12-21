const express = require('express')
const router = express.Router({ mergeParams: true });
const Task = require('../models/task')
const Notes = require('../models/notes')
const wrapAsync = require('../utilis/wrapAsyncError.js')
const ExpressError = require("../utilis/ExpressError.js")
const {NotesSchema} = require("../schema.js")
const{isloggedin}=require("../middleware/isloggedin.js")
const cookieParser = require('cookie-parser')
const session = require("express-session")
const flash = require("connect-flash");


const validateNotes =(req,res,next)=>{
  let {error}=NotesSchema.validate(req.body);
  if(error){
    throw new ExpressError(400,error)
  }
  else{
    next()
  }

}

router.post("/",validateNotes,isloggedin,
    wrapAsync(async(req,res)=>{
let tasks = await Task.findById(req.params.id);

    let newNote = new Notes({
      text: req.body.text,
      taskId: tasks._id,
    });
    newNote.taskId = tasks._id;

    tasks.notes.push(newNote._id);  

    await newNote.save();
    await tasks.save();
    req.flash("success","New note created..! ")
    

    res.redirect(`/tasks/show/${tasks._id}`);
}))

//delete notes
router.delete("/:notesId",isloggedin,wrapAsync(async(req,res)=>{
  let{id,notesId}=req.params
  await Task.findByIdAndUpdate(id,{$pull:{notes:notesId}})
    await Notes.findByIdAndDelete(notesId)
    req.flash("success","Note delete successfully..!")
    res.redirect(`/tasks/show/${id}`)

}))

module.exports = router