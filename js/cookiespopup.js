document.addEventListener("DOMContentLoaded", function () {
  // Check if the cookie already exists
  if (!getCookie("cookieConsent")) {
    createConsentPopup();
  }
});

function createConsentPopup() {
    var consentPopup = document.createElement("div");
    consentPopup.setAttribute("id", "cookieConsentPopup");
    consentPopup.innerHTML = `
          <style>
              #cookieConsentPopup {
                  display: flex; 
                  flex-direction: column; 
                  justify-content: center; 
                  align-items: center; 
                  position: fixed; 
                  bottom: 0; 
                  left: 50%; 
                  transform: translateX(-50%) translateY(-1rem); 
                  z-index: 1000; 
                  background: rgba(0,0,0, 0.5); 
                  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1); 
                  backdrop-filter: blur(25px); 
                  border-radius: 1rem; 
                  color: #DDD; 
                  padding: 2rem; 
                  max-width: 40rem; 
                  width: auto; 
                  text-align: center;
              }
  
              @media (max-width: 600px) {
                  #cookieConsentPopup {
                      width: 100%;
                      max-width: none;
                      padding: 1rem;
                      border-radius: 1rem 1rem 0 0;
                      background-color: rgba(0,0,0,0.5);
                    transform: translateX(-50%) translateY(0); 
                  }
  
                  #cookieConsentPopup button {
                      padding: 1rem;
                      font-size: 1rem;
                  }
              }

              #acceptCookie:hover {
                opacity: 0.8;
            }

            /* Estilo hover para el botón 'Accept only essential ones' */
            #declineCookie:hover {
                opacity: 0.8;
            }
          </style>
          <div>
              Esta web utiliza cookies de RacquetLink y terceros para registros y estadísticas. Puedes aceptar todas o rechazar aquellas no esenciales.
              <a href="../cookiespolicy" style="text-decoration: underline;">Lee nuestra política de cookies</a>
              <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; margin-top: 1rem;">
                  <button id="acceptCookie" style="padding: 10px 20px; background-color: #025B7B; color: white; border: none; border-radius: 1rem; font-size: 1rem; width: max-content; font-weight: 500; cursor: pointer;">Aceptar todas</button>
<<<<<<< HEAD
                  <button id="declineCookie" style="padding: 10px 20px; background-color: #DDD; color: #025B7B; border: none; border-radius: 1rem; font-size: 1rem; width: max-content; font-weight: 500; cursor: pointer;">Rechazar no esenciales</button>
=======
                  <button id="declineCookie" style="padding: 10px 20px; background-color: #DDD; color: #025B7B; border: none; border-radius: 1rem; font-size: 1rem; width: max-content; font-weight: 500; cursor: pointer;">Aceptar solo las esenciales</button>
>>>>>>> d218bf3089c166ddc5f433cb63b80fcdad558b35
              </div>
          </div>`;

  document.body.appendChild(consentPopup);

  document
    .getElementById("acceptCookie")
    .addEventListener("click", function () {
      setCookie("cookieConsent", "true", 365);
      document.body.removeChild(consentPopup);
    });

  document
    .getElementById("declineCookie")
    .addEventListener("click", function () {
      setCookie("cookieConsent", "true", 365);
      document.body.removeChild(consentPopup);
    });
}

function setCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}
