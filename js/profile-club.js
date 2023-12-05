import { firebaseFetchUserDataById } from "./profile-club-firebase.js";
import { firebaseUpdateProfilePicture } from "./profile-club-firebase.js";
import { firebaseGetProfilePicture } from "./profile-club-firebase.js";
import { firebaseUpdateUserData } from "./profile-club-firebase.js";

const dataElement = document.querySelectorAll('.profile-data')
const dataElementExp = document.querySelectorAll('.profile-exp')

const nombreCookie = "loggedUser";
const nombreCookieId = "loggedUserId";
const valorCookie = getCookie(nombreCookie);
const valorCookieId = getCookie(nombreCookieId);

const pageLoader = document.querySelector("#page-loader");
const body = document.querySelector("body");

//#region (v) edit section

const actionsWrapper = document.querySelector("#actions-wrapper");
const disclaimerContent = document.querySelector("#disclaimer-content");
const editButton = document.querySelector("#edit-button");
const saveButton = document.querySelector("#save-button");
const editStyledElements = document.querySelectorAll(".edit-mode-style");

//#endregion

//#region (v) editVariables 

var profilePicture = document.querySelector('#profile-picture')
var imageContainer = document.querySelector('#image-container')
var profileLabel = document.getElementById("profile-image-label");

//#endregion

//#region autoresizing textarea 

  var textArea = document.getElementById('multilineInput');
  textArea.addEventListener('input', autoResize, false);

  function autoResize() {
      this.style.height = 'auto';
      this.style.height = (this.scrollHeight) + 'px';
  }
//#endregion

//#region (l) writeData 

// var newEditedData

var newEditedData

var fillDataInDocument = (data) => {

  newEditedData = data;

  var dataEmail = document.querySelector("#data-email");
  var dataNumber = document.querySelector("#data-number");
  var dataName = document.querySelector("#profile-element-container-name");
  var dataResidence = document.querySelector("#data-residence");
  var dataWeb = document.querySelector("#data-web");

  function formatearURL(url) {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        if (url.startsWith('www.')) {
            url = 'http://' + url;
        } else {
            url = 'http://' + url;
        }
    }
    return url;
  }

// ---------------------------------------------------------------------------- Name
  dataName.innerHTML = newEditedData.clubName;

// ---------------------------------------------------------------------------- Web
  if (newEditedData.clubWebPage === '') {
    dataWeb.parentNode.style.display = 'none'
  } else if (newEditedData.clubWebPage.length <= 30) {
    dataWeb.innerHTML = newEditedData.clubWebPage
    dataWeb.parentNode.href = formatearURL(newEditedData.clubWebPage);
  } else {
    dataWeb.innerHTML = `${newEditedData.clubWebPage.substring(0, 30)}...`;
    dataWeb.parentNode.href = formatearURL(newEditedData.clubWebPage);
  }
// ---------------------------------------------------------------------------- Email
  dataEmail.innerHTML = newEditedData.clubEmail;

// ---------------------------------------------------------------------------- Number
  dataNumber.innerHTML = newEditedData.clubNumber;
  function mapCountry(code) {
    const countryCodes = {
      'at': 'Austria',
      'be': 'Bélgica',
      'bg': 'Bulgaria',
      'hr': 'Croacia',
      'cy': 'Chipre',
      'cz': 'República Checa',
      'dk': 'Dinamarca',
      'ee': 'Estonia',
      'fi': 'Finlandia',
      'fr': 'Francia',
      'de': 'Alemania',
      'gr': 'Grecia',
      'hu': 'Hungría',
      'is': 'Islandia',
      'ie': 'República de Irlanda',
      'it': 'Italia',
      'lv': 'Letonia',
      'li': 'Liechtenstein',
      'lt': 'Lituania',
      'lu': 'Luxemburgo',
      'mt': 'Malta',
      'nl': 'Países Bajos',
      'no': 'Noruega',
      'pl': 'Polonia',
      'pt': 'Portugal',
      'ro': 'Rumania',
      'sk': 'Eslovaquia',
      'si': 'Eslovenia',
      'es': 'España',
      'se': 'Suecia'
    };
    
    // Verificar si el código de país existe en el mapa
    if (countryCodes.hasOwnProperty(code)) {
        return countryCodes[code]; // Devuelve el nombre del país correspondiente
    } else {
        return 'País no especificado'; // O un mensaje predeterminado para códigos no encontrados
    }
  }
  var country = mapCountry(newEditedData.clubCountry)
  dataResidence.innerHTML = `${newEditedData.clubCity}, ${country} `

// ---------------------------------------------------------------------------- Sports
  var dataSports = document.querySelectorAll('[data-sport]');
  var dataOtherSport = document.querySelector('[data-other-sport]');

  dataSports.forEach(element => {
    newEditedData.clubSports.forEach(dataSport => {
      if (element.getAttribute('data-sport') === dataSport) {
        element.classList.add('selected')
      }
    })
  })
