const express = require('express');
let books = require("./booksdb.js");
const { restart } = require('nodemon');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const username = req.query.username;
    const password = req.query.password;

    if (!username) {
        return res.status(400).json({ message: "username parameter is required." });
    }

    if (!password) {
        return res.status(400).json({ message: "password parameter is required." })
    }

    if (users.find(u => u === username)) {
        return res.status(409).json({ message: "username is already registered." })
    }

    users.push({ username: username, password: password })
    return res.status(200).json({ message: "New user registered successfully." })
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
    const bookRes = JSON.stringify(books);

    if (bookRes && bookRes.length > 0) {
        return res.send(books);
    } else {
        return res.status(404).json({ message: "No books in stock." });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    const bookRes = JSON.stringify(books[req.params.isbn]);

    if (bookRes && bookRes.length > 0) {
        return res.status(200).json(bookRes);
    } else {
        return res.status(404).json({ message: "No books with given isbn were found." });
    }
});

// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
    const authorBooks = Object.values(books).filter(b => b.author === req.params.author);
    const bookRes = JSON.stringify(authorBooks)

    if (bookRes && bookRes.length > 0) {
        return res.status(200).json(bookRes);
    } else {
        return res.status(404).json({ message: "No books by the given author were found." });
    }
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
    const titleBooks = Object.values(books).filter(b => b.title === req.params.title);
    const bookRes = JSON.stringify(titleBooks)

    if (bookRes && bookRes.length > 0) {
        return res.status(200).json(bookRes);
    } else {
        return res.status(404).json({ message: "No books with the given title were found." });
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const book = books[req.params.isbn];
    if (!book) {
        return res.status(404).json({ message: "No books with given isbn were found." })
    }

    const reviewsRes = JSON.stringify(books[req.params.isbn].reviews);

    if (reviewsRes && reviewsRes.length > 0) {
        return res.status(200).json(reviewsRes);
    } else {
        return res.status(404).json({ message: "No reviews for the given book were found." });
    }
});

module.exports.general = public_users;
