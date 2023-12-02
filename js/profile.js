import { firebaseFetchUserDataById } from "./profile-coach-firebase.js";

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

//#region (v) dataVariables

var dataCoordinated = document.querySelector("#data-coordinated");
var dataTournaments = document.querySelector("#data-tournaments");
var dataJudge = document.querySelector("#data-judge");
var dataInternational = document.querySelector("#data-international");
var dataProfesional = document.querySelector("#data-profesional");
var dataCompiting = document.querySelector("#data-compiting");
var dataResidence = document.querySelector("#data-residence");
var dataVisa = document.querySelector("#data-visa");
var dataLanguages = document.querySelector("#data-languages");
var dataSports = document.querySelector("#data-sports");
var dataExp = document.querySelector("#data-exp");
var dataWeeklyhours = document.querySelector("#data-weeklyhours");
var dataAlumn = document.querySelector("#data-alumn");
var dataAvailability = document.querySelector("#data-availability");
var dataMobility = document.querySelector("#data-mobility");
var dataOportunity = document.querySelector("#data-oportunity");
var dataRange = document.querySelector("#data-range");
var dataRecommendator = document.querySelector("#data-recommendator");

//#endregion

//#region (v) editVariables 

var profilePicture = document.querySelector('#profile-picture')
var imageContainer = document.querySelector('#image-container')
var profileLabel = document.getElementById("profile-image-label");

//#endregion

//#region (l) checkIfUserIsAllowed

