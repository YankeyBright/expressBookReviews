const axios = require('axios');

// Task 10 - All books with async/await
async function getAllBooks(){
  let result = await axios.get('http://localhost:5000/');
  console.log("Task 10 - All Books:", result.data);
}

// Task 11 - By ISBN with Promise
function getByISBN(isbn){
  axios.get('http://localhost:5000/isbn/'+isbn)
  .then(res => console.log("Task 11 - By ISBN:", res.data));
}

// Task 12 - By Author with async/await
async function getByAuthor(author){
  let res = await axios.get('http://localhost:5000/author/'+author);
  console.log("Task 12 - By Author:", res.data);
}

// Task 13 - By Title with async/await
async function getByTitle(title){
  let res = await axios.get('http://localhost:5000/title/'+title);
  console.log("Task 13 - By Title:", res.data);
}

getAllBooks();
getByISBN("1");
getByAuthor("Chinua Achebe");
getByTitle("Things Fall Apart");
