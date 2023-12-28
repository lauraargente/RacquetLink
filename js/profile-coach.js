import { firebaseFetchUserDataById } from "./profile-coach-firebase.js";
import { firebaseUpdateProfilePicture } from "./profile-coach-firebase.js";
import { firebaseGetProfilePicture } from "./profile-coach-firebase.js";
import { firebaseUpdateUserData } from "./profile-coach-firebase.js";
import { firebaseLogout } from "./firebase-auth-checker.js";
import { firebaseUploadDocument } from "./profile-coach-firebase.js";
import { firebaseRemoveJobOffer } from "./profile-coach-firebase.js";
import { firebaseGetJobOffer } from "./profile-coach-firebase.js";
import { firebaseRemoveVideo } from "./profile-coach-firebase.js";
import { firebaseGetVideo } from "./profile-coach-firebase.js";
import { checkIfUserAdmin } from "./adminlist.js"

const dataElement = document.querySelectorAll('.profile-data')
const dataElementExp = document.querySelectorAll('.profile-exp')

const nombreCookie = "loggedUser";
const nombreCookieId = "loggedUserId";
const valorCookie = getCookie(nombreCookie);
const valorCookieId = getCookie(nombreCookieId);

const pageLoader = document.querySelector("#page-loader");
const body = document.querySelector("body");

var logoutButton = document.querySelector('#logout-button')

var editableOptions = document.querySelectorAll('.editable-option')


//#region (v) edit section
const openHamburguerOptions = document.querySelector('#general-options-options')
const openHamburguer = document.querySelector('#general-options-options-clickable') 
const closeHamburguer = document.querySelector('#close-general-options') 
const actionsWrapper = document.querySelector("#actions-wrapper");
const editButton = document.querySelector("#edit-button");
const loadingEditButton = document.querySelector("#loading-edit-button");
const saveButton = document.querySelector("#save-button");
//#endregion

//#region (v) editVariables 

var profilePicture = document.querySelector('#profile-picture')
var imageContainer = document.querySelector('#image-container')
var profileLabel = document.getElementById("profile-image-label");

//#endregion

//#region (l) checkIfUserIsAllowed

