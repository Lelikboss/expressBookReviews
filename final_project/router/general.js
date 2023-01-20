const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
      if (!isValid(username)) {
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});
      }
    }
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
   try {
      res.send(JSON.stringify(books, null, 4))
   } catch (error) {
      res.status(500).send(error);
   }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
        const isbn = await  req.params.isbn;
        res.send(books[isbn])
    } catch (error) {
        res.status(500).send(error);
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  try {
        const author = await req.params.author
        let filtered_books =  Object.values(books).filter(book => book.author === author)
        if(filtered_books.length >= 1){
            res.send(filtered_books)
        } else {
            res.send("Author not found.")
        }
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
    try {
        const title = await req.params.title
        let filtered_books = Object.values(books).filter(book => book.title === title)
        if(filtered_books.length >= 1){
            res.send(filtered_books)
        } else {
            res.send("Book not found.")
        }
    } catch (error) {
        
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send({reviews: books[isbn].reviews})
});

module.exports.general = public_users;
