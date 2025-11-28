const mongoose = require("mongoose")
const express = require("express")
const path = require("path")
const methodOverride = require('method-override')
const Task = require("./models/task.js")
const wrapAsync = require("./utilis/wrapasyncError.js") // wrapasyncError
const app = express()
const port = 4100;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(methodOverride('_method'))

main()
.then(() => {
  console.log("connection successful");
})
.catch((err) => {
  console.error("mongo connect error:", err);
});
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/study-planner");
}

//root route
app.get("/tasks", wrapAsync(async(req, res) => {

  const tasks = await Task.find();   

  res.render("index.ejs", { tasks })  
}))

//new task route
app.get("/tasks/new", (req, res) => {
  res.render("new.ejs")
})

//create route
app.post("/tasks",wrapAsync(async(req,res)=>{
  let {title,subject,description,dueDate} = req.body
    const priority = req.body.priority ? req.body.priority.trim() : undefined;
    const status = req.body.status ? req.body.status.trim() : undefined;
  let newTask = new Task({
    title:title,
    subject:subject,
    description:description,
    dueDate:dueDate,
    priority:priority,
    status:status,
  
  })
  await newTask.save()
                .then(()=>{
                  console.log("chat was saved")
                })
                .catch((err)=>{
                  console.log(err)
                })
  console.log(newTask)
   res.redirect("/tasks")
}))



app.get("/tasks/show/:id",wrapAsync( async (req, res) => {

  let {id}= req.params
  let Tasks = await Task.findById(id)

  res.render("show.ejs",{Tasks})
}))

//to get edit route
app.get("/tasks/:id/edit",wrapAsync(async(req,res)=>{
  let {id}= req.params
  let Tasks = await Task.findById(id)
     res.render("edit.ejs",{Tasks})
}))
// to update route
app.patch("/tasks/:id",wrapAsync(async(req,res)=>{
   let {id}= req.params
   let newDescription=req.body.description
   let newStatus=req.body.status

   let updatedTask = await Task.findByIdAndUpdate(
    id,
    { description:newDescription,
      status:newStatus,
    },
  
    
    
    { runValidators: true, new: true },
   

  );
  console.log(updatedTask)
  res.redirect("/tasks")



}))
//distroy route

app.delete("/tasks/:id",wrapAsync(async(req,res)=>{
   let {id}= req.params

   let deleteTask = await Task.findByIdAndDelete(id)
   console.log(deleteTask)
   res.redirect("/tasks")
}))
//handle cutom error
app.use((err,req,res,next)=>{
 res.send("Something went wrong")
})

app.listen(port, (req, res) => {
  console.log(`server listen on ${port}`)
  console.log("http://localhost:4100/tasks")
})
