const express = require("express");
const Book = require("../models/Book");
const router = express.Router();

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
}
// Create a new book entry
router.post("/", isAuthenticated, async (req, res) => {
  try {
    // Extract authenticated user from the request object
    const author = req.user._id;

    const bookData = { ...req.body, author };

    const book = await Book.create(bookData);
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a book entry
router.patch("/:id", isAuthenticated, async (req, res) => {
  try {
    const bookId = req.params.id;

    const updatedFields = {};
    if (req.body.title != null) {
      updatedFields.title = req.body.title;
    }
    if (req.body.publicationYear != null) {
      updatedFields.publicationYear = req.body.publicationYear;
    }

    // Ensure that the user can only update their own book entries
    const updatedBook = await Book.findOneAndUpdate(
      { _id: bookId, author: req.user._id }, // Filter by book ID and author (user)
      { $set: updatedFields }, // Set the updated fields
      { new: true } // Return the updated document
    );

    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(updatedBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a book entry
router.delete("/:id", isAuthenticated, async (req, res) => {
  try {
    const bookId = req.params.id;

    // Ensure that the user can only delete their own book entries
    const deletedBook = await Book.findOneAndDelete({
      _id: bookId,
      author: req.user._id, // Filter by book ID and author (user)
    });

    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json({ message: "Deleted Book" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Retrieve all book entries with optional filtering by author or publication year
router.get("/", async (req, res) => {
  try {
    let query = {};

    // Check if author query parameter is present
    if (req.query.author) {
      query.author = req.query.author;
    }

    // Check if publicationYear query parameter is present
    if (req.query.publicationYear) {
      query.publicationYear = req.query.publicationYear;
    }

    const books = await Book.find(query);
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const bookId = req.params.id;
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
