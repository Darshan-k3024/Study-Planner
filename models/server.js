const express = require("express")
const mongoose = require("mongoose")
const path = require("path")
const methodOverride = require('method-override')
const cookieParser = require('cookie-parser')
const session = require("express-session")
const flash = require("connect-flash");

const app = express()
const port = 2100;
app.use(
    session({
            secret:"mysupersecretstring",
            resave:false,
            saveUninitialized:true,
}))

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(methodOverride('_method'))
app.use(cookieParser("seceretcode"))
 app.use(flash());

//midleware create for flash msg
app.use((req,res,next)=>{
res.locals.successMSG =req.flash("success")
res.locals.errorMSG =req.flash("error")
    next()
})

 app.get("/register",(req,res)=>{
    let{name="john"}=req.query
    req.session.name=name
    if(name==="john"){
        req.flash ("error","user not registrered")
    }else{
                   //key       //message
         req.flash("success","user register succesfully")
    }
    res.redirect("/hello")
})
app.get("/hello",(req,res)=>{
    
    res.render("flash.ejs",{name :req.session.name})

})

// app.get("/recount",(req,res)=>{
//     if(req.session.count){
//         req.session.count++
//     }else{
//         req.session.count=1
//     }
//     res.send(`you sent a request ${req.session.count} times`)
        

// })

// app.get("/getcookie",(req,res)=>{
//     res.cookie("madein","india")

//     res.send("heteee")
// })

// app.get("/cookies",(req,res)=>{
//     res.cookie("made","india",{signed:true})
  
// })

// app.get("/verify",(req,res)=>{
//   console.log(res.signedcookies)
// })
app.listen(port,(req,res)=>{
    console.log(`app listen on port ${port}`)
 
})