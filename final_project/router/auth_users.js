const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }
  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let book = books[isbn];
  let reviews = books[isbn].reviews;
  let numberOfReviews = Object.keys(reviews).length

  if(book){ //check if book exists
    let review = req.body.review;
    let user = req.body.username;

    if (reviews[user]){
      reviews[user] = review;
      res.send(JSON.stringify(reviews,null,1));
    } else {
      Object.assign(reviews, {[user] : review});
      res.send(JSON.stringify(reviews,null,1));
    }

  } else {
    res.send("Unable to find book!");
  }

});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let reviews = books[isbn].reviews;
  let review = req.body.review;
  let user = req.body.username;

  if (reviews[user]){
    if(reviews[user]===review){
      delete reviews[user];
      res.send(`Book Review for ${user} has been successfully deleted`);  
    }
  }

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
