const JWT = require('jsonwebtoken')
const userModel = require("../Model/userModel")
const bookModel = require('../Model/bookModel')

const Authentication = async (req, res, next) => {
    try {
        let token = req.headers['x-api-key']
        if (!token) { return res.status(400).send({ status: false, message: "Token must be Present." }) }

        JWT.verify(token, "project4grp14", function (error, decodedToken) {
            if (error) {
                return res.status(401).send({ status: false, message: "Invalid Token." })
            } else {
                req.token = decodedToken
                next()
            }

        })

    } catch (error) {

        res.status(500).send({ status: 'error', error: error.message })
    }

}

module.exports={Authentication}