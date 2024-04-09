const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
    //write code to check is the username is valid
}

const authenticatedUser = (username, password) => { //returns boolean
    const user = users.find(e => e.username == username);
    if (!user) {
        return false;
    }
    return password == user.password;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.query.username;
    const password = req.query.password;

    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
        req.session.authorization = { accessToken, username }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const rating = req.query.rating;
    const review = req.query.review;
    const username = req.session.authorization["username"];

    if (!books[isbn]) {
        return res.status(400).json({message: "No book with given isbn was found."});
    }

    books[isbn].reviews[username] = { rating: rating, review: review };
    return res.status(200).json({ message: "Review added / changed successfully." });
});

// Add a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization["username"];

    if (!books[isbn]) {
        return res.status(400).json({message: "No book with given isbn was found."});
    }

    delete books[isbn].reviews[username];
    return res.status(200).json({ message: "Review deleted successfully." });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
