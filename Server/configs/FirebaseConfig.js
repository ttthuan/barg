var firebaseConfig = require("firebase");
var config = {
    apiKey: "AIzaSyAARBsG4HnBEqtCGFTDpR-BL7HLmBKD7TQ",
    authDomain: "barg-firebase.firebaseapp.com",
    databaseURL: "https://barg-firebase.firebaseio.com",
    projectId: "barg-firebase",
    storageBucket: "barg-firebase.appspot.com",
    messagingSenderId: "573103357657"
};

firebaseConfig.initializeApp(config);

module.exports = firebaseConfig;