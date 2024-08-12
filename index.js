const express = require("express");
const {buildSchema} = require("graphql");
const {graphqlHTTP} = require("express-graphql");
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
  type Mutation{
    createUser(input:userInput):User
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
    const newUser = await User.create({name,email,password});
    return {name,email}
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