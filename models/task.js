const mongoose = require("mongoose");

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
});

const Task = mongoose.model("Task",taskSchema) 
module.exports = Task


