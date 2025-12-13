const mongoose = require("mongoose");
const notes = require("./notes");
const { TaskSchema } = require("../schema");
const Notes = require("./notes");
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    validate: v => !/^\d+$/.test(v)   // ❌ only numbers not allowed
  },

  subject: {
    type: String,
    trim: true,
    default: "General",
  },

  description: {
    type: String,
    trim: true,
    validate: v => !/^\d+$/.test(v)   // ❌ only numbers not allowed
  },

  dueDate: {
    type: Date,
    required: true,
  },

  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Low",
  },

  status: {
    type: String,
    enum: ["pending", "in progress", "completed"],
    default: "pending",
  },

  notes:[
    {
      type:mongoose.Schema.ObjectId,
      ref:"Notes"
    }
  ]
});

taskSchema.post("findOneAndDelete",async(task)=>{
  if(task){
    await Notes.deleteMany({_id:{$in:task.notes}})
  }
})

const Task = mongoose.model("Task",taskSchema) 
module.exports = Task


