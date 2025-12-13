const express = require("express")
const mongoose = require("mongoose")
const path = require("path")
const methodOverride = require('method-override')
const Task = require("./models/task.js")
const Notes = require("./models/notes.js")
const wrapAsync = require('./utilis/wrapAsyncError')
const ExpressError = require("./utilis/ExpressError.js")

const taskRoutes = require("./routes/task.js");   // create this file
const noteRoutes = require("./routes/notes.js"); 

const app = express()
const port = 4100;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
// app.use('/views/public', express.static(path.join(__dirname, 'views/public')));
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(methodOverride('_method'))
app.use("/tasks",taskRoutes)
app.use("/tasks/:id/notes",noteRoutes)

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




//custom ExpressError here for incorrectedt path
app.all("/{*path}",(req,res,next)=>{
  next(new ExpressError(404,"Opps..Page Not Found!!"))
})
//middleware define for express error
 app.use((err,req,res,next)=>{
    let{status=400,message="something went bad"}=err;
    res.status(status).render("error.ejs",{message})
 })


app.listen(port, (req, res) => {
  console.log(`server listen on ${port}`)
  console.log("http://localhost:4100/tasks")
})
