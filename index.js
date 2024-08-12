const express = require("express");
const {buildSchema} = require("graphql");
const {graphqlHTTP} = require("express-graphql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./Models/User");
require("dotenv/config");
require("./connection");
const app = express();



const schema = buildSchema(`
  type User{
    name:String
    email:String
  }
  type Query{
    test:String
    getAllUsers:[User]
  }
  input userInput{
    name:String!
    email:String!
    password:String!
  }
  input userLogin{
    email:String!
    password:String!
  }
  type Mutation{
    createUser(input:userInput):User
    loginUser(input:userLogin):String
  }
`)
const UserQueries = {
  getAllUsers: async ()=>{
    const users = await User.find({});
    return users;
  }
}
const UserMutations = {
  createUser:async({input})=>{
    const {name,email,password} = input;
    const hashedPassword = await bcrypt.hash(password,10);
    const newUser = await User.create({name,email,password:hashedPassword});
    return {name,email}
  },
  loginUser:async({input})=>{
    const {email,password} = input;
    const user = await User.findOne({email});
    if(!user){
      throw new Error("email not found");
    }
    const hashPassword = await bcrypt.compare(password,user.password);
    if(!hashPassword){
      throw new Error("invalid email or password");
    }
    const token = jwt.sign({userId:user?._id},process.env.SECRET_KEY,{expiresIn:process.env.EXPIRES_AT});
    return token
  }
}
const resolvers = {
  ...UserQueries,
  ...UserMutations
} 
const port = 3000;
app.use('/graphql',graphqlHTTP({schema,rootValue:resolvers,graphiql:true}));

app.listen(port,()=>{
  console.log(`Server is running on port ${port}`)
})