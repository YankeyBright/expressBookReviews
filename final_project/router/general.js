const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Task 6 - Register
public_users.post("/register", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;
  if(username && password){
    if(isValid(username)){
      users.push({username: username, password: password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists"});
    }
  } else {
    return res.status(404).json({message: "Unable to register user."});
  }
});

// Task 1 - Get all books
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Task 2 - Get by ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  res.send(books[isbn]);
 });

// Task 3 - Get by Author - FIXED to return object not array
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author;
  let filtered = {};
  for(let key in books){
    if(books[key].author == author){
      filtered[key] = books[key];
    }
  }
  res.send(filtered);
});

// Task 4 - Get by Title - FIXED to return object not array
public_users.get('/title/:title',function (req, res) {
  let title = req.params.title;
  let filtered = {};
  for(let key in books){
    if(books[key].title == title){
      filtered[key] = books[key];
    }
  }
  res.send(filtered);
});

// Task 5 - Get review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

// Task 10 - Get all books with Promise callback
public_users.get('/books/promise',function(req,res){
  new Promise((resolve,reject)=>{
    resolve(books);
  }).then((result)=>res.send(result)).catch((err)=>res.status(500).send(err));
});

// Task 11 - Get by ISBN with Promise
public_users.get('/books/isbn/:isbn/promise',function(req,res){
  let isbn = req.params.isbn;
  new Promise((resolve,reject)=>{
    if(books[isbn]) resolve(books[isbn]);
    else reject("ISBN not found");
  }).then((result)=>res.send(result)).catch((err)=>res.status(404).json({message:err}));
});

// Task 12 - Get by Author with async/await + axios
public_users.get('/books/author/:author/async', async function(req,res){
  try{
    let author = req.params.author;
    // Using axios to call our own endpoint as per task requirement
    let response = await axios.get(`http://localhost:5000/author/${author}`);
    res.send(response.data);
  }catch(err){
    res.status(404).json({message:"Author not found"});
  }
});

// Task 13 - Get by Title with async/await + axios
public_users.get('/books/title/:title/async', async function(req,res){
  try{
    let title = req.params.title;
    let response = await axios.get(`http://localhost:5000/title/${title}`);
    res.send(response.data);
  }catch(err){
    res.status(404).json({message:"Title not found"});
  }
});

module.exports.general = public_users;
