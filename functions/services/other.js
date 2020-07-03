//? Email Checker -> Must have @ and .com
function validateEmail(email){
    var emailValidator = /\S+@\S+\.\S+/;
    return emailValidator.test(email);
}

//! Export
module.exports = {
    validateEmail
}