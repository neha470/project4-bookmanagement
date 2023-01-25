const JWT = require("jsonwebtoken");
const mongoose = require("mongoose");

const userModel = require("../model/userModel");
const bookModel = require("../model/bookModel");
const ObjectId = mongoose.Types.ObjectId;


const isAuthenticated = async function (req, res, next) {
    try {

        let token = req.headers['x-api-key'];
        if (!token) {
            return res.status(400).send({ status: false, message: "Token must be Present." });
        }

        JWT.verify(token, "project4grp14", function (err, decodedToken) {
            if (err) {
                if (err.name === 'JsonWebTokenError') {
                    return res.status(401).send({ status: false, message: "invalid token" });
                }

                if (err.name === 'TokenExpiredError') {
                    return res.status(401).send({ status: false, message: "you are logged out, login again" });
                } else {
                    return res.send({ msg: err.message });
                }
            } else {
                req.token = decodedToken
                next()
            }
        });

    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message })
    }
}


const isAuthorized = async function (req, res, next) {
    try {
        const loggedUserId = req.token.userId;
        if (req.originalUrl === "/books") {
            let userId = req.body.userId;
            if (!userId || !userId.trim()) {
                return res.status(400).send({ status: false, message: "userId must be present" });
            }

            userId = userId.trim();
            if (!ObjectId.isValid(userId)) {
                return res.status(400).send({ status: false, message: "Invalid user id" });
            }
            const userData = await userModel.findById(userId);
            if (!userData) {
                return res.status(404).send({ status: false, message: "The user id does not exist" });
            }
            if (loggedUserId != userId) {
                return res.status(403).send({ status: false, message: "Not authorized,please provide your own user id for book creation" });
            }
        } else {
            let bookId = req.params.bookId;
            if (!bookId) {
                return res.status(400).send({ status: false, message: "book id is mandatory" });
            }

            if (!ObjectId.isValid(bookId)) {
                return res.status(400).send({ status: false, message: "Invalid Book ID" });
            }

            let checkBookId = await bookModel.findById(bookId);
            if (!checkBookId) {
                return res.status(404).send({ status: false, message: "Data Not found with this book id, Please enter a valid book id" });
            }

            let userId = checkBookId.userId;
            if (userId != loggedUserId) {
                return res.status(403).send({ status: false, message: "Not authorized,please provide your own book id" });
            }
        }
        next();
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
}


module.exports = { isAuthenticated, isAuthorized };