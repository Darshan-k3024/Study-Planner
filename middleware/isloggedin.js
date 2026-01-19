const Task = require("../models/task")
const Notes = require("../models/notes")
module.exports.isloggedin=(req,res,next)=>{
    console.log(req.user)
    req.session.redirectUrl=req.originalUrl
    if(!req.isAuthenticated()){
        req.flash("error","please login first")
        return res.redirect("/login")
    }
    next()
}


module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.redirectUrl = req.session.returnTo;
  }
  next(); // ✔️ फक्त next, NO redirect
};


module.exports.isOwener = async (req, res, next) => {
  let { id } = req.params;

  let tasks = await Task.findById(id);

  if (!tasks.owener.equals(res.locals.currUser._id)) {
    req.flash("error", "You don't have permission to edit");
    return res.redirect(`/tasks/${id}`);
  }

  next(); // ✅ VERY IMPORTANT
};

module.exports.isAuthor = async (req, res, next) => {
  let { id, noteId } = req.params;

  let notes = await Notes.findById(noteId);

  if (!notes) {
    req.flash("error", "Note not found");
    return res.redirect(`/tasks/show/${id}`);
  }

  if (!notes.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You didn't create this note");
    return res.redirect(`/tasks/show/${id}`)
  }

  next();
};