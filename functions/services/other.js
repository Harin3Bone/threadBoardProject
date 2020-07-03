//? Email Checker -> Must have @ and .com
function validateEmail(email){
    var emailValidator = /\S+@\S+\.\S+/;
    return emailValidator.test(email);
}

//? Password Checker -> At least 1 Uppercase , 1 Lowercase , 1 Number And 10-20 character only
function validatePassword(password){
    var passwordValidator = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{10,20})");
    return passwordValidator.test(password);
}

//! Export
module.exports = {
    validateEmail,
    validatePassword
}