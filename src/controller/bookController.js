const moment = require("moment");
const { isValidObjectId } = require("mongoose");

const bookModel = require("../model/bookModel.js");
const userModel = require("../model/userModel");
const reviewModel = require("../model/reviewModel");
const { validateISBN } = require("../validator/validator.js");


const createBook = async function (req, res) {
    try {
        let body = req.body;
        let { title, excerpt, userId, ISBN, category, subcategory, reviews, deletedAt, isDeleted, releasedAt } = body;

        if (Object.keys(body).length == 0) {
            return res.status(400).send({ status: false, message: "Body can not be empty" });
        }

        if (!title || title == " ") {
            return res.status(400).send({ status: false, message: "title must be present in body" });
        }

        title = title.toLowerCase().trim();
        if (typeof title != "string") {
            return res.status(400).send({ status: false, message: "Data type of title only be String" });
        }

        let checkTitle = await bookModel.findOne({ title: title });
        if (checkTitle) {
            return res.status(400).send({ status: false, message: "This title already in use for other book" });
        }

        if (!excerpt || excerpt == " ") {
            return res.status(400).send({ status: false, message: " Excerpt must be present in body " });
        }

        excerpt = excerpt.trim();
        if (typeof excerpt != "string") {
            return res.status(400).send({ status: false, message: " Data type of excerpt only be String " });
        }

        if (!userId || userId == " ") {
            return res.status(400).send({ status: false, message: " UserId must be present in body" });
        }

        userId = userId.trim();
        if (!isValidObjectId(body.userId)) {
            return res.status(400).send({ status: false, message: "Invalid objectId" });
        }

        const checkUser = await userModel.findById(userId);
        if (!checkUser) {
            return res.status(404).send({ status: false, message: "User is not found" });
        }

        if (!ISBN || ISBN == " ") {
            return res.status(400).send({ status: false, message: " ISBN must be present in body" });
        }

        if (typeof ISBN != "string") {
            return res.status(400).send({ status: false, message: "Data type of ISBN only be String" });
        }

        if (!validateISBN(ISBN.trim())) {
            return res.status(400).send({ status: false, message: " Invalid ISBN number it should contain only 13 digits" });
        }

        const checkISBN = await bookModel.findOne({ ISBN: ISBN });
        if (checkISBN) {
            return res.status(400).send({ status: false, message: "This ISBN number is already alotted." });
        }

        if (!category || category == " ") {
            return res.status(400).send({ status: false, message: "Category must be present in body" });
        }

        category = category.trim();
        if (typeof category != "string") {
            return res.status(400).send({ status: false, message: "Data type of category only be String." });
        }

        if (!subcategory || subcategory == " ") {
            return res.status(400).send({ status: false, message: "Subategory must be present in body" });
        }

        subcategory = subcategory.trim();
        if (typeof subcategory != "string") {
            return res.status(400).send({ status: false, message: "Data type of subcategory only be String." });
        }

        let today = moment();
        body.releasedAt = today.format('YYYY-MM-DD');

        const bookList = await bookModel.create(body);

        res.status(201).send({ status: true, message: "Success", data: bookList });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


const getBooks = async function (req, res) {
    try {
        let data = req.query;
        const { userId, category, subcategory } = data;

        if (userId) {
            if (!isValidObjectId(userId)) {
                return res.status(400).send({ status: false, message: "Invalid User ID. The length of the ID should equals to 24." });
            }

            const checkUserId = await userModel.findOne({ _id: userId });
            if (!checkUserId) {
                return res.status(404).send({ status: false, message: "Data not found with this User ID. Please enter a valid User ID." });
            }
        }

        const bookDetails = await bookModel.find({ ...data, isDeleted: false }).sort({ title: 1 });
        if (bookDetails.length == 0) {
            return res.status(404).send({ status: false, message: "Data not found or data already deleted." });
        }

        res.status(200).send({ status: true, message: "Books List.", data: bookDetails });
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
}


const getBookById = async function (req, res) {
    try {
        let bookId = req.params.bookId;
        if (!bookId) {
            return res.status(400).send({ status: false, message: "Please provide book Id in param." });
        }

        if (!isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: "Invalid ObjectId." });
        }

        let getBookData = await bookModel.findOne({ _id: bookId, isDeleted: false }).select({ _id: 1 });
        if (!getBookData) {
            return res.status(404).send({ status: false, message: "No book exist on this id or it might be deleted." });
        }

        let id = getBookData._id;

        let reviewData = await reviewModel.find({ bookId: id, isDeleted: false }).select({ _id: 1, bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1 });

        let reviewCount = reviewData.length;

        let getReviewList = await bookModel.findOne({ _id: bookId, isDeleted: false }).select({ __v: 0, deletedAt: 0 });

        getReviewList._doc.reviewsData = reviewData;
        getReviewList._doc.reviews = reviewCount;

        return res.status(200).send({ status: true, message: 'Books List', data: getReviewList });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}


const updateBooks = async function (req, res) {
    try {
        let data = req.body;
        let BookID = req.params.bookId;
        const { title, excerpt, ISBN, releasedAt } = data;
        if (Object.keys(data).length != 0) {

            if (!title && !excerpt && !ISBN && !releasedAt) {
                return res.status(400).send({ status: false, message: "At least one field is required." });
            }

            let updateData = {};
            if (title) {
                let trimTitle = title.toLowerCase().trim();
                const checkTitle = await bookModel.findOne({ title: trimTitle });
                if (checkTitle) {
                    return res.status(400).send({ status: false, message: `The title ${trimTitle} is already is in use for a Book.Try another one.` });
                }
                updateData.title = trimTitle;
            }

            if (excerpt) {
                let trimExcerpt = excerpt.toLowerCase().trim();
                updateData.excerpt = trimExcerpt;
            }

            if (ISBN) {
                let trimISBN = ISBN.trim();
                if (!validateISBN(trimISBN)) {
                    return res.status(400).send({ status: false, message: " Invalid ISBN number it should contain only 13 digits" });
                }
                const checkISBN = await bookModel.findOne({ ISBN: trimISBN });
                if (checkISBN) {
                    return res.status(400).send({ status: false, message: `The ISBN ${trimISBN} is already is in use for a Book.Try another one.` });
                }
                updateData.ISBN = trimISBN;
            }

            if (releasedAt) {
                let trimReleasedAt = releasedAt.trim();
                if (moment(trimReleasedAt, "YYYY-MM-DD").format("YYYY-MM-DD") !== trimReleasedAt) {
                    return res.status(400).send({ status: false, message: "Please enter the Date in the format of 'YYYY-MM-DD'." });
                }
                updateData.releasedAt = trimReleasedAt;
            }

            const updateBookDetails = await bookModel.findOneAndUpdate(
                { _id: BookID, isDeleted: false },
                updateData,
                { new: true }
            );

            if (!updateBookDetails) {
                return res.status(404).send({ status: false, message: "No data found for updation." });
            }
            res.status(200).send({ status: true, message: "Success", data: updateBookDetails });
        } else {
            return res.status(400).send({ status: false, message: "Invalid request, body can't be empty." });
        }
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
}


const deleteBookById = async function (req, res) {
    try {
        let bookId = req.params.bookId;
        let deleteByBookId = await bookModel.findOneAndUpdate(
            { _id: bookId, isDeleted: false },
            { isDeleted: true, deletedAt: Date.now() },
            { new: true }
        );

        if (!deleteByBookId) {
            return res.status(400).send({ status: false, message: "Book is already deleted, deletion unsuccessful" });
        }
        res.status(200).send({ status: true, message: "Success", data: deleteByBookId });
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
    }
}


module.exports = { createBook, getBooks, getBookById, updateBooks, deleteBookById };