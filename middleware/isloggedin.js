module.exports.isloggedin=(req,res,next)=>{
    console.log(req.user)
    if(!req.isAuthenticated()){
        req.flash("error","please login first")
        return res.redirect("/login")
    }
    next()
}
