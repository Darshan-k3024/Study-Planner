const Notes = require("../models/notes")
const Task = require("../models/task")

// create 
module.exports.create =async(req,res)=>{
let tasks = await Task.findById(req.params.id);

    let newNote = new Notes({
      text: req.body.text,
      taskId: tasks._id,
    });
    newNote.taskId = tasks._id;
    newNote.author=req.user._id
    console.log(newNote)

    tasks.notes.push(newNote._id);  

    await newNote.save();
    await tasks.save();
    req.flash("success","New note created..! ")
    

    res.redirect(`/tasks/show/${tasks._id}`);
}

//delete
module.exports.distroy = async(req,res)=>{
  let{id,notesId}=req.params
  await Task.findByIdAndUpdate(id,{$pull:{notes:notesId}})
    await Notes.findByIdAndDelete(notesId)
    req.flash("success","Note delete successfully..!")
    res.redirect(`/tasks/show/${id}`)

}