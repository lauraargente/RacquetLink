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

//#region checkIfUserIsAllowed

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

//#region edit logic


editButton.addEventListener("click", () => {
  editButton.style.opacity = '0'
  editButton.style.pointerEvents = 'none'
  saveButton.style.opacity = '1'
  saveButton.style.pointerEvents = 'auto'

  actionsWrapper.style.right = '100%'
  actionsWrapper.style.transform = 'translateX(100%)'

  editStyledElements.forEach((element) => {
    element.classList.toggle("styled");
  });
  makeAllFieldsEditable()
});

saveButton.addEventListener("click", () => {
  editButton.style.opacity = '1'
  editButton.style.pointerEvents = 'auto'
  saveButton.style.opacity = '0'
  saveButton.style.pointerEvents = 'none'

  actionsWrapper.style.right = '0'
  actionsWrapper.style.transform = 'translateX(0)'


  editStyledElements.forEach((element) => {
    element.classList.toggle("styled");
  });
  makeAllFieldsEditable()
});

var makeAllFieldsEditable = () => {
  dataElement.forEach(element => {
    element.classList.toggle('editable')
  })
  dataElementExp.forEach(element => {
    element.classList.toggle('editable')
  })
}

//#endregion

//#region writeData
var dataWorkedForClub = document.querySelector("#data-workedforclub");
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
var dataAge = document.querySelector("#data-age");
var dataEmail = document.querySelector("#data-email");
var dataNumber = document.querySelector("#data-number");
var dataName = document.querySelector("#profile-element-container-name");
var dataLinkedin = document.querySelector("#data-linkedin");
var dataInstagram = document.querySelector("#data-instagram");
var dataFlag = document.querySelector('#data-flag')

var fillDataInDocument = (data) => {

  console.log(data)
  dataName.innerHTML = `${data.userName} ${data.userSurname}`;

  const actualDate = new Date();
  const birthDate = new Date(data.userBirthday);
  const diferenciaEnMs = actualDate.getTime() - birthDate.getTime();
  const msEnUnAnio = 1000 * 60 * 60 * 24 * 365.25; // Considerando años bisiestos
  const edad = Math.floor(diferenciaEnMs / msEnUnAnio);
  dataAge.innerHTML = `${edad} años`;

  dataFlag.src = `https://flagpedia.net/data/flags/emoji/twitter/256x256/${data.userNationality}.png`

  dataEmail.innerHTML = data.userEmail;

  dataNumber.innerHTML = data.userPhoneNumber;

  data.userLinkedin === ""
    ? (dataLinkedin.style.display = "none")
    : (dataLinkedin.href = data.userLinkedin);
  data.userInsta === ""
    ? (dataInstagram.style.display = "none")
    : (dataInstagram.href = data.userInsta);

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

  dataResidence.innerHTML = mapCountry(data.userResidence)
  dataVisa.innerHTML = data.userOtherNationality

// ---------------------------------------------------------------------------- Languages
  dataLanguages.innerHTML = data.userLanguages.join(", ");

// ---------------------------------------------------------------------------- Sports
  dataSports.innerHTML = data.userSports.join(", ");

// ---------------------------------------------------------------------------- Experience
  dataExp.innerHTML = data.userExperience;
  data.userExperience === "profesional player"
    ? (dataExp.innerHTML = "Jugador Profesional")
    : "";
  data.userExperience === "ten-or-more" ? (dataExp.innerHTML = "+10") : "";
  data.userExperience === "two-or-less" ? (dataExp.innerHTML = "0-2") : "";
  data.userExperience === "five-to-ten" ? (dataExp.innerHTML = "5-10") : "";
  data.userExperience === "two to five" ? (dataExp.innerHTML = "2-5") : "";

// ---------------------------------------------------------------------------- Weekly hours
  data.userWeeklyHours === "0010"
    ? (dataWeeklyhours.innerHTML = "0 - 10h")
    : "";
  data.userWeeklyHours === "1020"
    ? (dataWeeklyhours.innerHTML = "10 - 20h")
    : "";
  data.userWeeklyHours === "2030"
    ? (dataWeeklyhours.innerHTML = "20 - 30h")
    : "";
  data.userWeeklyHours === "30mo"
    ? (dataWeeklyhours.innerHTML = "+30h")
    : "";

// ---------------------------------------------------------------------------- Alumni Profile
  function traducirNivel(nivel) {
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
  let nivelesTraducidos = data.userPreferredLevel.map(nivel => traducirNivel(nivel));
  dataAlumn.innerHTML = nivelesTraducidos.join(', ');

// ---------------------------------------------------------------------------- Availability
  data.userAvailability === "4mo"
    ? (dataAvailability.innerHTML = "4 months")
    : "";
  dataAvailability.innerHTML = "4 months";

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
let continentesTraducidos = data.userMobilityContinents.map(continente => traducirContinentes(continente));
dataMobility.innerHTML = continentesTraducidos.join(', ');

// ---------------------------------------------------------------------------- Oportunity
  dataOportunity.innerHTML = data.userOportunityType.join(", ");

//#region writing Expected Salary 

  data.userExpectedSalary === "2030" ? (dataRange.innerHTML = "20 - 30k") : "";
  data.userExpectedSalary === "3040" ? (dataRange.innerHTML = "30 - 40k") : "";
  data.userExpectedSalary === "4050" ? (dataRange.innerHTML = "40 - 50k") : "";
  data.userExpectedSalary === "5099" ? (dataRange.innerHTML = "+50k") : "";

//#endregion

  dataRecommendator.innerHTML = data.userRecommendation;

  //#region experience

  data.userClubExp === "y" ? dataWorkedForClub.classList.add("marked") : "";

  data.userOtherCoachExp === "y" ? dataCoordinated.classList.add("marked") : "";
  data.userToursOrganized === "y"
    ? dataTournaments.classList.add("marked")
    : "";
  data.userToursJuzge === "y" ? dataJudge.classList.add("marked") : "";
  data.userProfessionalExp === "y"
    ? dataProfesional.classList.add("marked")
    : "";
  data.userInternationalExp === "y"
    ? dataInternational.classList.add("marked")
    : "";
  data.userCompetingNow === "y" ? dataCompiting.classList.add("marked") : "";

  //#endregion
};

//#endregion

var loadFile = function (event) {
  var image = document.getElementById("output");
  var profileLabel = document.getElementById("profile-image-label");
  profileLabel.style.visibility = "hidden";
  image.src = URL.createObjectURL(event.target.files[0]);
  // image.style.border = '4px solid white'
};
