// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import {
  getFirestore,
  collection,
  addDoc,
  getDoc,
  getDocs,
  where,
  orderBy,
  query,
  limit,
  doc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  sendPasswordResetEmail,
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAqel3JAhMxL5l426roQxk-qayASU6uYbY",
  authDomain: "racquetlink.firebaseapp.com",
  projectId: "racquetlink",
  storageBucket: "racquetlink.appspot.com",
  messagingSenderId: "122086812417",
  appId: "1:122086812417:web:7f5d796fa3bef8df35c900",
  measurementId: "G-RXX34BJDJ5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firestore
const db = getFirestore(app);
// Initialize Authenticator
const auth = getAuth();

// FIREBASE AUTHENTICATION
// --------------------------------------------------------------- USER REGISTER

function firebaseCreateClub(registerData) {
  console.log(registerData);
  console.log(registerData.clubEmail);
  console.log(registerData.clubPassword);
  console.log(registerData.clubNumber);
  return new Promise(function (resolve, reject) {
    createUserWithEmailAndPassword(
      auth,
      registerData.clubEmail,
      registerData.clubPassword
    )
      .then((userCredential) => {
        // Update relevant data
        updateProfile(userCredential.user, {
          displayName: `Club ${registerData.clubName}`,
        }).then(() => {
          // Get user Id
          const user = userCredential.user.uid;
          // Send Email Verification
          sendEmailVerification(auth.currentUser).then(() => {
            // The new custom claims will propagate to the user's ID token the
            // next time a new one is issued.
            // Signed in
            resolve(user);
          });
        });
      })
      .catch((error) => {
        // console.log(error.code)
        reject(error.message);
        // ..
      });
  });
}

// Making fuction global
export { firebaseCreateClub };

// FIRESTORE DATABASE
// --------------------------------------------------------------- USER DATA SAVE

// uploadArticle toma un array de artículo y lo publica en firebase
var firebaseSaveClubData = (registerData) => {
  return new Promise(function (resolve, reject) {
    try {
      const docRef = addDoc(collection(db, "clubsData"), {
        clubName: registerData.clubName,
        clubRecommendation: registerData.clubRecommendation,
        clubWebPage: registerData.clubWebPage,
        clubCountry: registerData.clubCountry,
        clubCity: registerData.clubCity,
        clubSports: registerData.clubSports,
        clubAdditionalSport: registerData.clubAdditionalSport,
        clubField: registerData.clubField,
        clubState: registerData.clubState,
        clubConsulting: registerData.clubConsulting,
        clubEmail: registerData.clubEmail,
        clubNumber: registerData.clubNumber,
        clubId: registerData.clubId,
        clubRegisterDate: Date(),
      });
      // Aquí faltaría redirigir a la página de artículo
      resolve();
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  });
};

export { firebaseSaveClubData };
