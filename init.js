const task = require("./models/task")
const mongoose = require("mongoose")


main()
.then(() => {
  console.log("connection successful");
})
.catch((err) => {
  console.error("mongo connect error:", err);
});

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/study-planner");
}

task.insertMany([
    {
      title:"DBMS-revision",
      subject:"DBMS",
      description:"study for end sem exam",   // corrected spelling
      dueDate:new Date(),
      priority:"Medium",
    },
    {
      title:"OOPS-revision",
      subject:"OOP",
      description:"study for end sem exam",   // corrected spelling
      dueDate:new Date(),
      priority:"Medium",
    },
])               
.then((result)=>{ 
    console.log(result)
})               
.catch((err)=>{
    console.log(err)
})
