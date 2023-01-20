const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{  
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
    return res.status(200).send(`Customer ${username} successfully logged in.`);
    } else {
      return res.status(208).json({message: `Invalid Login (${username}). Check username and password`});
    }});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let currentUsername = req.session.authorization.username
    let existingReview = books[isbn].reviews[currentUsername]
    if(req.body.review === ""){
        res.send({msg: `Empty request. ${currentUsername}, please, write a review!`})
    } else{
        if(existingReview){
            books[isbn].reviews[currentUsername] = req.body.review
            res.send({msg: `${currentUsername}, your review updated succefully!`,
            reviews: [books[isbn].reviews]})
        } else {
            books[isbn].reviews[currentUsername] = req.body.review
            res.send({msg: `${currentUsername}, your review added succefully!`,
            reviews: [books[isbn].reviews]})
        }
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let currentUsername = req.session.authorization.username
    let reviewer = books[isbn].reviews[currentUsername]
    if(reviewer){
        delete books[isbn].reviews[currentUsername]
        res.send(`${currentUsername}, your review has been deleted successfully.`)
    } else {
        res.send(`${currentUsername}, your review is missing.`)
    }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
