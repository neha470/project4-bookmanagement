const express = require("express");
const router = express.Router();

const { createUser, loginUser } = require("../controller/userController");
const { createBook, getBooks, getBookById, updateBooks, deleteBookById } = require("../controller/bookController");
const { reviewBook, updateBookReview, deleteReviewById } = require("../controller/reviewController");
const { isAuthenticated, isAuthorized } = require("../middleware/commonMIddleware");


router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/books", isAuthenticated, isAuthorized, createBook);
router.get("/books", isAuthenticated, getBooks);
router.get("/books/:bookId", isAuthenticated, getBookById);
router.put("/books/:bookId", isAuthenticated, isAuthorized, updateBooks);
router.delete("/books/:bookId", isAuthenticated, isAuthorized, deleteBookById);
router.post("/books/:bookId/review", reviewBook);
router.put("/books/:bookId/review/:reviewId", updateBookReview);
router.delete("/books/:bookId/review/:reviewId", deleteReviewById);

router.all('/*', (req, res) => {
    res.status(400).send({ status: false, message: " path invalid" });
});

module.exports = router;