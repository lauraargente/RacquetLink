import { firebaseFetchUserDataById } from "./profile-club-firebase.js";
import { firebaseUpdateProfilePicture } from "./profile-club-firebase.js";
import { firebaseGetProfilePicture } from "./profile-club-firebase.js";
import { firebaseGetJobOffer } from "./profile-club-firebase.js";
import { firebaseUploadDocument } from "./profile-club-firebase.js";
import { firebaseUpdateUserData } from "./profile-club-firebase.js";
import { firebaseRemoveJobOffer } from "./profile-club-firebase.js";

const dataElement = document.querySelectorAll('.profile-data')
const dataElementExp = document.querySelectorAll('.profile-exp')

const nombreCookie = "loggedUser";
const nombreCookieId = "loggedUserId";
const valorCookie = getCookie(nombreCookie);
const valorCookieId = getCookie(nombreCookieId);

const pageLoader = document.querySelector("#page-loader");
const body = document.querySelector("body");

var newEditedData

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

//#region newregion 


//#endregion

//#region (f) makeChanges 

var loadingState = document.querySelector('#state-disclaimer-loading')
var loadedState = document.querySelector('#state-disclaimer-loaded')

var updateChanges = () => {
  loadedState.style.display = 'none'
  loadingState.style.display = 'flex'
  console.log(newEditedData)
  firebaseUpdateUserData(valorCookieId, newEditedData).then( () => {
    console.log('Documento actualizado correctamente')
    setTimeout(() => {
    loadingState.style.display = 'none'
    loadedState.style.display = 'flex'
    }, 400);
  }).catch( () => {
    alert('Ha ocurrido un error')
    loadingState.style.display = 'none'
  })
}

//#endregion

//#region (l) writeData 

var fillDataInDocument = (data) => {

  newEditedData = data;

  var dataEmail = document.querySelector("#data-email");
  var dataNumber = document.querySelector("#data-number");
  var dataName = document.querySelector("#profile-element-container-name");
  var dataResidence = document.querySelector("#data-residence");
  var dataWeb = document.querySelector("#data-web");
  var dataAdditionalInfo = document.querySelector("#multilineInput");

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
    console.log('asjdoasd')
    newEditedData.clubSports.forEach(dataSport => {
      if (element.getAttribute('data-sport') === dataSport) {
        element.classList.add('selected')
      }
    })

    element.addEventListener('click', () => {
      newEditedData.clubSports.length = 0
      element.classList.toggle('selected')

      dataSports.forEach(element => {
        if (element.classList.contains('selected')) {
          newEditedData.clubSports.push(element.getAttribute('data-sport')) 
          
        }
      })
      newEditedData.clubSports.push('')
      newEditedData.clubSports[newEditedData.clubSports.length-1] = dataOtherSport.value

      console.log(newEditedData.clubSports)

      updateChanges()
    })
  })
  
let additionalSport = newEditedData.clubSports[newEditedData.clubSports.length-1]
console.log(additionalSport)
if (additionalSport && (!(additionalSport === ''))) {
  dataOtherSport.value = additionalSport;
  dataOtherSport.classList.add('selected')
}

dataOtherSport.addEventListener('input', () => {
  if (!(dataOtherSport.value === '')) {
    dataOtherSport.classList.add('selected')
    newEditedData.clubSports[newEditedData.clubSports.length-1] = dataOtherSport.value
  } else {
    dataOtherSport.classList.remove('selected')
    newEditedData.clubSports[newEditedData.clubSports.length-1] = dataOtherSport.value
  }
})

dataOtherSport.addEventListener('blur', () => {
  updateChanges()
})


// ---------------------------------------------------------------------------- Fields
var dataFields = document.querySelectorAll('[data-fields]');
dataFields.forEach(element => {
  if (element.getAttribute('data-fields') === newEditedData.clubField) {
    element.classList.add('selected')
  }
  element.addEventListener('click', () => {
    dataFields.forEach(element => {
      element.classList.remove('selected')
    })
    element.classList.add('selected')
    newEditedData.clubField = element.getAttribute('data-fields')

    updateChanges()
  })
})

