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
            username: userName,
            password: userPassword,
            email: userEmail
        });

        //* Add User Success -> Registration Complete
        return res.status(201)
            .json({
                status: 201,
                data: "User Registration Successful"
            });
    }
}

//? User Login
async function userLogin(req, res) {
    //~ Input data
    let userName = req.body.username;
    let userPassword = req.body.password;

    //# Generate DateTime
    let dateGenerate = new Date(Date.now());
    let userDate = dateGenerate.toLocaleDateString();
    let userTime = dateGenerate.toLocaleTimeString();
    let userLastLogin = userDate + "?" + userTime;


    //~ Function Using
    findUsername()


    //# Find username
    async function getUserId() {
        var usernameAllData = []

        var usernameSnapshot = db.collection('Users').get()
        for (const userDoc of (await usernameSnapshot).docs) {
            usernameAllData.push(userDoc.data().id)
        }
        return usernameAllData
    }

    async function findUsername() {
        let thisUsername;
        let userSnapshot = await getUserId();
        for (var index = 0; index < userSnapshot.length; index++) {
            //~ Get username from userId
            thisUsername = feature.getUsernameFromId(userSnapshot[index])

            //* Check username if Found -> Get password from db
            if (userName === thisUsername) {
                loginProcess(userSnapshot[index]);
                break;
            } else {
                //! User not Found -> Error
                return res.status(404).json({
                    status: 404,
                    data: "Error, Account not found"
                })
            }
        }
    }

    //* Begin Login Process
    function loginProcess(userId) {
        let userRef = db.collection('Users').doc(userId);
        let getOnce = userRef.get()
            .then(doc => {
                if (!doc.exists) {
                    //! Account not Found -> Error
                    return res.status(404).json({
                        status: 404,
                        data: "Error, Your password or username is incorrect"
                    })
                } else {
                    //~ User Found : Check password                       
                    if (userPassword === doc.data().password) {
                        //# Update Login Date                        
                        let loginSet = userRef.update({
                            last_login_at: userLastLogin
                        });

                        //* Login Complete                        
                        return res.status(200)
                            .json({
                                status: 200,
                                id: doc.data().id,
                                data: "Login Successful"
                            });
                    }
                }
            })
            .catch(error => {
                return res.status(404).json({
                    status: 404,
                    data: "Error," + error
                })
            });
    }
}

function getUserProfile(req, res) {
    //~ Input Data
    let userId = req.params.id;

    //~ Using Function
    getProfile();

    //# Get Profile Data Process
    function getProfile() {
        let userRef = db.collection("Users").doc(userId);
        let userOnce = userRef.get()
            .then(doc => {
                if (doc.exists) {
                    //# Get Date Time
                    if (typeof (doc.data().last_login_at) === String) {                        
                        let userLastLogin = feature.getDateTime(doc.data().last_login_at);

                        //* Restrict data viewing                                          
                        return res.status(200).json({
                            status: 200,
                            username: doc.data().username,
                            password: doc.data().password,
                            email: doc.data().email,
                            loginDate: userLastLogin[0],
                            loginTime: userLastLogin[1]
                        })
                    } else {
                        //! For this section it hard to conflict -> After login will get userId & last_login_at
                        //* Not Found last_login_at
                        return res.status(200).json({
                            status: 200,
                            username: doc.data().username,
                            password: doc.data().password,
                            email: doc.data().email
                        })
                    }


                } else {
                    return res.status(404).json({
                        status: 404,
                        data: "Error, Account not found"
                    })
                }
            })
    }
}

//! Export 
module.exports = {
    addOnceUser,
    userLogin,
    getUserProfile
}