import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-analytics.js";

import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signOut, signInWithEmailAndPassword, sendEmailVerification, updateProfile, sendPasswordResetEmail} from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js'

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyAqel3JAhMxL5l426roQxk-qayASU6uYbY",
    authDomain: "racquetlink.firebaseapp.com",
    projectId: "racquetlink",
    storageBucket: "racquetlink.appspot.com",
    messagingSenderId: "122086812417",
    appId: "1:122086812417:web:7f5d796fa3bef8df35c900",
    measurementId: "G-RXX34BJDJ5"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Authenticator
const auth = getAuth()


// --------------------------------------------------------------- LOG IN
function firebaseLogIn(email, password) {
    return new Promise(function (resolve, reject) {
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Aquí obtienes el usuario
            const user = userCredential.user;
            // Aquí obtienes el userId
            const userId = user.uid;
            const userName = user.displayName;
            console.log(userName)
            // Resuelves la promesa con el userId
            resolve({ userId, userName });
        })
        .catch((error) => {
            // Manejas errores aquí
            reject(error);
        });
    })
}


// Making fuction global
export { firebaseLogIn }


// --------------------------------------------------------------- PASSWORD RESET
function firebaseResetPassword(email) {
	return new Promise(function (resolve, reject) {
        sendPasswordResetEmail(auth, email)
        .then(() => {
            resolve()
        })
        .catch((error) => {
            reject(error)
        });
    })
}

// Get user data
export { firebaseResetPassword }