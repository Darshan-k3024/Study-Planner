const Task = require("../models/task")
//root
module.exports.root= async(req, res) => {

  const tasks = await Task.find();   

  res.render("index.ejs", { tasks })  
}
//create 
module.exports.create= (async (req, res) => {
  
    
  const { title, subject, description, dueDate, priority, status } = req.body;

  const newTask = new Task({
    title,
    subject,
    description,
    dueDate,
    priority: priority?.trim(),
    status: status?.trim(),
    owener:req.user._id,
  });
  
  await newTask.save();
  console.log("Task was saved:", newTask);
  req.flash("success","New task created .!")

  res.redirect("/tasks");
})
//show
module.exports.show=async (req, res) => {
  let { id } = req.params;

  let Tasks = await Task.findById(id)
    .populate("owener")
    .populate({
      path: "notes",
      populate: {
        path: "author"
      }
    });

  res.render("show.ejs", { Tasks });
}

//edit render
module.exports.edit=async(req,res)=>{
  let {id}= req.params
  let Tasks = await Task.findById(id)
     res.render("edit.ejs",{Tasks})
}
//update 
module.exports.update=async(req,res)=>{
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



}
//distroy route
module.exports.distroy=async(req,res)=>{
   let {id}= req.params

   let deleteTask = await Task.findByIdAndDelete(id)
   console.log(deleteTask)
   req.flash("success","Task deleted successfully..!")
   res.redirect("/tasks")
}