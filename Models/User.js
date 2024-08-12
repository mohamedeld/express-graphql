const {Schema,model,models} = require("mongoose");

const UserSchema = new Schema({
  name:{
    type:String,
    required:[true,"name is required"]
  },
  email:{
    type:String,
    required:[true,"email is required"],
    unique:true
  },
  password:{
    type:String,
    required:[true,"password is required"]
  },
})

const User = models.User || model("User",UserSchema)

module.exports = User;