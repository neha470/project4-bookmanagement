const express = require("express");
const router = express.Router();

const userController = require("../controller/userController");
const bookController = require("../controller/bookController");
const reviewController = require("../controller/reviewController");
const middleware = require("../middleware/commonMIddleware");

router.post("/register");
router.post("/login");
router.post("/books");
router.get("/books");

router.all('/*',(req ,res)=>{
    res.status(400).send({status: false , message :" path invalid"})
});

module.exports = router;