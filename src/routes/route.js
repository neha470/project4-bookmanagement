const express = require("express");
const router = express.Router();

const { createUser, loginUser } = require("../controller/userController");
const { createBook, getBooks, getBookById, updateBooks, deleteBookById } = require("../controller/bookController");
const reviewController = require("../controller/reviewController");
const { isAuthenticated, isAuthorized } = require("../middleware/commonMIddleware");

router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/books", isAuthenticated, isAuthorized, createBook);
router.get("/books", isAuthenticated, getBooks);
router.get("/books/:bookId", isAuthenticated, getBookById);
router.put("/books/:bookId", isAuthenticated, isAuthorized, updateBooks);
router.delete("/books/:bookId", isAuthenticated, isAuthorized, deleteBookById);

router.all('/*', (req, res) => {
    res.status(400).send({ status: false, message: " path invalid" })
});

module.exports = router;