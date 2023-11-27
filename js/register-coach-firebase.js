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

function firebaseCreateCoach(registerData) {
  console.log(registerData.userEmail);
  console.log(registerData.userPass);
  return new Promise(function (resolve, reject) {
    createUserWithEmailAndPassword(
      auth,
      registerData.userEmail,
      registerData.userPass
    )
      .then((userCredential) => {
        // Update relevant data
        updateProfile(auth.currentUser, {
          displayName: `Coach ${registerData.userName}`,
        }).then(() => {
          // Get user Id
          const user = userCredential.user.uid;
          // Send Email Verification
          sendEmailVerification(auth.currentUser).then(() => {
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
export { firebaseCreateCoach };

// FIRESTORE DATABASE
// --------------------------------------------------------------- USER DATA SAVE

// uploadArticle toma un array de artículo y lo publica en firebase
var firebaseSaveCoachData = (registerData) => {
  return new Promise(function (resolve, reject) {
    try {
      const docRef = addDoc(collection(db, "coachesData"), {
        userName: registerData.userName,
        userSurame: registerData.userSurame,
        userRecommendation: registerData.userRecommendation,
        userBirthday: registerData.userBirthday,
        userGender: registerData.userGender,
        userNationality: registerData.userNationality,
        userOtherNationality: registerData.userOtherNationality,
        userResidence: registerData.userResidence,
        userLanguages: registerData.userLanguages,
        userSports: registerData.userSports,
        userExperience: registerData.userExperience,
        userClubExp: registerData.userClubExp,
        userOtherCoachExp: registerData.userOtherCoachExp,
        userToursJuzge: registerData.userToursJuzge,
        userToursOrganized: registerData.userToursOrganized,
        userProfessionalExp: registerData.userProfessionalExp,
        userCompetingNow: registerData.userCompetingNow,
        userInternationalExp: registerData.userInternationalExp,
        userWeeklyHours: registerData.userWeeklyHours,
        userPreferredLevel: registerData.userPreferredLevel,
        userAvailability: registerData.userAvailability,
        userMobilityContinents: registerData.userMobilityContinents,
        userOportunityType: registerData.userOportunityType,
        userExpectedSalary: registerData.userExpectedSalary,
        userPhoneNumber: registerData.userPhoneNumber,
        userLinkedin: registerData.userLinkedin,
        userInsta: registerData.userInsta,
        coachId: registerData.coachId,
        registerDate: registerData.registerDate,
      });
      // Aquí faltaría redirigir a la página de artículo
      resolve();
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  });
};

export { firebaseSaveCoachData };
