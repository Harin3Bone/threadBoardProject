//~ Initialize Cloud Firestore
const admin = require('firebase-admin');

let db = admin.firestore();

//~ Import uuidV4
const uuid = require('uuid/v4');

//~ Another Function
const feature = require('./other');

//~ Function Declaration
//? Add once user
function addOnceUser(req, res) {
    //~ Input data
    let userName = req.body.username;
    let userId = uuid() + "|" + userName;
    let userPassword = req.body.password;
    let userEmail = req.body.email;

    //~ Function Using
    emailValidate();
    passwordValidate();
    usernameValidate();

    //# Check Email -> Must have @ and .com
    function emailValidate() {
        let emailChk = feature.validateEmail(userEmail);

        //! If is not Email -> Error
        if (!emailChk) {
            return res.status(404)
                .json({
                    status: 404,
                    data: "Error, Invalid email address"
                });
        }
    }

    function passwordValidate() {
        //# Check Password -> At least 1 Uppercase , 1 Lowercase , 1 Number And length in range 10-20 character only
        let passwordChk = feature.validatePassword(userPassword);

        //! If Password in not in format
        if (!passwordChk) {
            return res.status(404)
                .json({
                    status: 404,
                    data: "Error, Password not in format"
                });
        }
    }

    //# Check Username -> Must not same as another account
    async function getUsernameSnapshot() {
        var usernameAllData = []
        var usernameSnapshot = db.collection('Users').get()
        for (const userDoc of (await usernameSnapshot).docs) {
            usernameAllData.push(userDoc.data().username)
        }
        return usernameAllData
    }

    async function usernameValidate() {
        let userSnapshot = await getUsernameSnapshot();
        for (var index = 0; index < userSnapshot.length; index++) {
            //! Found Same username
            if (userName === userSnapshot[index]) {
                return res.status(404).json({
                    status: 404,
                    data: "Error, This username already existed"
                })
            }
        }

        //* Add User after validate username , password , email success
        addUser();
    }

    async function addUser() {
        let userRef = db.collection('Users').doc(userId);

        //* Add User to Cloud Firestore
        let setUser = userRef.set({
            id: userId,
            name: userName,
            password: userPassword,
            email: userEmail
        });

        //* Add User Success -> Registration Complete
        return res.status(201)
            .json({
                id: userId,
                name: userName,
                password: userPassword,
                email: userEmail
            });
    }
}

//! Export 
module.exports = {
    addOnceUser
}