var isUserAllowed = () => {
  const params = new URLSearchParams(window.location.search);
  console.log(params);

  if (params.has("id")) {
    if (params.get("id") === valorCookieId) {
      firebaseFetchUserDataById(valorCookieId).then((userData) => {
        // fillDataInPage()
        pageLoader.style.display = "none";
        body.style.overflowY = "visible";
        console.log(userData);
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
});

var makeAllFieldsEditable = () => {
  dataElement.forEach(element => {
    element.classList.add('editable')
  })
}
var unMakeAllFieldsEditable = () => {
  dataElement.forEach(element => {
    element.classList.remove('editable')
  })
}
var disSelectAllFields = (e) => {
  dataElement.forEach(element => {
    element.classList.remove('being-edited')
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

var dataResidence = document.querySelector("#data-residence > .data-content");
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

var dataAge = document.querySelector("#data-age");
var dataEmail = document.querySelector("#data-email");
var dataNumber = document.querySelector("#data-number");
var dataName = document.querySelector("#profile-element-container-name");
var dataLinkedin = document.querySelector("#data-linkedin");
var dataInstagram = document.querySelector("#data-instagram");
var dataFlag = document.querySelector('#data-flag')


var newEditedData

var fillDataInDocument = (data) => {

  var dataSelectOne = (optionsAttribute, queryVariable, documentText, mappingFunction) => {
    
    var selectorAllOptions = document.querySelectorAll(`[${optionsAttribute}]`);
    selectorAllOptions.forEach(element => {
      element.addEventListener('click', () => {
        queryVariable = element.getAttribute(`${optionsAttribute}`)
        documentText.innerHTML = mappingFunction(queryVariable);
        selectorAllOptions.forEach(element => {
          element.classList.remove('selected')
        })
        element.classList.add('selected')
        documentText.parentNode.classList.remove('selectionanimation');
        setTimeout(function() {
          documentText.parentNode.classList.add('selectionanimation');
        }, 1);
      })
    })
  }

  newEditedData = data;

  console.log(data)

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

// ---------------------------------------------------------------------------- LinkedIn
  newEditedData.userLinkedin === ""
    ? (dataLinkedin.style.display = "none")
    : (dataLinkedin.href = newEditedData.userLinkedin);

// ---------------------------------------------------------------------------- Instagram
  newEditedData.userInsta === ""
    ? (dataInstagram.style.display = "none")
    : (dataInstagram.href = newEditedData.userInsta);

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
      
      // Ejemplo de acceso a los datos
      console.log(countryCodes['es']); // Devuelve 'España'
      console.log(countryCodes['fr']); // Devuelve 'Francia'
      // Y así sucesivamente para cada código de país
      
  
      // Verificar si el código de país existe en el mapa
      if (countryCodes.hasOwnProperty(code)) {
          return countryCodes[code]; // Devuelve el nombre del país correspondiente
      } else {
          return 'País no especificado'; // O un mensaje predeterminado para códigos no encontrados
      }
  }
  dataResidence.textContent = mapCountry(newEditedData.userResidence)

// ---------------------------------------------------------------------------- Visa
  dataVisa.innerHTML = newEditedData.userOtherNationality

  var optionsVisa = document.querySelector('[data-visa]')

  optionsVisa.addEventListener('input', () => {
    newEditedData.userOtherNationality = optionsVisa.value
    dataVisa.innerHTML = optionsVisa.value
  })

// ---------------------------------------------------------------------------- Languages
dataLanguages.innerHTML = newEditedData.userLanguages.join(", ");

var optionsLanguages = document.querySelectorAll('[data-language]');

newEditedData.userLanguages.forEach(language => {
  optionsLanguages.forEach((element) => {
    if (element.getAttribute('data-language') === language) {
      element.classList.add('selected')
    }
  })
})

optionsLanguages.forEach(element => {
  element.addEventListener('click', () => {
    newEditedData.userLanguages.length = 0
    element.classList.toggle('selected')
    optionsLanguages.forEach(element => {
      if (element.classList.contains('selected')) {
        newEditedData.userLanguages.push(element.getAttribute('data-language'))
        dataLanguages.innerHTML = newEditedData.userLanguages.join(", ");

        dataLanguages.parentNode.classList.remove('selectionanimation');
        setTimeout(function() {
          dataLanguages.parentNode.classList.add('selectionanimation');
        }, 1);
      }
    })
  })
})
// ---------------------------------------------------------------------------- Sports

dataSports.innerHTML = newEditedData.userSports.join(", ");

var optionsSports = document.querySelectorAll('[data-sport]');

newEditedData.userSports.forEach(sport => {
  optionsSports.forEach((element) => {
    if (element.getAttribute('data-sport') === sport) {
      element.classList.add('selected')
    }
  })
})

var otherOptionSport = document.querySelector('[data-other-sport]')

otherOptionSport.addEventListener('change', () => {
  newEditedData.userSports.length = 0
  newEditedData.userSports.push(otherOptionSport.value)
  dataSports.innerHTML = newEditedData.userSports.join(", ");
  otherOptionSport.classList.add('selected')


  optionsSports.forEach(element => {
    if (element.classList.contains('selected')) {
      newEditedData.userSports.push(element.getAttribute('data-sport'))
      dataSports.innerHTML = newEditedData.userSports.join(", ");

      dataSports.parentNode.classList.remove('selectionanimation');
      setTimeout(function() {
        dataSports.parentNode.classList.add('selectionanimation');
      }, 1);
    }
  })
})

optionsSports.forEach(element => {
  element.addEventListener('click', () => {
    newEditedData.userSports.length = 0
    element.classList.toggle('selected')
    optionsSports.forEach(element => {
      if (element.classList.contains('selected')) {
        newEditedData.userSports.push(element.getAttribute('data-sport'))
        dataSports.innerHTML = newEditedData.userSports.join(", ");

        dataSports.parentNode.classList.remove('selectionanimation');
        setTimeout(function() {
          dataSports.parentNode.classList.add('selectionanimation');
        }, 1);
      }
    })
  })
})



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
dataExp.innerHTML = mapExp(newEditedData.userExperience);

dataSelectOne('data-experience', newEditedData.userExperience, dataExp, mapExp)


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

dataSelectOne('data-hours', newEditedData.userWeeklyHours, dataWeeklyhours, mapWeekly)

// ---------------------------------------------------------------------------- Alumni Profile
  function mapLevel(nivel) {
      switch (nivel) {
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
              return nivel; // Devuelve el mismo valor si no hay traducción
      }
  }
  let nivelesTraducidos = newEditedData.userPreferredLevel.map(nivel => mapLevel(nivel));
  dataAlumn.innerHTML = nivelesTraducidos.join(', ');

// ---------------------------------------------------------------------------- Availability
function mapAvailability(nivel) {
  switch (nivel) {
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
          return nivel; // Devuelve el mismo valor si no hay traducción
  }
}
dataAvailability.innerHTML = mapWeekly(newEditedData.userWeeklyHours);

dataSelectOne('data-startingtime', newEditedData.userAvailability, dataAvailability, mapAvailability)

// ---------------------------------------------------------------------------- Mobility
  function traducirContinentes(continente) {
    switch (continente) {
        case 'europe':
          return 'europa';
        // Agrega más casos según tus necesidades
        default:
            return continente; // Devuelve el mismo valor si no hay traducción
    }
}
let continentesTraducidos = newEditedData.userMobilityContinents.map(continente => traducirContinentes(continente));
dataMobility.innerHTML = continentesTraducidos.join(', ');

// ---------------------------------------------------------------------------- Oportunity
  dataOportunity.innerHTML = newEditedData.userOportunityType.join(", ");

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
dataRange.innerHTML = mapSalary(newEditedData.userExpectedSalary);

dataSelectOne('data-salary', newEditedData.userExpectedSalary, dataRange, mapSalary)

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
          return 'laura marti';
        // Agrega más casos según tus necesidades
        default:
            return data; // Devuelve el mismo valor si no hay traducción
    }
}
dataRecommendator.innerHTML = casesRecommendator(newEditedData.userRecommendation);

dataSelectOne('data-recommendator', newEditedData.userRecommendation, dataRecommendator, casesRecommendator)


// ---------------------------------------------------------------------------- Club Exp
  newEditedData.userClubExp === "y" ? dataWorkedForClub.classList.add("marked") : "";

// ---------------------------------------------------------------------------- Other Coach Exp
  newEditedData.userOtherCoachExp === "y" ? dataCoordinated.classList.add("marked") : "";

// ---------------------------------------------------------------------------- Tournaments Organized
  newEditedData.userToursOrganized === "y"
    ? dataTournaments.classList.add("marked")
    : "";

// ---------------------------------------------------------------------------- Tours Juzge
  newEditedData.userToursJuzge === "y" ? dataJudge.classList.add("marked") : "";
  newEditedData.userProfessionalExp === "y"
    ? dataProfesional.classList.add("marked")
    : "";

// ---------------------------------------------------------------------------- International Exp
  newEditedData.userInternationalExp === "y"
    ? dataInternational.classList.add("marked")
    : "";

// ---------------------------------------------------------------------------- Compiting Now
  newEditedData.userCompetingNow === "y" ? dataCompiting.classList.add("marked") : "";

};

//#endregion

//#region (l) profilePicture 

imageContainer.addEventListener('click', (e) => {
  profilePicture.click()
})

profilePicture.addEventListener('change', (e) => {
  loadFile(e)
})

var loadFile = function (event) {
  var image = document.getElementById("output");
  profileLabel.style.visibility = "hidden";
  image.src = URL.createObjectURL(event.target.files[0]);
  image.style.border = '4px solid white'
};

//#endregion

//#region (l) set edit logic 



//#endregion