import { firebaseLogIn } from "./login-firebase.js";

var loginButton = document.querySelector("#next-conditional-pass");

var loginEmail = document.querySelector("#email-container > input");
var loginPass = document.querySelector("#pass-container > input");

var loginLoadingIcon = document.querySelector("#login-loading-icon");
var loginOkIcon = document.querySelector("#login-ok-icon");

loginButton.addEventListener("click", () => {
  console.log(loginEmail.value);
  console.log(loginPass.value);

  loginLoadingIcon.style.visibility = "visible";
  loginOkIcon.style.visibility = "hidden";

  // Time to give time to animation
  setTimeout(function () {
    firebaseLogIn(loginEmail.value, loginPass.value)
    .then((user) => {
      console.log(user)
      loginLoadingIcon.style.visibility = "hidden";
      loginOkIcon.style.visibility = "visible";
    })
    .catch((error) => {
      loginLoadingIcon.style.visibility = "hidden";
      loginOkIcon.style.visibility = "visible";
    })
  }, 1000);
});