var isUserAllowed = () => {
  const params = new URLSearchParams(window.location.search);

  if (params.has("id")) {
      if (params.get("id") === valorCookieId) {
          // Utiliza checkIfUserAdmin para verificar si el usuario es administrador
          if (checkIfUserAdmin()) {
              firebaseFetchUserDataById(valorCookieId).then((userData) => {
                  pageLoader.style.display = "none";
                  body.style.overflowY = "visible";
                  logoutButton.style.display = 'flex'
                  fillDataInDocument(userData);
              });
          } else {
              // Usuario no es administrador
              setTimeout(() => {
                  pageLoader.innerHTML = "No dispone de permisos para ver esta página";
              }, 1000);
          }
      } else {
          // ID de parámetros no coincide con el valor de la cookie del usuario
          setTimeout(() => {
              pageLoader.innerHTML = "No dispone de permisos para ver esta página";
          }, 1000);
      }
  } else {
      // No hay ID en los parámetros de la URL
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

//#region (l) edit logic
saveButton.style.display = 'none'
loadingEditButton.style.display = 'none'

openHamburguer.addEventListener('click', () => {
  openHamburguerOptions.style.display = 'flex'
  openHamburguer.style.display = 'none'
});

closeHamburguer.addEventListener('click', (event) => {
  openHamburguerOptions.style.display = 'none'
  openHamburguer.style.display = 'flex'
});

var setEditableStyles = () => {
  saveButton.style.display = 'flex'
  loadingEditButton.style.display = 'none'
  editButton.style.display = 'none'

  editableOptions.forEach(option => {
    option.classList.add('editable')
  })
}

var setLoading = () => {
  saveButton.style.display = 'none'
  loadingEditButton.style.display = 'flex'
  editButton.style.display = 'none'
}

var unsetEditableStyles = () => {
  saveButton.style.display = 'none'
  loadingEditButton.style.display = 'none'
  editButton.style.display = 'flex'



  editableOptions.forEach(option => {
    option.classList.remove('editable')
  })
  
  actionsWrapper.style.right = '100%'

}

editButton.addEventListener("click", () => {
  setEditableStyles()
  makeAllFieldsEditable()
});

saveButton.addEventListener("click", () => {
  setLoading()

  // disSelectAllFields()
  // Set loading state
  console.log(newEditedData)



  firebaseUpdateUserData(valorCookieId, newEditedData).then( () => {
    setTimeout(() => {
      unsetEditableStyles()
      unMakeAllFieldsEditable() 
    }, 500);
  })
});

var makeAllFieldsEditable = () => {
  dataElement.forEach(element => {
    element.classList.add('editable')
  })
  dataElementExp.forEach(element => {
    element.classList.add('editable')
  })
}
var unMakeAllFieldsEditable = () => {
  dataElement.forEach(element => {
    element.classList.remove('editable')
  })
  dataElementExp.forEach(element => {
    element.classList.remove('editable')
  })
}

dataElement.forEach((element) => {
  element.addEventListener('click', (e) => {
    element.classList.contains('editable') ? element.classList.add('being-edited'): ""
  })
})


//#endregion

//#region (l) writeData
var dataWorkedForClub = document.querySelector("#data-workedforclub");
var dataCoordinated = document.querySelector("#data-coordinated");
var dataTournaments = document.querySelector("#data-tournaments");
var dataJudge = document.querySelector("#data-judge");
var dataInternational = document.querySelector("#data-international");
var dataProfesional = document.querySelector("#data-profesional");
var dataCompiting = document.querySelector("#data-compiting");

var dataVisa = document.querySelector("#data-visa");
var dataSports = document.querySelector("#data-sports .data-content");
var dataExp = document.querySelector("#data-exp .data-content");
var dataWeeklyhours = document.querySelector("#data-weeklyhours .data-content");
var dataAlumn = document.querySelector("#data-alumn .data-content");
var dataAvailability = document.querySelector("#data-availability .data-content");
var dataMobility = document.querySelector("#data-mobility .data-content");
var dataOportunity = document.querySelector("#data-oportunity .data-content");
var dataRange = document.querySelector("#data-range .data-content");
var dataRecommendator = document.querySelector("#data-recommendator");
var dataResidence = document.querySelector("#data-residence");
var dataAge = document.querySelector("#data-age");
var dataEmail = document.querySelector("#data-email");
var dataLanguage = document.querySelector("#data-language");
var dataNumber = document.querySelector("#data-number");
var dataName = document.querySelector("#profile-element-container-name");
var dataLinkedin = document.querySelector("#data-linkedin");
var dataLinkedinWrapper = document.querySelector("#data-linkedin-wrapper");
var dataInstagram = document.querySelector("#data-instagram");
var dataInstagramWrapper = document.querySelector("#data-instagram-wrapper");
var dataFlag = document.querySelector('#data-flag')


var newEditedData

var fillDataInDocument = (data) => {

  newEditedData = data;

  var dataSelectOne = (optionsAttribute, queryVariable, documentElement, mappingFunction, updateQueryVariable) => {
  // Set selected from query to document
  var selectorAllOptions = document.querySelectorAll(`[${optionsAttribute}]`);
  selectorAllOptions.forEach((element) => {
    if (element.getAttribute(`${optionsAttribute}`) === queryVariable) {
      element.classList.add('selected');
    }
  });

  // Set the data from query to document
  documentElement.innerHTML = mappingFunction(queryVariable);

  // Manage edition
  selectorAllOptions.forEach(element => {
    element.addEventListener('click', () => {
      const newQueryVariable = element.getAttribute(`${optionsAttribute}`);
      updateQueryVariable(newQueryVariable); // Llamada a la función de actualización externa

      documentElement.innerHTML = mappingFunction(newQueryVariable);

      selectorAllOptions.forEach(elem => {
        elem.classList.remove('selected');
      });
      element.classList.add('selected');
    });
  });
  }

  var dataSelectMultiple = (optionsAttribute, queryVariable, documentElement, mappingFunction) => {
    
    // Set selected from query to document
    var selectorAllOptions = document.querySelectorAll(`[${optionsAttribute}]`);

    queryVariable.forEach(upperelement => {
      selectorAllOptions.forEach((element) => {
        if (element.getAttribute(`${optionsAttribute}`) === upperelement) {
          element.classList.add('selected')
        }
      })
    })

    // Set the data from query to document
    let translatedElements = queryVariable.map(element => mappingFunction(element));
    documentElement.innerHTML = translatedElements.join(', ');

    // Manage edition
    selectorAllOptions.forEach(element => {
      element.addEventListener('click', () => {

        if (element.classList.contains('editable')) {
        queryVariable.length = 0

        element.classList.toggle('selected')

        // revert toggle if it's last toggled
        var countSelected = 0
        selectorAllOptions.forEach(element => {
          if (element.classList.contains('selected')) {
            countSelected++
          }
        })

        countSelected === 0 ? element.classList.toggle('selected') : ""

        selectorAllOptions.forEach(element => {
          if (element.classList.contains('selected')) {
            queryVariable.push(element.getAttribute(`${optionsAttribute}`));

            let translatedElements = queryVariable.map(element => mappingFunction(element));
            documentElement.innerHTML = translatedElements.join(', ');

          }
        })
      }

      })
    })
  }

  function updateProperty(newValue, propertyKey) {
    if (newEditedData.hasOwnProperty(propertyKey)) {
      newEditedData[propertyKey] = newValue;
      // Aquí podrías realizar otras acciones relacionadas con newEditedData si es necesario
    } else {
      console.error(`Property ${propertyKey} does not exist in newEditedData.`);
    }
  }


// // // // // // // // // // // // // // // // // // // // // // // // // // - NON EDITABLE YET

// ---------------------------------------------------------------------------- Name
  dataName.innerHTML = `${newEditedData.userName} ${newEditedData.userSurname}`;

// ---------------------------------------------------------------------------- Age
  const actualDate = new Date();
  const birthDate = new Date(newEditedData.userBirthday);
  const diferenciaEnMs = actualDate.getTime() - birthDate.getTime();
  const msEnUnAnio = 1000 * 60 * 60 * 24 * 365.25; // Considerando años bisiestos
  const edad = Math.floor(diferenciaEnMs / msEnUnAnio);
  dataAge.innerHTML = `${edad} años`;

// ---------------------------------------------------------------------------- Flag
  dataFlag.src = `https://flagpedia.net/data/flags/emoji/twitter/256x256/${newEditedData.userNationality}.png`

// ---------------------------------------------------------------------------- Email
  dataEmail.innerHTML = newEditedData.userEmail;

// ---------------------------------------------------------------------------- Number
  dataNumber.innerHTML = newEditedData.userPhoneNumber;

// ---------------------------------------------------------------------------- Residence
  dataResidence.innerHTML = newEditedData.userResidence;

// ---------------------------------------------------------------------------- LinkedIn
  
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

function generateLinkedInUrl(inputString) {
  const regex = /((?<=in\/)[\w\-áéíóúÁÉÍÓÚñÑ]+)|((?<=\/)[\w\-áéíóúÁÉÍÓÚñÑ]+(?=\/?$))|([\w\-áéíóúÁÉÍÓÚñÑ]+(?=\/$))/;
  const match = inputString.match(regex);
  if (match) {
      // Selecting the first non-null group match
      const username = match.find(group => group !== undefined);
      return [`https://www.linkedin.com/in/${username}/`, `in/${username}`];;
  } else {
      return "Invalid input";
  }
}

function generateInstagramUrl(inputString) {
  // Expresión regular para extraer el nombre de usuario de Instagram, incluyendo el caso de '@usuario'
  const regex = /((?<=instagram\.com\/)[\w\.-]+)|((?<=@)[\w\.-]+)|([\w\.-]+(?=\/?$))/;
  const match = inputString.match(regex);
  if (match) {
      // Seleccionando el primer grupo que no sea null
      const username = match.find(group => group !== undefined);
      return [`https://www.instagram.com/${username}/`, `@${username}`];
  } else {
      return "Invalid input";
  }
}

newEditedData.userLinkedin === ""
    ? (dataLinkedinWrapper.style.display = "none")
    : (dataLinkedinWrapper.href = generateLinkedInUrl(newEditedData.userLinkedin)[0], dataLinkedin.innerHTML = generateLinkedInUrl(newEditedData.userLinkedin)[1]);

// ---------------------------------------------------------------------------- Instagram
  newEditedData.userInsta === ""
    ? (dataInstagramWrapper.style.display = "none")
    : (dataInstagramWrapper.href = generateInstagramUrl(newEditedData.userInsta)[0], dataInstagram.innerHTML = generateInstagramUrl(newEditedData.userInsta)[1]);

// ---------------------------------------------------------------------------- Residence

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
  dataResidence.textContent = mapCountry(newEditedData.userResidence)


// // // // // // // // // // // // // // // // // // // // // // // // // // - EDITABLE DATA

// ---------------------------------------------------------------------------- Visa
  dataVisa.innerHTML = newEditedData.userOtherNationality

// ---------------------------------------------------------------------------- Languages

function mapLanguages(data) {
  switch (data) {
      default:
          return data; // Devuelve el mismo valor si no hay traducción
        }
    }
dataSelectMultiple('data-language', newEditedData.userLanguages, dataLanguage, mapLanguages)


// ---------------------------------------------------------------------------- Sports

// var otherOptionSport = document.querySelector('[data-other-sport]')

// otherOptionSport.addEventListener('change', () => {
//   newEditedData.userSports.length = 0
//   newEditedData.userSports.push(otherOptionSport.value)
//   dataSports.innerHTML = newEditedData.userSports.join(", ");
//   otherOptionSport.classList.add('selected')

//   optionsSports.forEach(element => {
//     if (element.classList.contains('selected')) {
//       newEditedData.userSports.push(element.getAttribute('data-sport'))
//       dataSports.innerHTML = newEditedData.userSports.join(", ");

//       dataSports.parentNode.classList.remove('selectionanimation');
//       setTimeout(function() {
//         dataSports.parentNode.classList.add('selectionanimation');
//       }, 1);
//     }
//   })
// })

function mapSport(data) {
  switch (data) {
      // Agrega más casos según tus necesidades
      default:
          return data; // Devuelve el mismo valor si no hay traducción
        }
    }
dataSelectMultiple('data-sport', newEditedData.userSports, dataSports, mapSport)

// ---------------------------------------------------------------------------- Experience
 function mapExp(data) {
    switch (data) {
        case 'two-or-less':
          return '&lt; 2';
        case 'two-to-five':
          return '2 - 5';
        case 'five-to-ten':
          return '5 - 10';
        case 'ten-or-more':
          return '> 10';
        case 'professional player':
          return 'jugador profesional';
        // Agrega más casos según tus necesidades
        default:
            return data; // Devuelve el mismo valor si no hay traducción
          }
      }
dataSelectOne('data-experience', newEditedData.userExperience, dataExp, mapExp, (newValue) => updateProperty(newValue, 'userExperience'));


// ---------------------------------------------------------------------------- Weekly hours
function mapWeekly(data) {
  switch (data) {
      case '0010':
        return '&lt; 10h';
      case '1020':
        return '10 - 20h';
      case '2030':
        return '20 - 30h';
      case '30mo':
        return '> 30h';
      case 'professional player':
        return 'jugador profesional';
      // Agrega más casos según tus necesidades
      default:
          return data; // Devuelve el mismo valor si no hay traducción
        }
    }
dataWeeklyhours.innerHTML = mapWeekly(newEditedData.userWeeklyHours);

dataSelectOne('data-hours', newEditedData.userWeeklyHours, dataWeeklyhours, mapWeekly, (newValue) => updateProperty(newValue, 'userWeeklyHours'));


// ---------------------------------------------------------------------------- Alumni Profile
  function mapLevel(element) {
    switch (element) {
      case 'initiation':
        return 'iniciación';
      case 'intermed':
        return 'intermedio';
      case 'advanced':
          return 'avanzado';
      case 'profesional':
          return 'profesional';
        // Agrega más casos según tus necesidades
        default:
            return element; // Devuelve el mismo valor si no hay traducción
    }
  }
dataSelectMultiple('data-level', newEditedData.userPreferredLevel, dataAlumn, mapLevel)

// ---------------------------------------------------------------------------- Availability
function mapAvailability(element) {
  switch (element) {
      case '4mo':
        return '> 4';
      case '2o3':
        return '2 - 3';
      case 'one':
          return '1';
      case 'now':
          return 'inmediata';
      // Agrega más casos según tus necesidades
      default:
          return element; // Devuelve el mismo valor si no hay traducción
  }
}
dataSelectOne('data-startingtime', newEditedData.userAvailability, dataAvailability, mapAvailability, (newValue) => updateProperty(newValue, 'userAvailability'));


// ---------------------------------------------------------------------------- Mobility
  function mapContinents(element) {
    switch (element) {
      case 'europe':
        return 'europa';
      case 'america':
        return 'américa';
      case 'asia':
          return 'asia';
      case 'africa':
          return 'áfrica';
      case 'oceania':
        return 'oceanía';
        default:
            return continente;
    }
}
dataSelectMultiple('data-mobility', newEditedData.userMobilityContinents, dataMobility, mapContinents)


// ---------------------------------------------------------------------------- Oportunity
function mapOportunity(element) {
  switch (element) {
      case 'full':
        return 'full time';
      case 'part':
        return 'part time';
      case 'temp':
          return 'temporal';
      case 'esp':
          return 'esporádico';
      // Agrega más casos según tus necesidades
      default:
          return element; // Devuelve el mismo valor si no hay traducción
  }
}
dataSelectMultiple('data-oportunity', newEditedData.userOportunityType, dataOportunity, mapOportunity)


// ---------------------------------------------------------------------------- Salary
function mapSalary(nivel) {
  switch (nivel) {
      case '2030':
        return '20k - 30k';
      case '3040':
        return '30k - 40k';
      case '4050':
          return '40k - 50k';
      case '5099':
          return '> 50k';
      // Agrega más casos según tus necesidades
      default:
          return nivel; // Devuelve el mismo valor si no hay traducción
  }
}
dataSelectOne('data-salary', newEditedData.userExpectedSalary, dataRange, mapSalary, (newValue) => updateProperty(newValue, 'userExpectedSalary'));

// ---------------------------------------------------------------------------- Recommendator
  function casesRecommendator(data) {
    switch (data) {
        case 'no':
          return 'No';
        case 'diego-ortiz':
          return 'Diego Ortiz';
        case 'javier-marti':
            return 'Javier Martí';
        case 'miguel-semmler':
            return 'Miguel Semmler';
        case 'adriana-armenadriz':
          return 'Adriana Armendariz';
        case 'diego-ortiz':
          return 'Diego Ortiz';
        case 'alejandro-crespo':
          return 'Alejandro Crespo';
        case 'sergi-perez':
          return 'Sergi Pérez';
        case 'laura-marti':
          return 'Laura Martí';
        // Agrega más casos según tus necesidades
        default:
            return data; // Devuelve el mismo valor si no hay traducción
    }
}
dataSelectOne('data-recommendator', newEditedData.userRecommendation, dataRecommendator, casesRecommendator, (newValue) => updateProperty(newValue, 'userRecommendation'));

// // // // // // // // // // // // // // // // // // // // // // // // // // - EDITABLE EXP

// Función que devuelve el valor actualizado de queryVariable
var expToggleSelection = (queryVariable, documentElement, newDataCallback) => {
  queryVariable === "y" ? documentElement.classList.add("marked") : "";

  documentElement.addEventListener('click', () => {
    if (documentElement.classList.contains('editable')) {
      documentElement.classList.toggle("marked");
      queryVariable = documentElement.classList.contains('marked') ? 'y' : 'n';
      // Llamada a la función de devolución de llamada para actualizar newEditedData
      newDataCallback(queryVariable);
    }
  });
};

// Función para actualizar newEditedData.userClubExp
function updateNewEditedData(newValue, propertyKey) {
  // Verifica si la propiedad existe en newEditedData
  if (newEditedData.hasOwnProperty(propertyKey)) {
    newEditedData[propertyKey] = newValue;
    // Aquí podrías realizar otras acciones relacionadas con newEditedData si es necesario
  } else {
    console.error(`Property ${propertyKey} does not exist in newEditedData.`);
  }
}

// Llamada a la función expToggleSelection con la función de devolución de llamada para actualizar newEditedData
  expToggleSelection(newEditedData.userClubExp, dataWorkedForClub, (newValue) => updateNewEditedData(newValue, 'userClubExp'));


// ---------------------------------------------------------------------------- Other Coach Exp
  expToggleSelection(newEditedData.userOtherCoachExp, dataCoordinated, (newValue) => updateNewEditedData(newValue, 'userOtherCoachExp'));


// ---------------------------------------------------------------------------- Tournaments Organized
  expToggleSelection(newEditedData.userToursOrganized, dataTournaments, (newValue) => updateNewEditedData(newValue, 'userToursOrganized'));


// ---------------------------------------------------------------------------- Tours Juzge
  expToggleSelection(newEditedData.userProfessionalExp, dataProfesional, (newValue) => updateNewEditedData(newValue, 'userProfessionalExp'));

  expToggleSelection(newEditedData.userToursJuzge, dataJudge, (newValue) => updateNewEditedData(newValue, 'userToursJuzge'));


// ---------------------------------------------------------------------------- International Exp
  expToggleSelection(newEditedData.userInternationalExp, dataInternational, (newValue) => updateNewEditedData(newValue, 'userInternationalExp'));


// ---------------------------------------------------------------------------- Compiting Now
  expToggleSelection(newEditedData.userCompetingNow, dataCompiting, (newValue) => updateNewEditedData(newValue, 'userCompetingNow'));

};

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
  image.style.border = '0.5rem solid white'
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

//#region (l) manage file uploading and downloading

const eraseDocument = document.querySelector(".erase-offer");

eraseDocument.addEventListener("click", () => {
  firebaseRemoveJobOffer(valorCookieId).then(() => {
    jobOfferButton.value = ''
    console.log("asjdoasjdos");
    downloadLinksLabel.classList.remove("download-available");
    eraseDocument.classList.remove("download-available");
    jobOfferButtonLabel.style.display = "flex"
  });
});

const downloadLinksLabel = document.querySelector(".downloadLink-wording");
const jobOfferButton = document.querySelector("#job-offer");
const jobOfferButtonLabel = document.querySelector("#job-offer-label");

function extraerNombreArchivo(url) {
  const regex = /o\/(.*?)\?/; // Captura todo entre 'o/' y el siguiente '?'
  // const regex = %2..*%2F(.*?)\?alt;
  const match = url.match(regex);
  return match ? match[1] : null; // Devuelve el grupo capturado si existe, de lo contrario null
}

firebaseGetJobOffer(valorCookieId).then((url) => {
  downloadLinksLabel.href = url;
  downloadLinksLabel.download = extraerNombreArchivo(url);
  downloadLinksLabel.innerHTML = `Descarga <svg xmlns="http://www.w3.org/2000/svg" style="margin-left: 1rem" width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M21 21H3M18 11L12 17M12 17L6 11M12 17V3" stroke="#025B7B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg`;
  jobOfferButtonLabel.style.display = "none"
  downloadLinksLabel.classList.add("download-available");
  eraseDocument.classList.add("download-available");
});

firebaseGetProfilePicture(valorCookieId)
  .then((url) => {
    image.src = url;
    setSettedImageStyling();
  })
  .catch((e) => {
    console.log(e);
  });

jobOfferButtonLabel.addEventListener("click", function () {
  jobOfferButton.click();
});

jobOfferButton.addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (!file) {
    return;
  }

  const fileUrl = URL.createObjectURL(file);

  downloadLinksLabel.href = fileUrl;
  downloadLinksLabel.download = file.name;
  downloadLinksLabel.innerHTML = `Descarga <svg xmlns="http://www.w3.org/2000/svg" style="margin-left: 1rem" width="20" height="20" viewBox="0 0 24 24" fill="none">
  <path d="M21 21H3M18 11L12 17M12 17L6 11M12 17V3" stroke="#025B7B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg`;
  downloadLinksLabel.classList.add("download-available");
  eraseDocument.classList.add("download-available");
  jobOfferButtonLabel.style.display = "none"

  firebaseUploadDocument(file, `profileDocument=${valorCookieId}.pdf`);
});

