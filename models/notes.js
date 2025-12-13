
const mongoose = require("mongoose");

const notesSchema = new mongoose.Schema({
    taskId:{
        type:mongoose.Schema.ObjectId,
        ref:"Task",
        required:true,
    },
    text:{
        type:String,
        required:true,

    },
   


})

const Notes = mongoose.model("Notes",notesSchema)
module.exports= Notes