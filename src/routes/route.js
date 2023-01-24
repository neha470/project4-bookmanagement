const express = require("express");
const router = express.Router();

const { createUser, loginUser } = require("../controller/userController");
const { createBook, getBooks } = require("../controller/bookController");
const reviewController = require("../controller/reviewController");
const middleware = require("../middleware/commonMIddleware");

router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/books", createBook);
router.get("/books", getBooks);

router.all('/*', (req, res) => {
    res.status(400).send({ status: false, message: " path invalid" })
});

module.exports = router;