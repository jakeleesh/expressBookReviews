const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

// Register a new user
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

function getBooks() {
    return new Promise((resolve, reject) => {
        // Simulate an asynchronous operation, e.g., database call
        setTimeout(() => {
            resolve(books);
        }, 100);
    });
}

async function fetchBookDetails(isbn) {
    return new Promise((resolve, reject) => {
        // Simulate an asynchronous operation, e.g., database call
        setTimeout(() => {
            resolve(books[isbn]);
        }, 100);
    });
}

// Get the book list available in the shop
public_users.get('/', async(req, res) => {
  //Write your code here
    const books = await getBooks()
    res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const book = await fetchBookDetails(isbn)
  res.send(book)
  // return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
    const author = req.params.author;
    const bookKeys = Object.keys(books);
    const booksByAuthor = [];

    bookKeys.forEach(key => {
        const book = books[key];
        if (book.author === author) {
            booksByAuthor.push(book);
        }
    });

    if (booksByAuthor.length > 0) {
        res.json(booksByAuthor);
    } else {
        res.status(404).send('No books found by this author');
    }   
  // return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
    const title = req.params.title;
    const bookKeys = Object.keys(books);
    const booksByTitle = [];

    bookKeys.forEach(key => {
        const book = books[key];
        if (book.title === title) {
            booksByTitle.push(book);
        }
    });

    if (booksByTitle.length > 0) {
        res.json(booksByTitle);
    } else {
        res.status(404).send('No books found');
    }  
  // return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews)
  // return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
