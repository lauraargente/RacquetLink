import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-analytics.js";

import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signOut, signInWithEmailAndPassword, sendEmailVerification, updateProfile, sendPasswordResetEmail} from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js'

// var headerRegister = document.querySelector('#register-button')
var headerLogin = document.querySelector('#login-button')
var headerLogged = document.querySelector('#logged-user')
var headerLoggedName = document.querySelector('#logged-user-text')


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

checkIfStoredUserCookie();

onAuthStateChanged(auth, (user) => {
  if (user) {
    setCookie('loggedUser', user.displayName, 30);
    setCookie('loggedUserId', user.uid, 30);
    checkIfStoredUserCookie();
  } else {
    // User is signed out
    // ...
    headerLogged.style.display = 'none'
    // headerRegister.style.display = 'flex'
    headerLogin.style.display = 'flex'
  }
});

function setCookie(nombre, valor, diasExpiracion) {
  const fecha = new Date();
  fecha.setTime(fecha.getTime() + (diasExpiracion * 24 * 60 * 60 * 1000));
  const expiracion = "expires=" + fecha.toUTCString();
  document.cookie = nombre + "=" + valor + ";" + expiracion + ";path=/";
}

function deleteCookie(nombre) {
  document.cookie = nombre + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

function checkIfStoredUserCookie() {
  const nombreCookie = "loggedUser";
  const nombreCookieId = "loggedUserId";
  const valorCookie = getCookie(nombreCookie); // Suponiendo que ya tienes una función getCookie definida
  const valorCookieId = getCookie(nombreCookieId); // Suponiendo que ya tienes una función getCookie definida

  if ((valorCookie !== null) && (valorCookieId !== null)) {
    setUserNameOnHeader(valorCookie, valorCookieId)
    // checkIfCookieIdMatchesURL(valorCookieId)
  }
  }

function getCookie(nombre) {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(nombre + '=')) {
      return cookie.substring(nombre.length + 1);
    }
  }
  return null;
}

function setUserNameOnHeader(displayName, displayNameId) {

  var typeOfUser = displayName.trim().split(' ')[0]
  typeOfUser === 'Coach' ? headerLogged.href = `/profilecoach.html?id=${displayNameId}` : headerLogged.href = `/profileclub.html?id=${displayNameId}`
  headerLogged.style.display = 'flex'
  headerLoggedName.innerHTML = displayName
  headerLoggedName.innerHTML = displayName.replace(/^\w+\s*/, '')

  // headerRegister.style.display = 'none'
  headerLogin.style.display = 'none'
}

export {setUserNameOnHeader}

var firebaseLogout = () => {
  window.location.href = '/';
  setCookie('loggedUser');
  setCookie('loggedUserId');
  return new Promise(function (resolve, reject) {
    try {
      auth.signOut().then( () => {
        resolve();
      })
    } catch (e) {
      console.error("Error logging out: ", e);
      reject(e)
    }
  });
}

export {firebaseLogout}