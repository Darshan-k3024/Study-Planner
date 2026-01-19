require("dotenv").config();

const express = require("express")
const mongoose = require("mongoose")
const path = require("path")
const methodOverride = require('method-override')
const Task = require("./models/task.js")
const Notes = require("./models/notes.js")
const User =require("./models/user.js")
const wrapAsync = require("./utils/wrapasyncError.js")
const ExpressError = require("./utils/ExpressError.js")
const cookieParser = require('cookie-parser')
const session = require("express-session")
const MongoStore = require("connect-mongo")

const flash = require("connect-flash");
const passport=require("passport")
const localStrategy =require("passport-local")

const taskRoutes = require("./routes/task.js");   // create this file
const noteRoutes = require("./routes/notes.js"); 
const userRoutes = require("./routes/user.js")


const app = express()
const port = 4100;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(methodOverride('_method'))

app.use(cookieParser("secretcode"))

const dbStore = MongoStore.create({
  mongoUrl: process.env.MONGO_URL,
  secret: process.env.SESSION_SECRET,
  touchAfter: 24 * 3600,
});



dbStore.on("error",()=>{
  console.log("session store error",err)
})
app.use(
  session({
    store: dbStore,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);



app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
// use static authenticate method of model in LocalStrategy
passport.use(new localStrategy(User.authenticate()))
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.successMsg = req.flash("success")
  res.locals.errorMsg = req.flash("error")
  res.locals.currUser= req.user
  next()
})
app.use("/tasks",taskRoutes)
 app.use("/tasks/:id/notes",noteRoutes)
 app.use("/signup",userRoutes)
app.use("/",userRoutes)

const dbUrl = process.env.MONGO_URL
 main()
.then(() => {
  console.log("connection successful");
})
.catch((err) => {
  console.error("mongo connect error:", err);
});
async function main() {
  await mongoose.connect(dbUrl);
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
