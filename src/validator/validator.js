const validateName = (name) => { 
    return (/^(?=.{1,50}$)[a-z]+(?:['_.\s][a-z]+)*$/i.test(name)); 
}

const validateEmail = (email) => { 
    return (/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/.test(email)); 
}

const validatePassword = (password) => { 
    return (/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/.test(password)); 
}

const validateMobileNo = (Number) => { 
    return ((/^((\+91)?|91)?[6789][0-9]{9}$/g).test(Number)); 
}

const validatePincode = (pincode) => { 
    return (/^[1-9][0-9]{5}$/).test(pincode) ;
}

const validateISBN = (ISBN) => { 
    return (/^(?=(?:\D*\d){13}(?:(?:\D*\d){3})?$)[\d-]+$/g).test(ISBN) ;
}

module.exports = { validateName, validateEmail, validatePassword, validateMobileNo, validatePincode, validateISBN }
