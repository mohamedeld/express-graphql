const mongoose = require("mongoose");

mongoose.connect(process.env.mongoDB).then(result=>{
  console.log("connect to db successfully")
}).catch(error=> console.log(error))