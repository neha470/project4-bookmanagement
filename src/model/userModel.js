const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
    title: {
        type:String,
        required:true,
        enum:["Mr", "Mrs", "Miss"],
        trim:true
    },
    name: {
        type:String,
        required:true,
        trim:true
    },
    phone: {
        type:String,
        required:true,
        unique:true
    },
    email: {
        type:String,
        required:true,
        unique:true
    }, 
    password: {
        type:String,
        required:true,
        minLength:8,
        maxLength:15
    },
    address: {
      street: {type:String,trim:true},
      city: {type:String,trim:true},
      pincode: {type:String}
    },
},{timestamps:true})

module.exports = mongoose.model('userData', userSchema)