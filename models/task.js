const mongoose = require("mongoose")

const taskSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true,
    },
    subject:{
        type:String,
        trim:true,
        default:"General",
    },
    description:{
        type:String,
        trim:true,
    },
    dueDate:{
        type:Date,
    },
    priority:{
        type:String,
        enum:["Low","Medium","High"],
        default:"Low",
    },
    status:{
        type:String,
        enum:["pending","in progress","completed"],
        default:"pending",
    },
})

const Task = mongoose.model("Task",taskSchema)
module.exports = Task
