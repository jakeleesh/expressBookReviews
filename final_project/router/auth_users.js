const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;
    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
    const username = req.session.username; // Assuming session contains the username
    const { review } = req.body;

    // Check if the book exists
    if (!books[isbn]) {
        return res.status(404).send('Book not found');
    }

    // Validate the review content
    if (!review) {
        return res.status(400).send('Review content is required');
    }

    // Retrieve the reviews for the book
    const reviews = books[isbn].reviews;

    // Find the review by the current user
    const userReview = reviews.find(r => r.username === username);

    // Check if the review exists
    if (!userReview) {
        return res.status(404).send('Review not found');
    }

    // Update the review content
    userReview.review = review;
    res.send('Review updated successfully');
});

regd_users.delete('/auth/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.username; // Assuming session contains the username

    // Check if the book exists
    if (!books[isbn]) {
        return res.status(404).send('Book not found');
    }

    // Retrieve the reviews for the book
    const reviews = books[isbn].reviews;

    // Find the index of the review by the current user
    const reviewIndex = reviews.findIndex(review => review.username === username);

    // Check if the review exists and the user is authorized to delete it
    if (reviewIndex === -1) {
        return res.status(403).send('Review not found or not authorized to delete');
    }

    // Remove the review from the array
    reviews.splice(reviewIndex, 1);
    res.send('Review deleted successfully');
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
