
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
   author:{
    type:mongoose.Schema.ObjectId,
    ref:"User",
   },


})

const Notes = mongoose.model("Notes",notesSchema)
module.exports= Notes