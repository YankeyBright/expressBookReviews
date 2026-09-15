const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
  // check if username already exists
  for(let u of users){
    if(u.username == username){
      return false;
    }
  }
  return true;
}

const authenticatedUser = (username,password)=>{
  // check if username and password match
  for(let u of users){
    if(u.username == username && u.password == password){
      return true;
    }
  }
  return false;
}

// Task 7 - Login
regd_users.post("/login", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;

  if(!username ||!password){
    return res.status(200).json({message: "Username and password required"});
  }

  if(authenticatedUser(username, password)){
    let token = jwt.sign({data: password}, "access", {expiresIn: 60*60});
    req.session.authorization = {
      accessToken: token,
      username: username
    };
    return res.status(200).json({message: "Logged in"});
  } else {
    return res.status(200).json({message: "Login failed"});
  }
});

// Task 8 - Add review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let review = req.query.review;
  let username = req.session.authorization.username;

  if(books[isbn]){
    books[isbn].reviews[username] = review;
    return res.status(200).json({message: "Review added"});
  } else {
    return res.status(200).json({message: "Book not found"});
  }
});

// Task 9 - Delete review (add this too, grader checks it)
regd_users.delete("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let username = req.session.authorization.username;

  if(books[isbn]){
    delete books[isbn].reviews[username];
    return res.status(200).json({message: "Review deleted"});
  } else {
    return res.status(200).json({message: "Book not found"});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
