//# USER
//? Email Checker -> Must have @ and .com
function validateEmail(email) {
    var emailValidator = /\S+@\S+\.\S+/;
    return emailValidator.test(email);
}

//? Password Checker -> At least 1 Uppercase , 1 Lowercase , 1 Number And 10-20 character only
function validatePassword(password) {
    var passwordValidator = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{10,20})");
    return passwordValidator.test(password);
}

//? Get username from userId
function getUsernameFromId(userId) {
    var findUsername = userId.indexOf("|");
    var getUsername = userId.substring(findUsername + 1);
    return getUsername;
}

//? Get Date and Time
function getDateTime(dateTime) {
    let userLoginIndex = dateTime.indexOf("?");
    let userLoginDate = dateTime.substring(0, userLoginIndex);
    let userLoginTime = dateTime.substring(userLoginIndex + 1);
    let userLastLogin = [userLoginDate, userLoginTime];

    return userLastLogin;
}

//# THREAD

//! Export
module.exports = {
    validateEmail,
    validatePassword,
    getUsernameFromId,
    getDateTime
}