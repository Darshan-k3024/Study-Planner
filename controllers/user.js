const User = require("../models/user.js")

module.exports.signUp=async (req, res) => {
        try {
            let { username, email, password } = req.body
            const newUser = new User({ email, username })
            const registerdUser = await User.register(newUser, password)
            req.logIn(registerdUser, (err) => {
                if (err) {
                    return next(err)
                }

                req.flash("success", "welcome to study-planner")
                res.redirect("/tasks")
            })
        }
        catch (e) {
            req.flash("error", "please create account")
            res.send(e.message)
        }
   }

module.exports.login=async (req, res) => {
        req.flash("success", "Welcome to Study-Planner")
        // here when usre are logout and try to add tasks  thenn after tpuch the add task and login then serve the add tasks fomr 
        let redirectUrl = res.locals.redirectUrl || "/tasks"
        res.redirect(redirectUrl)


    }