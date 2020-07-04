//! Import Crypto
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

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
function getOnlyDate(dateTime) {
    let threadIndex = dateTime.indexOf("?");
    let threadDate = dateTime.substring(0, threadIndex);

    return threadDate;
}

function getOnlyTime(dateTime) {
    let threadIndex = dateTime.indexOf("?");
    let threadTime = dateTime.substring(threadIndex + 1);

    return threadTime;
}

//# Encryption & Decryption for Security
//* Encryption
function encrypt(text) {
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return {
        iv: iv.toString('hex'),
        encryptedData: encrypted.toString('hex')
    };
}

//* Decryption
function decrypt(text) {
    let iv = Buffer.from(text.iv, 'hex');
    let encryptedText = Buffer.from(text.encryptedData, 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

//! Export
module.exports = {
    validateEmail,
    validatePassword,
    getUsernameFromId,
    getDateTime,
    getOnlyDate,
    getOnlyTime,
    encrypt,
    decrypt
}