//#endregion

//#region (l) manage video uploading and downloading

const eraseVideo = document.querySelector(".erase-video");

eraseVideo.addEventListener("click", () => {
  firebaseRemoveVideo(valorCookieId).then(() => {
    jobVideoButton.value = ''
    downloadVideoLinksLabel.classList.remove("download-available");
    eraseVideo.classList.remove("download-available");
    jobVideoButtonLabel.style.display = "flex"
  });
});

const downloadVideoLinksLabel = document.querySelector(".downloadVideoLink-wording");
const jobVideoButton = document.querySelector("#job-video");
const jobVideoButtonLabel = document.querySelector("#job-video-label");

firebaseGetVideo(valorCookieId).then((url) => {
  downloadVideoLinksLabel.href = url;
  downloadVideoLinksLabel.download = extraerNombreArchivo(url);
  downloadVideoLinksLabel.innerHTML = `Descarga <svg xmlns="http://www.w3.org/2000/svg" style="margin-left: 1rem" width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M21 21H3M18 11L12 17M12 17L6 11M12 17V3" stroke="#025B7B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg`;
  jobVideoButtonLabel.style.display = "none"
  downloadVideoLinksLabel.classList.add("download-available");
  eraseVideo.classList.add("download-available");
});

jobVideoButtonLabel.addEventListener("click", function () {
  jobVideoButton.click();
});

jobVideoButton.addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (!file) {
    return;
  }

  const fileUrl = URL.createObjectURL(file);

  downloadVideoLinksLabel.href = fileUrl;
  downloadVideoLinksLabel.download = file.name;
  downloadVideoLinksLabel.innerHTML = `Descarga <svg xmlns="http://www.w3.org/2000/svg" style="margin-left: 1rem" width="20" height="20" viewBox="0 0 24 24" fill="none">
  <path d="M21 21H3M18 11L12 17M12 17L6 11M12 17V3" stroke="#025B7B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg`;
  downloadVideoLinksLabel.classList.add("download-available");
  eraseVideo.classList.add("download-available");
  jobVideoButtonLabel.style.display = "none"

  firebaseUploadDocument(file, `profileDocument=${valorCookieId}.mp4`);
});

//#endregion


//#region (l) logout 

logoutButton.addEventListener('click', () => {
  firebaseLogout()
})

//#endregion