let additionalSport = newEditedData.clubSports[newEditedData.clubSports.length-1]
if (!(additionalSport === '')) {
  dataOtherSport.value = additionalSport;
  dataOtherSport.classList.add('selected')
}

// ---------------------------------------------------------------------------- Fields
var dataFields = document.querySelectorAll('[data-fields]');
dataFields.forEach(element => {
  if (element.getAttribute('data-fields') === newEditedData.clubField) {
    element.classList.add('selected')
  }
})

// ---------------------------------------------------------------------------- Coaches Search
var dataFields = document.querySelectorAll('[data-state]');
dataFields.forEach(element => {
  if (element.getAttribute('data-state') === newEditedData.clubState) {
    element.classList.add('selected')
  }
})

// ---------------------------------------------------------------------------- Consulting
var dataFields = document.querySelectorAll('[data-consulting]');
dataFields.forEach(element => {
  if (element.getAttribute('data-consulting') === newEditedData.clubConsulting) {
    element.classList.add('selected')
  }
})

  // clubName: data.clubName,
  // clubWebPage: registerData.clubWebPage,
  // clubCountry: registerData.clubCountry,
  // clubCity: registerData.clubCity,
  // clubSports: registerData.clubSports,
  // clubField: registerData.clubField,
  // clubState: registerData.clubState,
  // clubConsulting: registerData.clubConsulting,
  // clubEmail: registerData.clubEmail,
  // clubNumber: registerData.clubNumber,
  // clubId: registerData.clubId,
  // clubRegisterDate: Date(),

};

//#endregion

//#region (l) manage file uploading and downloading 

document.getElementById('job-offer-label').addEventListener('click', function() {
  document.getElementById('job-offer').click();
});

document.getElementById('job-offer').addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (!file) {
      return;
  }

  // Crear un URL para el archivo
  const fileUrl = URL.createObjectURL(file);

  // Configurar el enlace de descarga y mostrarlo
  const downloadLink = document.getElementById('downloadLink');
  downloadLink.href = fileUrl;
  downloadLink.download = file.name;
  downloadLink.style.display = 'flex';
});

//#endregion

//#region (l) checkIfUserIsAllowed

var isUserAllowed = () => {
  const params = new URLSearchParams(window.location.search);

  if (params.has("id")) {
    if (params.get("id") === valorCookieId) {
      firebaseFetchUserDataById(valorCookieId).then((userData) => {
        // fillDataInPage()
        pageLoader.style.display = "none";
        body.style.overflowY = "visible";
        fillDataInDocument(userData);
      }).catch(
        console.log('test')
      );
    } else {
      setTimeout(() => {
        pageLoader.innerHTML = "No dispone de permisos para ver esta página";
      }, 1000);
    }
  } else {
    setTimeout(() => {
      pageLoader.innerHTML = "No dispone de permisos para ver esta página";
    }, 1000);
  }
};

function getCookie(nombre) {
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(nombre + "=")) {
      return cookie.substring(nombre.length + 1);
    }
  }
  return null;
}

isUserAllowed();

//#endregion

//#region (l) profilePicture 

var image = document.getElementById("output");
var imageContainer = document.getElementById("image-container");
var label = document.querySelector('#profile-image-label')
var profilePicLoading = document.querySelector('#profile-pic-loading')

imageContainer.addEventListener('click', (e) => {
  profilePicture.click()
})

profilePicture.addEventListener('change', (e) => {
  loadFile(e)
})

var setSettedImageStyling = (url) => {
  image.style.border = '4px solid white'
  imageContainer.classList.add('image-set')
  imageContainer.classList.remove('loading-state')
  label.innerHTML = 'Modifica la <br> foto de perfil'
}

var convertImageToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const base64String = reader.result.split(',')[1]; // Extraer solo la parte base64 de la URL de datos
      resolve(base64String);
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(file);
  });
}

var loadFile = (event) => {

  const reader = new FileReader();

  profilePicLoading.style.visibility = 'visible'
  imageContainer.classList.add('loading-state')

  profilePicLoading.style.visibility = 'hidden'

  image.src = URL.createObjectURL(event.target.files[0]);
  const base64String = convertImageToBase64(event.target.files[0]).then( (result) => {
    console.log(result)

    firebaseUpdateProfilePicture(result, `profilePicUserId=${valorCookieId}`).then( () => {
      setSettedImageStyling()
    })

  });

};

firebaseGetProfilePicture(valorCookieId).then( (url) => {
  image.src = url;
  setSettedImageStyling()
}).catch( (e) => {
  console.log(e)
})
//#endregion