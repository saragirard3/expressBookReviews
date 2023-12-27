const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  const authUser = isValid(username);

  if (username === null || username === "" || password === null || password === ""){
    return res.status(400).json({message:"The username and/or password are blank. Try again."} );
  } else if (authUser){
    return res.status(400).json({message:"The user '" + username + "' already exists."} );
  } else {
    users.push({"username":req.body.username,"password":req.body.password});
    return res.status(200).json({message:"The user '" + (req.body.username) + "' has been added!"});
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  let myPromise = new Promise((resolve,reject) => {
    try {
      const data = JSON.stringify(books,null,1); 
      resolve(data);
    } catch(err) {
      reject(err)
    }
  });

  myPromise.then(
    (data) => res.status(200).send(data),
    (err) => res.status(400)
  );
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let myPromise = new Promise((resolve,reject) => {
    try {
      const isbn = req.params.isbn;
      const data = books[isbn]; 
      resolve(data);
    } catch(err) {
      reject(err)
    }
  });

  myPromise.then(
    (data) => res.status(200).send(data),
    (err) => res.status(400)
  );
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let myPromise = new Promise((resolve,reject) => {
    try {
      const bookByAuthor = [];
      const author = req.params.author;
      isbnArray = [1,2,3,4,5,6,7,8,9,10];
      
      isbnArray.forEach(isbn => {
        if(books[isbn].author === author){
          bookByAuthor.push(books[isbn]);
        }
      });

      const data = JSON.stringify(bookByAuthor,null,1); 
      resolve(data);
    } catch(err) {
      reject(err)
    }
  });

  myPromise.then(
    (data) => res.status(200).send(data),
    (err) => res.status(400)
  );
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let myPromise = new Promise((resolve,reject) => {
    try {
      const bookByTitle = [];
      const title = req.params.title;
      isbnArray = [1,2,3,4,5,6,7,8,9,10];
      
      console.log(title);
    
      isbnArray.forEach(isbn => {
        console.log(books[isbn].title);
    
        if(books[isbn].title === title){
          bookByTitle.push(books[isbn]);
        }
      });

      const data = JSON.stringify(bookByTitle,null,1); 
      resolve(data);
    } catch(err) {
      reject(err)
    }
  });

  myPromise.then(
    (data) => res.status(200).send(data),
    (err) => res.status(400)
  );
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  let review = books[isbn].reviews;
  res.send(JSON.stringify(review,null,1));
  // return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
