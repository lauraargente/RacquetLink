import { firebaseLogIn } from "../../js/login-firebase.js";
import { firebaseResetPassword } from "../../js/login-firebase.js";

// Variables
const headerBurguer =document.querySelector('.Header-burguer')
const headerNav = document.querySelector('.Header-nav')


var loginButton = document.querySelector("#next-conditional-pass");

var loginEmail = document.querySelector("#email-container > input");
var loginPass = document.querySelector("#pass-container > input");

var loginLoadingIcon = document.querySelector("#login-loading-icon");
var loginOkIcon = document.querySelector("#login-ok-icon");

var allTextInputs = document.querySelectorAll(".textinput-text");

var resetPasswordLink = document.querySelector("#reset-password");
var resetPasswordMessage = document.querySelector("#reset-password-message");

//Cuando hago CLICK en headerBurguer hace una FUNCTION
// a headerNav le TOGGLE la clase isActive

headerBurguer.addEventListener(`click`, ()=>{
  headerNav.classList.toggle('isActive')
})

//#region textInputs coloring

allTextInputs.forEach((textinput) => {
  textinput.addEventListener("blur", () => {
    if (!(textinput.value === "")) {
      textinput.style.backgroundColor = "#f3f5f9";
      textinput.style.borderRadius = "0 0.75em 0.75em 0";
      textinput.style.color = "#025b7b";
    } else {
      textinput.style.backgroundColor = "rgba(0,0,0,0)";
      textinput.style.borderRadius = "0";
      textinput.style.color = "black";
    }
  });
});

//#endregion

//#region loginLogic

var tryLoginLogic = () => {
  console.log(loginEmail.value);
  console.log(loginPass.value);

  loginLoadingIcon.style.visibility = "visible";
  loginOkIcon.style.visibility = "hidden";

  // Time to give time to animation
  setTimeout(function () {
    firebaseLogIn(loginEmail.value, loginPass.value)
      .then((userData) => {
        console.log(userData)
        console.log(userData.userName)
        if (userData.userName.split(' ')[0] === 'Coach') {
          window.location.href = `profilecoach?id=${userData.userId}`;
        } else {
          window.location.href = `profileclub?id=${userData.userId}`;
        }
        loginLoadingIcon.style.visibility = "hidden";
        loginOkIcon.style.visibility = "visible";
      })
      .catch((error) => {
        loginLoadingIcon.style.visibility = "hidden";
        loginOkIcon.style.visibility = "visible";
        resetPasswordMessage.classList.add("displayed");
        resetPasswordMessage.innerHTML =
          "Invalid email or password";
      });
  }, 1000);
}

loginButton.addEventListener("click", () => {
  tryLoginLogic()
});

document.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    tryLoginLogic()
  }
});

//#endregion

//#region resetPassword

resetPasswordLink.addEventListener("click", () => {
  resetPasswordLink.style.pointerEvents = 'none'
  resetPasswordLink.style.color = '#CCC'
  firebaseResetPassword(loginEmail.value)
    .then(() => {
      resetPasswordMessage.classList.remove("displayed");
      setTimeout(() => {
        resetPasswordMessage.classList.add("displayed");
        resetPasswordMessage.innerHTML = `We have sent a password reset email to <br> ${loginEmail.value}`;
      }, 10);
    })
    .catch(() => {
      resetPasswordMessage.classList.remove("displayed");
      setTimeout(() => {
        resetPasswordMessage.classList.add("displayed");
        resetPasswordMessage.innerHTML =
          "Escribe una dirección de email válida";
      }, 10);
    });
});

loginEmail.addEventListener('click', () => {
  resetPasswordMessage.innerHTML = '';
  resetPasswordMessage.classList.remove("displayed");

  resetPasswordLink.style.pointerEvents = 'auto'
  resetPasswordLink.style.color = '#025B7B'
})

loginEmail.addEventListener('change', () => {
  resetPasswordMessage.innerHTML = '';
  resetPasswordMessage.classList.remove("displayed");

  resetPasswordLink.style.pointerEvents = 'auto'
  resetPasswordLink.style.color = '#025B7B'
})

//#endregion

function isEmailValid(email) {
  // Expresión regular para validar el formato del email
  const regex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

  // Verificar si el email coincide con la expresión regular
  return regex.test(email);
}

//Store variable to navigate to FAQS
const faqsLink = document.querySelector('.Faqs-link')
faqsLink.addEventListener('click', ()=>{
    localStorage.setItem('seeFaqs', 'yes');
})