// ---------------------------------------------------------------------------- Coaches Search
var dataCoaches = document.querySelectorAll('[data-state]');
dataCoaches.forEach(element => {
  if (element.getAttribute('data-state') === newEditedData.clubState) {
    element.classList.add('selected')
  }
  element.addEventListener('click', () => {
    dataCoaches.forEach(element => {
      element.classList.remove('selected')
    })
    element.classList.add('selected')
    newEditedData.clubState = element.getAttribute('data-state')
    updateChanges()
  })
})

// ---------------------------------------------------------------------------- Consulting
var dataConsulting = document.querySelectorAll('[data-consulting]');
dataConsulting.forEach(element => {
  if (element.getAttribute('data-consulting') === newEditedData.clubConsulting) {
    element.classList.add('selected')
  }
  element.addEventListener('click', () => {
    dataConsulting.forEach(element => {
      element.classList.remove('selected')
    })
    element.classList.add('selected')
    newEditedData.clubConsulting = element.getAttribute('data-consulting')
    updateChanges()
  })
})

// ---------------------------------------------------------------------------- Additional Info

var textArea = document.getElementById('multilineInput');

textArea.value = newEditedData.clubAdditionalInfo;


textArea.addEventListener('input', autoResize, false);

function autoResize() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
}

textArea.addEventListener('blur', () => {
  newEditedData.clubAdditionalInfo = textArea.value
  updateChanges()
})

};

//#endregion

//#region (l) manage file uploading and downloading

const eraseDocument = document.querySelector('.erase-offer')

eraseDocument.addEventListener('click', () => {
  firebaseRemoveJobOffer(valorCookieId).then( () => {
    console.log('asjdoasjdos')
    downloadLinksLabel.classList.remove('download-available')
    eraseDocument.classList.remove('download-available')
    tellUsMoreContainer.classList.remove('download-available')
  })
})

const downloadLink = document.querySelector('#downloadLink');
const downloadLinksLabel = document.querySelector('.downloadLink-wording');
const jobOfferButton = document.querySelector('#job-offer');
const jobOfferButtonLabel = document.querySelector('#job-offer-label');
const tellUsMoreContainer = document.querySelector('#tellusmore-container')

function extraerNombreArchivo(url) {
  const regex = /o\/(.*?)\?/; // Captura todo entre 'o/' y el siguiente '?'
  // const regex = %2..*%2F(.*?)\?alt;
  const match = url.match(regex);
  return match ? match[1] : null; // Devuelve el grupo capturado si existe, de lo contrario null
}

  firebaseGetJobOffer(valorCookieId).then( (url) => {
    downloadLinksLabel.href = url;
    downloadLinksLabel.download = extraerNombreArchivo(url)
    downloadLinksLabel.innerHTML = 'Descargar oferta/s actual/es'
    downloadLinksLabel.classList.add('download-available')
    eraseDocument.classList.add('download-available')
    tellUsMoreContainer.classList.add('download-available')
  })

firebaseGetProfilePicture(valorCookieId).then( (url) => {
  image.src = url;
  setSettedImageStyling()
}).catch( (e) => {
  console.log(e)
})

jobOfferButtonLabel.addEventListener('click', function() {
  document.getElementById('job-offer').click();
});

jobOfferButton.addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (!file) {
      return;
  }

  const fileUrl = URL.createObjectURL(file);

  downloadLinksLabel.href = fileUrl;
  downloadLinksLabel.download = file.name;
  downloadLinksLabel.innerHTML = 'Descargar oferta/s actual/es'
  downloadLinksLabel.classList.add('download-available')
  eraseDocument.classList.add('download-available')
  tellUsMoreContainer.classList.add('download-available')

  firebaseUploadDocument(file, `profileDocument=${valorCookieId}.pdf`)
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
    firebaseUpdateProfilePicture(result, `profilePicUserId=${valorCookieId}.png`).then( () => {
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