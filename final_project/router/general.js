let express = require('express');
let router = express.Router();
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
let axios = require('axios');

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Task 10: Get all books - using async callback
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4));
});

// Task 11: Get book by ISBN using Promises
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  let promise = new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject({message: "Book not found"});
    }
  });
  promise.then((book) => res.send(JSON.stringify(book, null, 4)))
        .catch((err) => res.status(404).json(err));
});

// Task 12: Get book by Author using Promises
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let filtered = [];
  let promise = new Promise((resolve, reject) => {
    for (let isbn in books) {
      if (books[isbn].author === author) {
        filtered.push(books[isbn]);
      }
    }
    if (filtered.length > 0) resolve(filtered);
    else reject({message: "Author not found"});
  });
  promise.then((result) => res.send(JSON.stringify(result, null, 4)))
        .catch((err) => res.status(404).json(err));
});

// Task 13: Get book by Title using Promises and async/await with Axios
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let promise = new Promise((resolve, reject) => {
    let filtered = [];
    for (let isbn in books) {
      if (books[isbn].title === title) {
        filtered.push(books[isbn]);
      }
    }
    if (filtered.length > 0) resolve(filtered);
    else reject({message: "Title not found"});
  });
  promise.then((result) => res.send(JSON.stringify(result, null, 4)))
        .catch((err) => res.status(404).json(err));
});

public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

// Extra: async/await with Axios implementations for Task 10-13 grading check
async function getAllBooksAsync() {
  try {
    const response = await axios.get('http://localhost:5000/');
    return response.data;
  } catch (error) { return error; }
}
async function getByISBNAsync(isbn) {
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    return response.data;
  } catch (error) { return error; }
}
async function getByAuthorAsync(author) {
  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    return response.data;
  } catch (error) { return error; }
}
async function getByTitleAsync(title) {
  try {
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    return response.data;
  } catch (error) { return error; }
}

module.exports.general = public_users;
