const bookModel = require('../model/bookModel.js')
const userModel = require('../model/userModel.js')
const {validateISBN} = require('../validator/validator.js')
const moment = require('moment')
const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const { isValidObjectId } = require('mongoose')

exports.createBook = async ( req , res ) => {
try{
   let body = req.body

   let { title , excerpt , userId , ISBN , category , subcategory , reviews , deletedAt , isDeleted , releasedAt } = body
   
   if( Object.keys(body).length == 0 ) return res.status(400).send({status : false , message : "Body can not be empty"})
           
   
   if( !title || title == " ") return res.status(400).send({status : false , message : "title must be present in body"})
  
   title = body.title = title.trim()
   if( typeof title != "string" ) return res.status(400).send({status : false , message : "Data type of tile only be String"})
  
   let checkTitle = await bookModel.findOne({title:title})    
   if( checkTitle ) return res.status(400).send({status:false , message : "This title already in use for other book"})
       
   if( !excerpt || excerpt == " ") return res.status(400).send({status : false , message : " Excerpt must be present in body "})

   excerpt = excerpt.trim()
   if( typeof excerpt != "string" ) return res.status(400).send({status : false , message : " Data type of excerpt only be String "})

   if( !userId || userId == " ") return res.status(400).send({status : false , message : " UserId must be present in body"})   
   
   userId = userId.trim()
   if(!isValidObjectId(body.userId)) return res.status(400).send({status :false , message : "Invalid objectId"})

   const checkUser = await userModel.findById(userId)
   if(!checkUser) return res.status(404).send({status : false , message : "User is not found"})
  
   
   if( !ISBN || ISBN == " ") return res.status(400).send({status : false , message : " ISBN must be present in body"})
   
   if( typeof ISBN != "string") return res.status(400).send({ status : false , message : "Data type of ISBN only be String"})
   
   if(!validateISBN (ISBN.trim())) return res.status(400).send({ status : false , message : " Invalid ISBN number it should contain only 13 digits"})
   
    const checkISBN = await bookModel.findOne({ISBN : ISBN})
    if( checkISBN) return res.status(400).send({ status: false , message : "This ISBN number is already alotted."})
   
    if( !category || category == " ") return res.status(400).send({ status : false , message : "Category must be present in body"})
    
    category = category.trim()
  if( typeof category != "string") return res.status(400).send({ status : false , message : "Data type of category only be String."})

  
  if( !subcategory || subcategory == " " ) return res.status(400).send({ status : false , message : "Subategory must be present in body"})
  
  subcategory = subcategory.trim()
  if( typeof subcategory != "string" ) return res.status(400).send({ status : false , message : "Data type of subcategory only be String."})

  let today = moment()
  body.releasedAt = today.format('YYYY-MM-DD');
  
   const bookList = await bookModel.create(body)

   return res.status(201).send({status:true, message : "Success" , data: bookList})
}catch(error){

   return res.status(500).send({status:false , message:error.message})
}
}