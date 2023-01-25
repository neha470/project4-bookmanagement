const reviewModel=require("../model/reviewModel")
const bookModel=require("../model/bookModel")
const userModel=require("../model/userModel")
const {validateName}=require("../validator/validator")
const { default: mongoose } = require("mongoose")
const ObjectId=mongoose.Types.ObjectId;


const reviewBook=async function(req,res){
    const bookId=req.params.bookId;
    if(!bookId) return res.status(400).send({status:false,message:"please provide book id"})

    if(!ObjectId.isValid(bookId)) return res.status(400).send({status:false,message:"Invalid book id"})

    const checkBook=await bookModel.findOne({_id:bookId,isDeleted:false})
    if(!checkBook) return res.status(404).send({status:false,message:"Book id does not exist in database"})

    let data=req.body
    let {review,rating,reviewedBy}=data

    if(!rating) return res.status(400).send({status:false,message:"please provide rating, it is mandatory"})
    rating=parseFloat(rating);
    if(!rating || (!(rating<=5 && rating>=1))) return res.status(400).send({status:false,message:"rating is invalid"})
    data.rating=rating

    if(!review || !review.trim()) return res.status(400).send({status:false,message:"review can't be empty"})
    if(review){
        review=review.trim();
        if(typeof review !="string") return res.status(400).send({status:false,message:"review must be string"})
        data.review=review;
    }

    if(reviewedBy){
        reviewedBy=reviewedBy.trim()
        if(! validateName(reviewedBy)) return res.status(400).send({status:false,message:"reviewer name is invalid"})
    }

    data['bookId']=bookId                                                                                             
    data['reviewedAt']=Date.now()

    const reviewData=await reviewModel.create(data);
    let result={_id:reviewData._id,bookId:reviewData.bookId,reviewedBy:reviewData.reviewedBy,reviewedAt:reviewData.reviewedAt,rating:reviewData.rating,review:reviewData.review}
    return res.status(201).send({status:true,message:"Success",data:result})
}

module.exports={reviewBook}