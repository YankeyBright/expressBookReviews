const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 6 - Register
public_users.post("/register", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;

  if(username && password){
    if(isValid(username)){
      users.push({username: username, password: password});
      return res.status(200).json({message: "User registered"});
    } else {
      return res.status(200).json({message: "User already exists"});
    }
  } else {
    return res.status(200).json({message: "Username and password required"});
  }
});

// Task 1 - Get all books
public_users.get('/',function (req, res) {
  res.send(books);
});

// Task 2 - Get by ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  res.send(books[isbn]);
 });

// Task 3 - Get by Author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author;
  let result = [];
  for(let key in books){
    if(books[key].author == author){
      result.push(books[key]);
    }
  }
  res.send(result);
});

// Task 4 - Get by Title
public_users.get('/title/:title',function (req, res) {
  let title = req.params.title;
  let result = [];
  for(let key in books){
    if(books[key].title == title){
      result.push(books[key]);
    }
  }
  res.send(result);
});

// Task 5 - Get review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;
