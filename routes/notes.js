const express = require('express')
const router = express.Router({ mergeParams: true });
const Task = require('../models/task')
const Notes = require('../models/notes')
const wrapAsync = require("../utils/wrapasyncError.js")
const ExpressError = require("../utils/ExpressError.js")
const {NotesSchema} = require("../schema.js")
const{isloggedin}=require("../middleware/isloggedin.js")
const cookieParser = require('cookie-parser')
const session = require("express-session")
const flash = require("connect-flash")
const notesController = require("../controllers/notes.js")

const validateNotes =(req,res,next)=>{
  let {error}=NotesSchema.validate(req.body);
  if(error){
    throw new ExpressError(400,error)
  }
  else{
    next()
  }

}

router.post("/",isloggedin,validateNotes,
    wrapAsync(notesController.create))

//delete notes
router.delete("/:notesId",isloggedin,wrapAsync(notesController.distroy))

module.exports = router