const userModel = require("../model/userModel")
const {validateName,validateEmail,validatePassword,validateMobileNo,validatePincode}=require("../validator/validator")


const createUser = async function (req,res){
    try{
        let data = req.body
        let { title,name,phone,email,password,address} = data

        if (Object.keys(data).length == 0)
        return res.status(400).send({ status: false, message: "Request can't be empty" });
        if (!title || title=="" ) return res.status(400).send({status:false,message:"Title must be required or can't be empty"})
        if (typeof title !="string" ) return res.status(400).send({status:false,message:"Title must be in string"})
        if (!["Mr", "Mrs", "Miss"].includes(title.trim()))
                    return res.status(400).send({ status: false, message: "please use a valid title as Mr,Mrs,Miss"});

        if (!name || name=="") return res.status(400).send({status:false,message:"Name must be required or it can't be empty"})
        if (!validateName(name.trim())) return res.status(400).send({status:false,message:"Enter a valid name"})
        if (!phone || phone=="") return res.status(400).send({status:false,message:"Phone number must be required or can't be empty"})
        if (!validateMobileNo(phone.trim())) return res.status(400).send({status:false,message:"Enter a valid indian format number"})
        const existPhone = await userModel.findOne({phone:phone})
         if(existPhone) return res.status(400).send({status:false,message:"phone is already exist,enter a unique number"})

        // data.email=email.trim()
        if (!email || email=="") return res.status(400).send({status:false,message:"Email must be required or email can't be empty"})
        if (!validateEmail(email.trim())) return res.status(400).send({status:false,message:"Enter a valid email"})
        const existEmail = await userModel.findOne({email:email})
         if(existEmail) return res.status(400).send({status:false,message:"Email already exist,it should be unique"})

        
        if (!password || password=="") return res.status(400).send({status:false,message:"password must be required or password can't be empty"})
        if (!validatePassword(password.trim())) return res.status(400).send({status:false,message:"Must be 8-15 length,consist of mixed character and special character"})

        
        if (!address || address=="") return res.status(400).send({status:false,message:"address must be required or it can't be empty"})
        let {street,city,pincode} = address
        address.street=street.trim()
        address.city=city.trim()
        if(!validatePincode(pincode.trim())) return res.status(400).send({status:false,message:"Enter a valid pincode"})

        let userDetails= await userModel.create(data)
        return res.status(201).send({status:true,message:"Success",data:userDetails})

    }catch(error){
        return res.status(500).send({status:false,message:error.message})
    }
}


module.exports.createUser=createUser