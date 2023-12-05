import { firebaseFetchUserDataById } from "./profile-coach-firebase.js";
import { firebaseUpdateProfilePicture } from "./profile-coach-firebase.js";
import { firebaseGetProfilePicture } from "./profile-coach-firebase.js";
import { firebaseUpdateUserData } from "./profile-coach-firebase.js";

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
      });
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

//#region (l) edit logic

var setEditableStyles = () => {
  editButton.style.opacity = '0'
  editButton.style.pointerEvents = 'none'
  saveButton.style.opacity = '1'
  saveButton.style.pointerEvents = 'auto'

  actionsWrapper.style.right = '0'
  actionsWrapper.style.transform = 'translateX(0)'

  editStyledElements.forEach((element) => {
    element.classList.toggle("styled");
  });
}

var unsetEditableStyles = () => {
  editButton.style.opacity = '1'
  editButton.style.pointerEvents = 'auto'
  saveButton.style.opacity = '0'
  saveButton.style.pointerEvents = 'none'

  actionsWrapper.style.right = '100%'
  actionsWrapper.style.transform = 'translateX(100%)'


  editStyledElements.forEach((element) => {
    element.classList.toggle("styled");
  });
}

editButton.addEventListener("click", () => {
  setEditableStyles()
  makeAllFieldsEditable()
});

saveButton.addEventListener("click", () => {
  unsetEditableStyles()
  unMakeAllFieldsEditable()
  disSelectAllFields()
  // Set loading state
  firebaseUpdateUserData(valorCookieId, newEditedData)
  console.log(newEditedData)
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
var disSelectAllFields = (e) => {
  dataElement.forEach(element => {
    element.classList.remove('being-edited')
  })
  dataElementExp.forEach(element => {
    element.classList.remove('editable')
  })
}

dataElement.forEach((element) => {
  element.addEventListener('click', (e) => {
    disSelectAllFields(e)
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

var dataVisa = document.querySelector("#data-visa .data-content");
var dataLanguages = document.querySelector("#data-languages .data-content");
var dataSports = document.querySelector("#data-sports .data-content");
var dataExp = document.querySelector("#data-exp .data-content");
var dataWeeklyhours = document.querySelector("#data-weeklyhours .data-content");
var dataAlumn = document.querySelector("#data-alumn .data-content");
var dataAvailability = document.querySelector("#data-availability .data-content");
var dataMobility = document.querySelector("#data-mobility .data-content");
var dataOportunity = document.querySelector("#data-oportunity .data-content");
var dataRange = document.querySelector("#data-range .data-content");
var dataRecommendator = document.querySelector("#data-recommendator .data-content");

var dataResidence = document.querySelector("#data-residence");
var dataAge = document.querySelector("#data-age");
var dataEmail = document.querySelector("#data-email");
var dataNumber = document.querySelector("#data-number");
var dataName = document.querySelector("#profile-element-container-name");
var dataLinkedin = document.querySelector("#data-linkedin");
var dataInstagram = document.querySelector("#data-instagram");
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

      documentElement.parentNode.classList.remove('selectionanimation');
      setTimeout(function() {
        documentElement.parentNode.classList.add('selectionanimation');
      }, 1);
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

            documentElement.parentNode.classList.remove('selectionanimation');
            setTimeout(function() {
              documentElement.parentNode.classList.add('selectionanimation');
            }, 1);
          }
        })
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

newEditedData.userLinkedin === ""
    ? (dataLinkedin.style.display = "none")
    : (dataLinkedin.href = formatearURL(newEditedData.userLinkedin));

// ---------------------------------------------------------------------------- Instagram
  newEditedData.userInsta === ""
    ? (dataInstagram.style.display = "none")
    : (dataInstagram.href = formatearURL(newEditedData.userInsta));

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

  var optionsVisa = document.querySelector('[data-visa]')

  optionsVisa.addEventListener('input', () => {
    newEditedData.userOtherNationality = optionsVisa.value
    dataVisa.innerHTML = optionsVisa.value
    if (optionsVisa.value === '') {
      newEditedData.userOtherNationality = 'no'
      dataVisa.innerHTML = 'no'
    }
  })

// ---------------------------------------------------------------------------- Languages

function mapLanguages(data) {
  switch (data) {
      default:
          return data; // Devuelve el mismo valor si no hay traducción
        }
    }
dataSelectMultiple('data-language', newEditedData.userLanguages, dataLanguages, mapLanguages)

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
        return 'en 4 meses o más';
      case '2o3':
        return 'en 2 o 3 meses';
      case 'one':
          return 'en 1 mes';
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
          return 'no';
        case 'diego-ortiz':
          return 'diego ortiz';
        case 'javier-marti':
            return 'javier martí';
        case 'miguel-semmler':
            return 'miguel semmler';
        case 'adriana-armenadriz':
          return 'adriana armendariz';
        case 'diego-ortiz':
          return 'diego ortiz';
        case 'alejandro-crespo':
          return 'alejandro crespo';
        case 'sergi-perez':
          return 'sergi perez';
        case 'laura-marti':
          return 'laura martí';
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