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
import { checkIfUserAdmin } from "./adminlist.js";

const dataElement = document.querySelectorAll(".profile-data");
const dataElementExp = document.querySelectorAll(".profile-exp");

const nombreCookie = "loggedUser";
const valorCookie = getCookie(nombreCookie);

const nombreCookieId = "loggedUserId";
const valorCookieId = getCookie(nombreCookieId);

const params = new URLSearchParams(window.location.search);
const userId = params.get("id");

const pageLoader = document.querySelector("#page-loader");
const body = document.querySelector("body");

var logoutButton = document.querySelector("#logout-button");

//#region (l) checkIfUserIsAllowed

var isUserAllowed = () => {
  const params = new URLSearchParams(window.location.search);

  if (params.has("id")) {
    const userId = params.get("id");
    // Permite el acceso si el userId es igual al userId o si el usuario es un administrador
    if (userId === valorCookieId || checkIfUserAdmin(valorCookieId)) {
      firebaseFetchUserDataById(userId).then((userData) => {
        pageLoader.style.display = "none";
        body.style.overflowY = "visible";
        logoutButton.style.display = "flex";
        fillDataInDocument(userData);
      });
    } else {
      // Usuario no es administrador y no coincide con el valor de la cookie
      setTimeout(() => {
        pageLoader.innerHTML = "No dispone de permisos para ver esta página";
      }, 100);
    }
  } else {
    // No hay ID en los parámetros de la URL
    setTimeout(() => {
      pageLoader.innerHTML = "No dispone de permisos para ver esta página";
    }, 100);
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

//#region (v) edit section
const openHamburguerOptions = document.querySelector(
  "#general-options-options"
);
const openHamburguer = document.querySelector(
  "#general-options-options-clickable"
);
const closeHamburguer = document.querySelector("#close-general-options");
const actionsWrapper = document.querySelector("#actions-wrapper");
const editButton = document.querySelector("#edit-button");
const loadingEditButton = document.querySelector("#loading-edit-button");
const saveButton = document.querySelector("#save-button");
//#endregion

//#region (v) editVariables

var profilePicture = document.querySelector("#profile-picture");
var imageContainer = document.querySelector("#image-container");

var editableOptions = document.querySelectorAll(".editable-option");
var editableAdminOptions = document.querySelectorAll(".adminonly-option");
var editableTexts = document.querySelectorAll(".editable-text");
var editableDropdowns = document.querySelectorAll(".dropdown");
var editableDates = document.querySelectorAll(".inputdate");

//#endregion

//#region (l) href logic for language 

var urlActual = window.location.href;
var id = new URL(urlActual).searchParams.get("id");
var urlBaseNueva = "english/profilecoach";
var nuevoEnlace = urlBaseNueva + "?id=" + id;
document.getElementById("dynamic-url").href = nuevoEnlace;

//#endregion


//#region (l) admin-only fields

var adminOnlyFields = document.querySelectorAll(".admin-only");

console.log(adminOnlyFields);

if (!checkIfUserAdmin(valorCookieId)) {
  adminOnlyFields.forEach((element) => {
    element.style.display = "none";
  });
}

//#endregion

//#region (l) edit logic
saveButton.style.display = "none";
loadingEditButton.style.display = "none";

openHamburguer.addEventListener("click", () => {
  openHamburguerOptions.style.display = "flex";
  openHamburguer.style.display = "none";
});

closeHamburguer.addEventListener("click", (event) => {
  openHamburguerOptions.style.display = "none";
  openHamburguer.style.display = "flex";
});

var setEditableStyles = () => {
  saveButton.style.display = "flex";
  loadingEditButton.style.display = "none";
  editButton.style.display = "none";

  editableOptions.forEach((option) => {
    option.classList.add("editable");
  });

  editableTexts.forEach((option) => {
    option.classList.add("editable");
  });

  editableAdminOptions.forEach((option) => {
    option.classList.add("editable");
  });

  editableDropdowns.forEach((option) => {
    option.classList.add("editable");
  });

  editableDates.forEach((option) => {
    option.classList.add("editable");
  });
};

var setLoading = () => {
  saveButton.style.display = "none";
  loadingEditButton.style.display = "flex";
  editButton.style.display = "none";
};

var unsetEditableStyles = () => {
  saveButton.style.display = "none";
  loadingEditButton.style.display = "none";
  editButton.style.display = "flex";

  editableOptions.forEach((option) => {
    option.classList.remove("editable");
  });

  editableTexts.forEach((option) => {
    option.classList.remove("editable");
  });

  editableAdminOptions.forEach((option) => {
    option.classList.remove("editable");
  });

  editableDropdowns.forEach((option) => {
    option.classList.remove("editable");
  });

  editableDates.forEach((option) => {
    option.classList.remove("editable");
  });

  actionsWrapper.style.right = "100%";
};

editButton.addEventListener("click", () => {
  setEditableStyles();
  makeAllFieldsEditable();
});

saveButton.addEventListener("click", () => {
  setLoading();

  console.log(newEditedData);

  firebaseUpdateUserData(userId, newEditedData).then(() => {
    setTimeout(() => {
      unsetEditableStyles();
      unMakeAllFieldsEditable();
    }, 500);
  });
});

var makeAllFieldsEditable = () => {
  dataElement.forEach((element) => {
    element.classList.add("editable");
  });
  dataElementExp.forEach((element) => {
    element.classList.add("editable");
  });
};
var unMakeAllFieldsEditable = () => {
  dataElement.forEach((element) => {
    element.classList.remove("editable");
  });
  dataElementExp.forEach((element) => {
    element.classList.remove("editable");
  });
};

dataElement.forEach((element) => {
  element.addEventListener("click", (e) => {
    element.classList.contains("editable")
      ? element.classList.add("being-edited")
      : "";
  });
});

//#endregion

//#region (l) writeData
var dataWorkedForClub = document.querySelector("#data-workedforclub");
var dataCoordinated = document.querySelector("#data-coordinated");
var dataTournaments = document.querySelector("#data-tournaments");
var dataJudge = document.querySelector("#data-judge");
var dataInternational = document.querySelector("#data-international");
var dataProfesional = document.querySelector("#data-profesional");
var dataCompiting = document.querySelector("#data-compiting");

var dataAdminState = document.querySelector("#data-adminstate");
var dataAdminType = document.querySelector("#data-admintype");

var dataVisa = document.querySelector("#data-visa");
var dataSports = document.querySelector("#data-sports .data-content");
var dataExp = document.querySelector("#data-exp .data-content");
var dataWeeklyhours = document.querySelector("#data-weeklyhours .data-content");
var dataAlumn = document.querySelector("#data-alumn .data-content");
var dataAlumnAge = document.querySelector("#data-studentsage-id .data-content");
var dataAvailability = document.querySelector(
  "#data-availability .data-content"
);
var dataMobility = document.querySelector("#data-mobility .data-content");
var dataOportunity = document.querySelector("#data-oportunity .data-content");
var dataRange = document.querySelector("#data-range .data-content");
var dataRecommendator = document.querySelector("#data-recommendator");
// var dataAge = document.querySelector("#data-age");
var dataLanguage = document.querySelector("#data-languages");
var dataName = document.querySelector("#profile-element-container-name");
// var dataFlag = document.querySelector("#data-flag-user");

var newEditedData;

var fillDataInDocument = (data) => {
  newEditedData = data;

  // Potentially non-existent fields

  newEditedData.userAdditionalInfo = newEditedData.userAdditionalInfo || "";
  newEditedData.userAdminNote = newEditedData.userAdminNote || "";
  newEditedData.userAdminType = newEditedData.userAdminType || "";
  newEditedData.userAdminState = newEditedData.userAdminState || "";
  newEditedData.userAdditionalExperience =
    newEditedData.userAdditionalExperience || "";
  newEditedData.userTitles = newEditedData.userTitles || "";
  newEditedData.userStudentsAge = newEditedData.userStudentsAge || [];
  newEditedData.userExpectedSalary = newEditedData.userExpectedSalary || "0000";

  var dataSelectOne = (
    optionsAttribute,
    queryVariable,
    documentElement,
    mappingFunction,
    updateQueryVariable
  ) => {
    // Set selected from query to document
    var selectorAllOptions = document.querySelectorAll(`[${optionsAttribute}]`);
    selectorAllOptions.forEach((element) => {
      if (element.getAttribute(`${optionsAttribute}`) === queryVariable) {
        element.classList.add("selected");
      }
    });

    // Set the data from query to document
    // documentElement.innerHTML = mappingFunction(queryVariable);

    // Manage edition
    selectorAllOptions.forEach((element) => {
      element.addEventListener("click", () => {
        const newQueryVariable = element.getAttribute(`${optionsAttribute}`);
        updateQueryVariable(newQueryVariable); // Llamada a la función de actualización externa

        // documentElement.innerHTML = mappingFunction(newQueryVariable);

        selectorAllOptions.forEach((elem) => {
          elem.classList.remove("selected");
        });
        element.classList.add("selected");
      });
    });
  };

  var dataSelectOneAdmin = (
    optionsAttribute,
    queryVariable,
    documentElement,
    mappingFunction,
    updateQueryVariable
  ) => {
    // Set selected from query to document
    var selectorAllOptions = document.querySelectorAll(`[${optionsAttribute}]`);
    selectorAllOptions.forEach((element) => {
      if (element.getAttribute(`${optionsAttribute}`) === queryVariable) {
        element.classList.add("marked");
      }
    });

    // Set the data from query to document
    // documentElement.innerHTML = mappingFunction(queryVariable);

    // Manage edition
    selectorAllOptions.forEach((element) => {
      element.addEventListener("click", () => {
        const newQueryVariable = element.getAttribute(`${optionsAttribute}`);
        updateQueryVariable(newQueryVariable); // Llamada a la función de actualización externa

        // documentElement.innerHTML = mappingFunction(newQueryVariable);

        selectorAllOptions.forEach((elem) => {
          elem.classList.remove("marked");
        });
        element.classList.add("marked");
      });
    });
  };

  var dataSelectMultiple = (
    optionsAttribute,
    queryVariable,
    documentElement,
    mappingFunction
  ) => {
    // Set selected from query to document
    var selectorAllOptions = document.querySelectorAll(`[${optionsAttribute}]`);

    console.log(queryVariable);
    queryVariable.forEach((upperelement) => {
      selectorAllOptions.forEach((element) => {
        if (element.getAttribute(`${optionsAttribute}`) === upperelement) {
          element.classList.add("selected");
        }
      });
    });

    // // Set the data from query to document
    // let translatedElements = queryVariable.map((element) =>
    //   mappingFunction(element)
    // );
    // documentElement.innerHTML = translatedElements.join(", ");

    // Manage edition
    selectorAllOptions.forEach((element) => {
      element.addEventListener("click", () => {
        if (element.classList.contains("editable")) {
          queryVariable.length = 0;

          element.classList.toggle("selected");

          // revert toggle if it's last toggled
          var countSelected = 0;
          selectorAllOptions.forEach((element) => {
            if (element.classList.contains("selected")) {
              countSelected++;
            }
          });

          countSelected === 0 ? element.classList.toggle("selected") : "";

          selectorAllOptions.forEach((element) => {
            if (element.classList.contains("selected")) {
              queryVariable.push(element.getAttribute(`${optionsAttribute}`));

              // let translatedElements = queryVariable.map((element) =>
              //   mappingFunction(element)
              // );
              // documentElement.innerHTML = translatedElements.join(", ");
            }
          });
        }
      });
    });
  };

  function updateProperty(newValue, propertyKey) {
    if (newEditedData.hasOwnProperty(propertyKey)) {
      newEditedData[propertyKey] = newValue;
    } else {
      console.error(`Property ${propertyKey} does not exist in newEditedData.`);
    }
  }

  // // // // // // // // // // // // // // // // // // // // // // // // // // - NON EDITABLE YET

  // // ---------------------------------------------------------------------------- Age
  // const actualDate = new Date();
  // const birthDate = new Date(newEditedData.userBirthday);
  // const diferenciaEnMs = actualDate.getTime() - birthDate.getTime();
  // const msEnUnAnio = 1000 * 60 * 60 * 24 * 365.25; // Considerando años bisiestos
  // const edad = Math.floor(diferenciaEnMs / msEnUnAnio);
  // dataAge.innerHTML = `${edad} años`;

  function updateAge() {
    let birthdate = document.querySelector('#birthdate').value;
    newEditedData.userBirthday = birthdate;
  }
  console.log(newEditedData.userBirthday)
  document.querySelector('#birthdate').value = newEditedData.userBirthday;

  document.querySelector('#birthdate').addEventListener('change', () => {
    updateAge()
  })

  // // ---------------------------------------------------------------------------- Flag
  // dataFlag.src = `https://flagpedia.net/data/flags/emoji/twitter/256x256/${newEditedData.userNationality}.png`;

  var setupInputField = (selector, dataProperty) => {
    var inputField = document.querySelector(selector);
    if (!inputField) return; // Si el elemento no existe, salir de la función.

    inputField.style.display = "flex";

    if (
      newEditedData[dataProperty] === "" ||
      newEditedData[dataProperty] === undefined
    ) {
      inputField.classList.add("undefined");
    } else {
      inputField.value = newEditedData[dataProperty];
    }

    inputField.addEventListener("input", () => {
      if (inputField.value === "") {
        inputField.classList.add("undefined");
      } else {
        inputField.classList.remove("undefined");
      }
      newEditedData[dataProperty] = inputField.value;
    });
  };

  // ---------------------------------------------------------------------------- Name
  setupInputField("[data-name]", "userName");

  // ---------------------------------------------------------------------------- Name
  setupInputField("[data-surname]", "userSurname");

  // ---------------------------------------------------------------------------- Email
  setupInputField("[data-email]", "userEmail");

  // ---------------------------------------------------------------------------- Number
  setupInputField("[data-number]", "userPhoneNumber");

  // ---------------------------------------------------------------------------- Visa
  setupInputField("[data-visa]", "userOtherNationality");

  // ---------------------------------------------------------------------------- Visa
  setupInputField("[data-titles]", "userTitles");

  // ---------------------------------------------------------------------------- Residence
  // setupInputField("[data-residence]","userResidence")

  // ---------------------------------------------------------------------------- LinkedIn

  setupInputField("[data-instagram]", "userInsta");

  // ---------------------------------------------------------------------------- Instagram
  setupInputField("[data-linkedin]", "userLinkedin");

  // ---------------------------------------------------------------------------- Residence

  var countries = [
    {
      name: "Afghanistan",
      flag: "af",
      emoji: "🇦🇫",
      unicode: "U+1F1E6 U+1F1EB",
      prefix: 93,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/AF.svg",
    },
    {
      name: "Albania",
      flag: "al",
      emoji: "🇦🇱",
      unicode: "U+1F1E6 U+1F1F1",
      prefix: 355,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/AL.svg",
    },
    {
      name: "Andorra",
      flag: "ad",
      emoji: "🇦🇩",
      unicode: "U+1F1E6 U+1F1E9",
      prefix: 376,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/AD.svg",
    },
    {
      name: "Angola",
      flag: "ao",
      emoji: "🇦🇴",
      unicode: "U+1F1E6 U+1F1F4",
      prefix: 244,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/AO.svg",
    },
    {
      name: "Anguilla",
      flag: "ai",
      emoji: "🇦🇮",
      unicode: "U+1F1E6 U+1F1EE",
      prefix: 1264,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/AI.svg",
    },
    {
      name: "Antarctica",
      flag: "aq",
      emoji: "🇦🇶",
      unicode: "U+1F1E6 U+1F1F6",
      prefix: 672,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/AQ.svg",
    },
    {
      name: "Antigua & Barbuda",
      flag: "ag",
      emoji: "🇦🇬",
      unicode: "U+1F1E6 U+1F1EC",
      prefix: 1268,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/AG.svg",
    },
    {
      name: "Argentina",
      flag: "ar",
      emoji: "🇦🇷",
      unicode: "U+1F1E6 U+1F1F7",
      prefix: 54,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/AR.svg",
    },
    {
      name: "Armenia",
      flag: "am",
      emoji: "🇦🇲",
      unicode: "U+1F1E6 U+1F1F2",
      prefix: 374,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/AM.svg",
    },
    {
      name: "Aruba",
      flag: "aw",
      emoji: "🇦🇼",
      unicode: "U+1F1E6 U+1F1FC",
      prefix: 297,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/AW.svg",
    },
    {
      name: "Australia",
      flag: "au",
      emoji: "🇦🇺",
      unicode: "U+1F1E6 U+1F1FA",
      prefix: 61,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/AU.svg",
    },
    {
      name: "Austria",
      flag: "at",
      emoji: "🇦🇹",
      unicode: "U+1F1E6 U+1F1F9",
      prefix: 43,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/AT.svg",
    },
    {
      name: "Azerbaijan",
      flag: "az",
      emoji: "🇦🇿",
      unicode: "U+1F1E6 U+1F1FF",
      prefix: 994,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/AZ.svg",
    },
    {
      name: "Bahamas",
      flag: "bs",
      emoji: "🇧🇸",
      unicode: "U+1F1E7 U+1F1F8",
      prefix: 1242,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/BS.svg",
    },
    {
      name: "Bahrain",
      flag: "bh",
      emoji: "🇧🇭",
      unicode: "U+1F1E7 U+1F1ED",
      prefix: 973,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/BH.svg",
    },
    {
      name: "Bangladesh",
      flag: "bd",
      emoji: "🇧🇩",
      unicode: "U+1F1E7 U+1F1E9",
      prefix: 880,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/BD.svg",
    },
    {
      name: "Barbados",
      flag: "bb",
      emoji: "🇧🇧",
      unicode: "U+1F1E7 U+1F1E7",
      prefix: 1246,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/BB.svg",
    },
    {
      name: "Belarus",
      flag: "by",
      emoji: "🇧🇾",
      unicode: "U+1F1E7 U+1F1FE",
      prefix: 375,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/BY.svg",
    },
    {
      name: "Belgium",
      flag: "be",
      emoji: "🇧🇪",
      unicode: "U+1F1E7 U+1F1EA",
      prefix: 32,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/BE.svg",
    },
    {
      name: "Belize",
      flag: "bz",
      emoji: "🇧🇿",
      unicode: "U+1F1E7 U+1F1FF",
      prefix: 501,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/BZ.svg",
    },
    {
      name: "Benin",
      flag: "bj",
      emoji: "🇧🇯",
      unicode: "U+1F1E7 U+1F1EF",
      prefix: 229,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/BJ.svg",
    },
    {
      name: "Bermuda",
      flag: "bm",
      emoji: "🇧🇲",
      unicode: "U+1F1E7 U+1F1F2",
      prefix: 1441,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/BM.svg",
    },
    {
      name: "Bhutan",
      flag: "bt",
      emoji: "🇧🇹",
      unicode: "U+1F1E7 U+1F1F9",
      prefix: 975,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/BT.svg",
    },
    {
      name: "Bolivia",
      flag: "bo",
      emoji: "🇧🇴",
      unicode: "U+1F1E7 U+1F1F4",
      prefix: 591,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/BO.svg",
    },
    {
      name: "Bosnia & Herzegovina",
      flag: "ba",
      emoji: "🇧🇦",
      unicode: "U+1F1E7 U+1F1E6",
      prefix: 387,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/BA.svg",
    },
    {
      name: "Botswana",
      flag: "bw",
      emoji: "🇧🇼",
      unicode: "U+1F1E7 U+1F1FC",
      prefix: 267,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/BW.svg",
    },
    {
      name: "Brazil",
      flag: "br",
      emoji: "🇧🇷",
      unicode: "U+1F1E7 U+1F1F7",
      prefix: 55,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/BR.svg",
    },
    {
      name: "Brunei",
      flag: "bn",
      emoji: "🇧🇳",
      unicode: "U+1F1E7 U+1F1F3",
      prefix: 673,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/BN.svg",
    },
    {
      name: "Bulgaria",
      flag: "bg",
      emoji: "🇧🇬",
      unicode: "U+1F1E7 U+1F1EC",
      prefix: 359,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/BG.svg",
    },
    {
      name: "Burkina Faso",
      flag: "bf",
      emoji: "🇧🇫",
      unicode: "U+1F1E7 U+1F1EB",
      prefix: 226,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/BF.svg",
    },
    {
      name: "Burundi",
      flag: "bi",
      emoji: "🇧🇮",
      unicode: "U+1F1E7 U+1F1EE",
      prefix: 257,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/BI.svg",
    },
    {
      name: "Cabo Verde",
      flag: "cv",
      emoji: "🇨🇻",
      unicode: "U+1F1E8 U+1F1FB",
      prefix: 238,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/CV.svg",
    },
    {
      name: "Cambodia",
      flag: "kh",
      emoji: "🇰🇭",
      unicode: "U+1F1F0 U+1F1ED",
      prefix: 855,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/KH.svg",
    },
    {
      name: "Cameroon",
      flag: "cm",
      emoji: "🇨🇲",
      unicode: "U+1F1E8 U+1F1F2",
      prefix: 237,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/CM.svg",
    },
    {
      name: "Canada",
      flag: "ca",
      emoji: "🇨🇦",
      unicode: "U+1F1E8 U+1F1E6",
      prefix: 1,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/CA.svg",
    },
    {
      name: "Cayman Islands",
      flag: "ky",
      emoji: "🇰🇾",
      unicode: "U+1F1F0 U+1F1FE",
      prefix: 1345,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/KY.svg",
    },
    {
      name: "Central African Republic",
      flag: "cf",
      emoji: "🇨🇫",
      unicode: "U+1F1E8 U+1F1EB",
      prefix: 236,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/CF.svg",
    },
    {
      name: "Chad",
      flag: "td",
      emoji: "🇹🇩",
      unicode: "U+1F1F9 U+1F1E9",
      prefix: 235,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/TD.svg",
    },
    {
      name: "Chile",
      flag: "cl",
      emoji: "🇨🇱",
      unicode: "U+1F1E8 U+1F1F1",
      prefix: 56,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/CL.svg",
    },
    {
      name: "China",
      flag: "cn",
      emoji: "🇨🇳",
      unicode: "U+1F1E8 U+1F1F3",
      prefix: 86,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/CN.svg",
    },
    {
      name: "Colombia",
      flag: "co",
      emoji: "🇨🇴",
      unicode: "U+1F1E8 U+1F1F4",
      prefix: 57,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/CO.svg",
    },
    {
      name: "Comoros",
      flag: "km",
      emoji: "🇰🇲",
      unicode: "U+1F1F0 U+1F1F2",
      prefix: 269,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/KM.svg",
    },
    {
      name: "Congo - Brazzaville",
      flag: "cg",
      emoji: "🇨🇬",
      unicode: "U+1F1E8 U+1F1EC",
      prefix: 242,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/CG.svg",
    },
    {
      name: "Congo - Kinshasa",
      flag: "cd",
      emoji: "🇨🇩",
      unicode: "U+1F1E8 U+1F1E9",
      prefix: 243,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/CD.svg",
    },
    {
      name: "Cook Islands",
      flag: "ck",
      emoji: "🇨🇰",
      unicode: "U+1F1E8 U+1F1F0",
      prefix: 682,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/CK.svg",
    },
    {
      name: "Costa Rica",
      flag: "cr",
      emoji: "🇨🇷",
      unicode: "U+1F1E8 U+1F1F7",
      prefix: 506,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/CR.svg",
    },
    {
      name: "Croatia",
      flag: "hr",
      emoji: "🇭🇷",
      unicode: "U+1F1ED U+1F1F7",
      prefix: 385,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/HR.svg",
    },
    {
      name: "Cuba",
      flag: "cu",
      emoji: "🇨🇺",
      unicode: "U+1F1E8 U+1F1FA",
      prefix: 53,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/CU.svg",
    },
    {
      name: "Curaçao",
      flag: "cw",
      emoji: "🇨🇼",
      unicode: "U+1F1E8 U+1F1FC",
      prefix: 599,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/CW.svg",
    },
    {
      name: "Cyprus",
      flag: "cy",
      emoji: "🇨🇾",
      unicode: "U+1F1E8 U+1F1FE",
      prefix: 357,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/CY.svg",
    },
    {
      name: "Czechia",
      flag: "cz",
      emoji: "🇨🇿",
      unicode: "U+1F1E8 U+1F1FF",
      prefix: 420,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/CZ.svg",
    },
    {
      name: "Côte d’Ivoire",
      flag: "ci",
      emoji: "🇨🇮",
      unicode: "U+1F1E8 U+1F1EE",
      prefix: 225,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/CI.svg",
    },
    {
      name: "Denmark",
      flag: "dk",
      emoji: "🇩🇰",
      unicode: "U+1F1E9 U+1F1F0",
      prefix: 45,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/DK.svg",
    },
    {
      name: "Djibouti",
      flag: "dj",
      emoji: "🇩🇯",
      unicode: "U+1F1E9 U+1F1EF",
      prefix: 253,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/DJ.svg",
    },
    {
      name: "Dominica",
      flag: "dm",
      emoji: "🇩🇲",
      unicode: "U+1F1E9 U+1F1F2",
      prefix: 1767,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/DM.svg",
    },
    {
      name: "Ecuador",
      flag: "ec",
      emoji: "🇪🇨",
      unicode: "U+1F1EA U+1F1E8",
      prefix: 593,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/EC.svg",
    },
    {
      name: "Egypt",
      flag: "eg",
      emoji: "🇪🇬",
      unicode: "U+1F1EA U+1F1EC",
      prefix: 20,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/EG.svg",
    },
    {
      name: "El Salvador",
      flag: "sv",
      emoji: "🇸🇻",
      unicode: "U+1F1F8 U+1F1FB",
      prefix: 503,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/SV.svg",
    },
    {
      name: "Equatorial Guinea",
      flag: "gq",
      emoji: "🇬🇶",
      unicode: "U+1F1EC U+1F1F6",
      prefix: 240,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/GQ.svg",
    },
    {
      name: "Eritrea",
      flag: "er",
      emoji: "🇪🇷",
      unicode: "U+1F1EA U+1F1F7",
      prefix: 291,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/ER.svg",
    },
    {
      name: "Estonia",
      flag: "ee",
      emoji: "🇪🇪",
      unicode: "U+1F1EA U+1F1EA",
      prefix: 372,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/EE.svg",
    },
    {
      name: "Eswatini",
      flag: "sz",
      emoji: "🇸🇿",
      unicode: "U+1F1F8 U+1F1FF",
      prefix: 268,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/SZ.svg",
    },
    {
      name: "Ethiopia",
      flag: "et",
      emoji: "🇪🇹",
      unicode: "U+1F1EA U+1F1F9",
      prefix: 251,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/ET.svg",
    },
    {
      name: "Falkland Islands",
      flag: "fk",
      emoji: "🇫🇰",
      unicode: "U+1F1EB U+1F1F0",
      prefix: 500,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/FK.svg",
    },
    {
      name: "Faroe Islands",
      flag: "fo",
      emoji: "🇫🇴",
      unicode: "U+1F1EB U+1F1F4",
      prefix: 298,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/FO.svg",
    },
    {
      name: "Fiji",
      flag: "fj",
      emoji: "🇫🇯",
      unicode: "U+1F1EB U+1F1EF",
      prefix: 679,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/FJ.svg",
    },
    {
      name: "Finland",
      flag: "fi",
      emoji: "🇫🇮",
      unicode: "U+1F1EB U+1F1EE",
      prefix: 358,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/FI.svg",
    },
    {
      name: "France",
      flag: "fr",
      emoji: "🇫🇷",
      unicode: "U+1F1EB U+1F1F7",
      prefix: 33,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/FR.svg",
    },
    {
      name: "French Guiana",
      flag: "gf",
      emoji: "🇬🇫",
      unicode: "U+1F1EC U+1F1EB",
      prefix: 594,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/GF.svg",
    },
    {
      name: "French Polynesia",
      flag: "pf",
      emoji: "🇵🇫",
      unicode: "U+1F1F5 U+1F1EB",
      prefix: 689,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/PF.svg",
    },
    {
      name: "Gabon",
      flag: "ga",
      emoji: "🇬🇦",
      unicode: "U+1F1EC U+1F1E6",
      prefix: 241,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/GA.svg",
    },
    {
      name: "Gambia",
      flag: "gm",
      emoji: "🇬🇲",
      unicode: "U+1F1EC U+1F1F2",
      prefix: 220,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/GM.svg",
    },
    {
      name: "Georgia",
      flag: "ge",
      emoji: "🇬🇪",
      unicode: "U+1F1EC U+1F1EA",
      prefix: 995,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/GE.svg",
    },
    {
      name: "Germany",
      flag: "de",
      emoji: "🇩🇪",
      unicode: "U+1F1E9 U+1F1EA",
      prefix: 49,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/DE.svg",
    },
    {
      name: "Ghana",
      flag: "gh",
      emoji: "🇬🇭",
      unicode: "U+1F1EC U+1F1ED",
      prefix: 233,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/GH.svg",
    },
    {
      name: "Gibraltar",
      flag: "gi",
      emoji: "🇬🇮",
      unicode: "U+1F1EC U+1F1EE",
      prefix: 350,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/GI.svg",
    },
    {
      name: "Greece",
      flag: "gr",
      emoji: "🇬🇷",
      unicode: "U+1F1EC U+1F1F7",
      prefix: 30,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/GR.svg",
    },
    {
      name: "Greenland",
      flag: "gl",
      emoji: "🇬🇱",
      unicode: "U+1F1EC U+1F1F1",
      prefix: 299,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/GL.svg",
    },
    {
      name: "Grenada",
      flag: "gd",
      emoji: "🇬🇩",
      unicode: "U+1F1EC U+1F1E9",
      prefix: 1473,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/GD.svg",
    },
    {
      name: "Guadeloupe",
      flag: "gp",
      emoji: "🇬🇵",
      unicode: "U+1F1EC U+1F1F5",
      prefix: 590,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/GP.svg",
    },
    {
      name: "Guam",
      flag: "gu",
      emoji: "🇬🇺",
      unicode: "U+1F1EC U+1F1FA",
      prefix: 1671,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/GU.svg",
    },
    {
      name: "Guatemala",
      flag: "gt",
      emoji: "🇬🇹",
      unicode: "U+1F1EC U+1F1F9",
      prefix: 502,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/GT.svg",
    },
    {
      name: "Guernsey",
      flag: "gg",
      emoji: "🇬🇬",
      unicode: "U+1F1EC U+1F1EC",
      prefix: 44,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/GG.svg",
    },
    {
      name: "Guinea",
      flag: "gn",
      emoji: "🇬🇳",
      unicode: "U+1F1EC U+1F1F3",
      prefix: 224,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/GN.svg",
    },
    {
      name: "Guinea-Bissau",
      flag: "gw",
      emoji: "🇬🇼",
      unicode: "U+1F1EC U+1F1FC",
      prefix: 245,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/GW.svg",
    },
    {
      name: "Guyana",
      flag: "gy",
      emoji: "🇬🇾",
      unicode: "U+1F1EC U+1F1FE",
      prefix: 592,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/GY.svg",
    },
    {
      name: "Haiti",
      flag: "ht",
      emoji: "🇭🇹",
      unicode: "U+1F1ED U+1F1F9",
      prefix: 509,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/HT.svg",
    },
    {
      name: "Honduras",
      flag: "hn",
      emoji: "🇭🇳",
      unicode: "U+1F1ED U+1F1F3",
      prefix: 504,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/HN.svg",
    },
    {
      name: "Hong Kong SAR China",
      flag: "hk",
      emoji: "🇭🇰",
      unicode: "U+1F1ED U+1F1F0",
      prefix: 852,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/HK.svg",
    },
    {
      name: "Hungary",
      flag: "hu",
      emoji: "🇭🇺",
      unicode: "U+1F1ED U+1F1FA",
      prefix: 36,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/HU.svg",
    },
    {
      name: "Iceland",
      flag: "is",
      emoji: "🇮🇸",
      unicode: "U+1F1EE U+1F1F8",
      prefix: 354,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/IS.svg",
    },
    {
      name: "India",
      flag: "in",
      emoji: "🇮🇳",
      unicode: "U+1F1EE U+1F1F3",
      prefix: 91,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/IN.svg",
    },
    {
      name: "Indonesia",
      flag: "id",
      emoji: "🇮🇩",
      unicode: "U+1F1EE U+1F1E9",
      prefix: 62,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/ID.svg",
    },
    {
      name: "Iran",
      flag: "ir",
      emoji: "🇮🇷",
      unicode: "U+1F1EE U+1F1F7",
      prefix: 98,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/IR.svg",
    },
    {
      name: "Iraq",
      flag: "iq",
      emoji: "🇮🇶",
      unicode: "U+1F1EE U+1F1F6",
      prefix: 964,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/IQ.svg",
    },
    {
      name: "Ireland",
      flag: "ie",
      emoji: "🇮🇪",
      unicode: "U+1F1EE U+1F1EA",
      prefix: 353,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/IE.svg",
    },
    {
      name: "Isle of Man",
      flag: "im",
      emoji: "🇮🇲",
      unicode: "U+1F1EE U+1F1F2",
      prefix: 44,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/IM.svg",
    },
    {
      name: "Israel",
      flag: "il",
      emoji: "🇮🇱",
      unicode: "U+1F1EE U+1F1F1",
      prefix: 972,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/IL.svg",
    },
    {
      name: "Italy",
      flag: "it",
      emoji: "🇮🇹",
      unicode: "U+1F1EE U+1F1F9",
      prefix: 39,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/IT.svg",
    },
    {
      name: "Japan",
      flag: "jp",
      emoji: "🇯🇵",
      unicode: "U+1F1EF U+1F1F5",
      prefix: 81,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/JP.svg",
    },
    {
      name: "Jersey",
      flag: "je",
      emoji: "🇯🇪",
      unicode: "U+1F1EF U+1F1EA",
      prefix: 44,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/JE.svg",
    },
    {
      name: "Jordan",
      flag: "jo",
      emoji: "🇯🇴",
      unicode: "U+1F1EF U+1F1F4",
      prefix: 962,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/JO.svg",
    },
    {
      name: "Kazakhstan",
      flag: "kz",
      emoji: "🇰🇿",
      unicode: "U+1F1F0 U+1F1FF",
      prefix: 7,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/KZ.svg",
    },
    {
      name: "Kenya",
      flag: "ke",
      emoji: "🇰🇪",
      unicode: "U+1F1F0 U+1F1EA",
      prefix: 254,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/KE.svg",
    },
    {
      name: "Kiribati",
      flag: "ki",
      emoji: "🇰🇮",
      unicode: "U+1F1F0 U+1F1EE",
      prefix: 686,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/KI.svg",
    },
    {
      name: "Kosovo",
      flag: "xk",
      emoji: "🇽🇰",
      unicode: "U+1F1FD U+1F1F0",
      prefix: 383,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/XK.svg",
    },
    {
      name: "Kuwait",
      flag: "kw",
      emoji: "🇰🇼",
      unicode: "U+1F1F0 U+1F1FC",
      prefix: 965,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/KW.svg",
    },
    {
      name: "Kyrgyzstan",
      flag: "kg",
      emoji: "🇰🇬",
      unicode: "U+1F1F0 U+1F1EC",
      prefix: 996,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/KG.svg",
    },
    {
      name: "Laos",
      flag: "la",
      emoji: "🇱🇦",
      unicode: "U+1F1F1 U+1F1E6",
      prefix: 856,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/LA.svg",
    },
    {
      name: "Latvia",
      flag: "lv",
      emoji: "🇱🇻",
      unicode: "U+1F1F1 U+1F1FB",
      prefix: 371,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/LV.svg",
    },
    {
      name: "Lebanon",
      flag: "lb",
      emoji: "🇱🇧",
      unicode: "U+1F1F1 U+1F1E7",
      prefix: 961,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/LB.svg",
    },
    {
      name: "Lesotho",
      flag: "ls",
      emoji: "🇱🇸",
      unicode: "U+1F1F1 U+1F1F8",
      prefix: 266,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/LS.svg",
    },
    {
      name: "Liberia",
      flag: "lr",
      emoji: "🇱🇷",
      unicode: "U+1F1F1 U+1F1F7",
      prefix: 231,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/LR.svg",
    },
    {
      name: "Libya",
      flag: "ly",
      emoji: "🇱🇾",
      unicode: "U+1F1F1 U+1F1FE",
      prefix: 218,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/LY.svg",
    },
    {
      name: "Liechtenstein",
      flag: "li",
      emoji: "🇱🇮",
      unicode: "U+1F1F1 U+1F1EE",
      prefix: 423,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/LI.svg",
    },
    {
      name: "Lithuania",
      flag: "lt",
      emoji: "🇱🇹",
      unicode: "U+1F1F1 U+1F1F9",
      prefix: 370,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/LT.svg",
    },
    {
      name: "Luxembourg",
      flag: "lu",
      emoji: "🇱🇺",
      unicode: "U+1F1F1 U+1F1FA",
      prefix: 352,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/LU.svg",
    },
    {
      name: "Macao SAR China",
      flag: "mo",
      emoji: "🇲🇴",
      unicode: "U+1F1F2 U+1F1F4",
      prefix: 853,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/MO.svg",
    },
    {
      name: "Madagascar",
      flag: "mg",
      emoji: "🇲🇬",
      unicode: "U+1F1F2 U+1F1EC",
      prefix: 261,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/MG.svg",
    },
    {
      name: "Malawi",
      flag: "mw",
      emoji: "🇲🇼",
      unicode: "U+1F1F2 U+1F1FC",
      prefix: 265,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/MW.svg",
    },
    {
      name: "Malaysia",
      flag: "my",
      emoji: "🇲🇾",
      unicode: "U+1F1F2 U+1F1FE",
      prefix: 60,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/MY.svg",
    },
    {
      name: "Maldives",
      flag: "mv",
      emoji: "🇲🇻",
      unicode: "U+1F1F2 U+1F1FB",
      prefix: 960,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/MV.svg",
    },
    {
      name: "Mali",
      flag: "ml",
      emoji: "🇲🇱",
      unicode: "U+1F1F2 U+1F1F1",
      prefix: 223,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/ML.svg",
    },
    {
      name: "Malta",
      flag: "mt",
      emoji: "🇲🇹",
      unicode: "U+1F1F2 U+1F1F9",
      prefix: 356,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/MT.svg",
    },
    {
      name: "Marshall Islands",
      flag: "mh",
      emoji: "🇲🇭",
      unicode: "U+1F1F2 U+1F1ED",
      prefix: 692,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/MH.svg",
    },
    {
      name: "Martinique",
      flag: "mq",
      emoji: "🇲🇶",
      unicode: "U+1F1F2 U+1F1F6",
      prefix: 596,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/MQ.svg",
    },
    {
      name: "Mauritania",
      flag: "mr",
      emoji: "🇲🇷",
      unicode: "U+1F1F2 U+1F1F7",
      prefix: 222,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/MR.svg",
    },
    {
      name: "Mauritius",
      flag: "mu",
      emoji: "🇲🇺",
      unicode: "U+1F1F2 U+1F1FA",
      prefix: 230,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/MU.svg",
    },
    {
      name: "Mayotte",
      flag: "yt",
      emoji: "🇾🇹",
      unicode: "U+1F1FE U+1F1F9",
      prefix: 262,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/YT.svg",
    },
    {
      name: "Mexico",
      flag: "mx",
      emoji: "🇲🇽",
      unicode: "U+1F1F2 U+1F1FD",
      prefix: 52,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/MX.svg",
    },
    {
      name: "Micronesia",
      flag: "fm",
      emoji: "🇫🇲",
      unicode: "U+1F1EB U+1F1F2",
      prefix: 691,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/FM.svg",
    },
    {
      name: "Moldova",
      flag: "md",
      emoji: "🇲🇩",
      unicode: "U+1F1F2 U+1F1E9",
      prefix: 373,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/MD.svg",
    },
    {
      name: "Monaco",
      flag: "mc",
      emoji: "🇲🇨",
      unicode: "U+1F1F2 U+1F1E8",
      prefix: 377,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/MC.svg",
    },
    {
      name: "Mongolia",
      flag: "mn",
      emoji: "🇲🇳",
      unicode: "U+1F1F2 U+1F1F3",
      prefix: 976,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/MN.svg",
    },
    {
      name: "Montenegro",
      flag: "me",
      emoji: "🇲🇪",
      unicode: "U+1F1F2 U+1F1EA",
      prefix: 382,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/ME.svg",
    },
    {
      name: "Morocco",
      flag: "ma",
      emoji: "🇲🇦",
      unicode: "U+1F1F2 U+1F1E6",
      prefix: 212,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/MA.svg",
    },
    {
      name: "Mozambique",
      flag: "mz",
      emoji: "🇲🇿",
      unicode: "U+1F1F2 U+1F1FF",
      prefix: 258,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/MZ.svg",
    },
    {
      name: "Myanmar (Burma)",
      flag: "mn",
      emoji: "🇲🇲",
      unicode: "U+1F1F2 U+1F1F2",
      prefix: 95,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/MM.svg",
    },
    {
      name: "Namibia",
      flag: "na",
      emoji: "🇳🇦",
      unicode: "U+1F1F3 U+1F1E6",
      prefix: 264,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/NA.svg",
    },
    {
      name: "Nauru",
      flag: "nr",
      emoji: "🇳🇷",
      unicode: "U+1F1F3 U+1F1F7",
      prefix: 674,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/NR.svg",
    },
    {
      name: "Nepal",
      flag: "np",
      emoji: "🇳🇵",
      unicode: "U+1F1F3 U+1F1F5",
      prefix: 977,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/NP.svg",
    },
    {
      name: "Netherlands",
      flag: "nl",
      emoji: "🇳🇱",
      unicode: "U+1F1F3 U+1F1F1",
      prefix: 31,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/NL.svg",
    },
    {
      name: "New Caledonia",
      flag: "nc",
      emoji: "🇳🇨",
      unicode: "U+1F1F3 U+1F1E8",
      prefix: 687,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/NC.svg",
    },
    {
      name: "New Zealand",
      flag: "nz",
      emoji: "🇳🇿",
      unicode: "U+1F1F3 U+1F1FF",
      prefix: 64,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/NZ.svg",
    },
    {
      name: "Nicaragua",
      flag: "ni",
      emoji: "🇳🇮",
      unicode: "U+1F1F3 U+1F1EE",
      prefix: 505,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/NI.svg",
    },
    {
      name: "Niger",
      flag: "ne",
      emoji: "🇳🇪",
      unicode: "U+1F1F3 U+1F1EA",
      prefix: 227,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/NE.svg",
    },
    {
      name: "Nigeria",
      flag: "ng",
      emoji: "🇳🇬",
      unicode: "U+1F1F3 U+1F1EC",
      prefix: 234,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/NG.svg",
    },
    {
      name: "Niue",
      flag: "nu",
      emoji: "🇳🇺",
      unicode: "U+1F1F3 U+1F1FA",
      prefix: 683,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/NU.svg",
    },
    {
      name: "Norfolk Island",
      flag: "nf",
      emoji: "🇳🇫",
      unicode: "U+1F1F3 U+1F1EB",
      prefix: 672,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/NF.svg",
    },
    {
      name: "North Korea",
      flag: "kp",
      emoji: "🇰🇵",
      unicode: "U+1F1F0 U+1F1F5",
      prefix: 850,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/KP.svg",
    },
    {
      name: "Norway",
      flag: "no",
      emoji: "🇳🇴",
      unicode: "U+1F1F3 U+1F1F4",
      prefix: 47,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/NO.svg",
    },
    {
      name: "Oman",
      flag: "om",
      emoji: "🇴🇲",
      unicode: "U+1F1F4 U+1F1F2",
      prefix: 968,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/OM.svg",
    },
    {
      name: "Pakistan",
      flag: "pk",
      emoji: "🇵🇰",
      unicode: "U+1F1F5 U+1F1F0",
      prefix: 92,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/PK.svg",
    },
    {
      name: "Palau",
      flag: "pw",
      emoji: "🇵🇼",
      unicode: "U+1F1F5 U+1F1FC",
      prefix: 680,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/PW.svg",
    },
    {
      name: "Palestinian Territories",
      flag: "ps",
      emoji: "🇵🇸",
      unicode: "U+1F1F5 U+1F1F8",
      prefix: 970,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/PS.svg",
    },
    {
      name: "Panama",
      flag: "pa",
      emoji: "🇵🇦",
      unicode: "U+1F1F5 U+1F1E6",
      prefix: 507,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/PA.svg",
    },
    {
      name: "Papua New Guinea",
      flag: "pg",
      emoji: "🇵🇬",
      unicode: "U+1F1F5 U+1F1EC",
      prefix: 675,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/PG.svg",
    },
    {
      name: "Paraguay",
      flag: "py",
      emoji: "🇵🇾",
      unicode: "U+1F1F5 U+1F1FE",
      prefix: 595,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/PY.svg",
    },
    {
      name: "Peru",
      flag: "pe",
      emoji: "🇵🇪",
      unicode: "U+1F1F5 U+1F1EA",
      prefix: 51,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/PE.svg",
    },
    {
      name: "Philippines",
      flag: "ph",
      emoji: "🇵🇭",
      unicode: "U+1F1F5 U+1F1ED",
      prefix: 63,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/PH.svg",
    },
    {
      name: "Pitcairn Islands",
      flag: "pn",
      emoji: "🇵🇳",
      unicode: "U+1F1F5 U+1F1F3",
      prefix: 64,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/PN.svg",
    },
    {
      name: "Poland",
      flag: "pl",
      emoji: "🇵🇱",
      unicode: "U+1F1F5 U+1F1F1",
      prefix: 48,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/PL.svg",
    },
    {
      name: "Portugal",
      flag: "pt",
      emoji: "🇵🇹",
      unicode: "U+1F1F5 U+1F1F9",
      prefix: 351,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/PT.svg",
    },
    {
      name: "Qatar",
      flag: "qa",
      emoji: "🇶🇦",
      unicode: "U+1F1F6 U+1F1E6",
      prefix: 974,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/QA.svg",
    },
    {
      name: "Réunion",
      flag: "re",
      emoji: "🇷🇪",
      unicode: "U+1F1F7 U+1F1EA",
      prefix: 262,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/RE.svg",
    },
    {
      name: "Romania",
      flag: "ro",
      emoji: "🇷🇴",
      unicode: "U+1F1F7 U+1F1F4",
      prefix: 40,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/RO.svg",
    },
    {
      name: "Russia",
      flag: "ru",
      emoji: "🇷🇺",
      unicode: "U+1F1F7 U+1F1FA",
      prefix: 7,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/RU.svg",
    },
    {
      name: "Rwanda",
      flag: "rw",
      emoji: "🇷🇼",
      unicode: "U+1F1F7 U+1F1FC",
      prefix: 250,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/RW.svg",
    },
    {
      name: "Saint Helena",
      flag: "sh",
      emoji: "🇸🇭",
      unicode: "U+1F1F8 U+1F1ED",
      prefix: 290,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/SH.svg",
    },
    {
      name: "Saint Pierre & Miquelon",
      flag: "pm",
      emoji: "🇵🇲",
      unicode: "U+1F1F5 U+1F1F2",
      prefix: 508,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/PM.svg",
    },
    {
      name: "Samoa",
      flag: "ws",
      emoji: "🇼🇸",
      unicode: "U+1F1FC U+1F1F8",
      prefix: 685,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/WS.svg",
    },
    {
      name: "San Marino",
      flag: "sm",
      emoji: "🇸🇲",
      unicode: "U+1F1F8 U+1F1F2",
      prefix: 378,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/SM.svg",
    },
    {
      name: "Sao Tome & Principe",
      flag: "st",
      emoji: "🇸🇹",
      unicode: "U+1F1F8 U+1F1F9",
      prefix: 239,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/ST.svg",
    },
    {
      name: "Saudi Arabia",
      flag: "sa",
      emoji: "🇸🇦",
      unicode: "U+1F1F8 U+1F1E6",
      prefix: 966,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/SA.svg",
    },
    {
      name: "Senegal",
      flag: "sn",
      emoji: "🇸🇳",
      unicode: "U+1F1F8 U+1F1F3",
      prefix: 221,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/SN.svg",
    },
    {
      name: "Serbia",
      flag: "rs",
      emoji: "🇷🇸",
      unicode: "U+1F1F7 U+1F1F8",
      prefix: 381,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/RS.svg",
    },
    {
      name: "Seychelles",
      flag: "sc",
      emoji: "🇸🇨",
      unicode: "U+1F1F8 U+1F1E8",
      prefix: 248,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/SC.svg",
    },
    {
      name: "Sierra Leone",
      flag: "sl",
      emoji: "🇸🇱",
      unicode: "U+1F1F8 U+1F1F1",
      prefix: 232,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/SL.svg",
    },
    {
      name: "Singapore",
      flag: "sg",
      emoji: "🇸🇬",
      unicode: "U+1F1F8 U+1F1EC",
      prefix: 65,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/SG.svg",
    },
    {
      name: "Slovakia",
      flag: "sk",
      emoji: "🇸🇰",
      unicode: "U+1F1F8 U+1F1F0",
      prefix: 421,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/SK.svg",
    },
    {
      name: "Slovenia",
      flag: "si",
      emoji: "🇸🇮",
      unicode: "U+1F1F8 U+1F1EE",
      prefix: 386,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/SI.svg",
    },
    {
      name: "Solomon Islands",
      flag: "sb",
      emoji: "🇸🇧",
      unicode: "U+1F1F8 U+1F1E7",
      prefix: 677,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/SB.svg",
    },
    {
      name: "Somalia",
      flag: "so",
      emoji: "🇸🇴",
      unicode: "U+1F1F8 U+1F1F4",
      prefix: 252,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/SO.svg",
    },
    {
      name: "South Africa",
      flag: "za",
      emoji: "🇿🇦",
      unicode: "U+1F1FF U+1F1E6",
      prefix: 27,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/ZA.svg",
    },
    {
      name: "South Korea",
      flag: "kr",
      emoji: "🇰🇷",
      unicode: "U+1F1F0 U+1F1F7",
      prefix: 82,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/KR.svg",
    },
    {
      name: "South Sudan",
      flag: "ss",
      emoji: "🇸🇸",
      unicode: "U+1F1F8 U+1F1F8",
      prefix: 211,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/SS.svg",
    },
    {
      name: "Spain",
      flag: "es",
      emoji: "🇪🇸",
      unicode: "U+1F1EA U+1F1F8",
      prefix: 34,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/ES.svg",
    },
    {
      name: "Sri Lanka",
      flag: "lk",
      emoji: "🇱🇰",
      unicode: "U+1F1F1 U+1F1F0",
      prefix: 94,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/LK.svg",
    },
    {
      name: "Sudan",
      flag: "sd",
      emoji: "🇸🇩",
      unicode: "U+1F1F8 U+1F1E9",
      prefix: 249,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/SD.svg",
    },
    {
      name: "Suriname",
      flag: "sr",
      emoji: "🇸🇷",
      unicode: "U+1F1F8 U+1F1F7",
      prefix: 597,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/SR.svg",
    },
    {
      name: "Sweden",
      flag: "se",
      emoji: "🇸🇪",
      unicode: "U+1F1F8 U+1F1EA",
      prefix: 46,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/SE.svg",
    },
    {
      name: "Switzerland",
      flag: "ch",
      emoji: "🇨🇭",
      unicode: "U+1F1E8 U+1F1ED",
      prefix: 41,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/CH.svg",
    },
    {
      name: "Syria",
      flag: "sy",
      emoji: "🇸🇾",
      unicode: "U+1F1F8 U+1F1FE",
      prefix: 963,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/SY.svg",
    },
    {
      name: "Taiwan",
      flag: "tw",
      emoji: "🇹🇼",
      unicode: "U+1F1F9 U+1F1FC",
      prefix: 886,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/TW.svg",
    },
    {
      name: "Tajikistan",
      flag: "tj",
      emoji: "🇹🇯",
      unicode: "U+1F1F9 U+1F1EF",
      prefix: 992,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/TJ.svg",
    },
    {
      name: "Tanzania",
      flag: "tz",
      emoji: "🇹🇿",
      unicode: "U+1F1F9 U+1F1FF",
      prefix: 255,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/TZ.svg",
    },
    {
      name: "Thailand",
      flag: "th",
      emoji: "🇹🇭",
      unicode: "U+1F1F9 U+1F1ED",
      prefix: 66,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/TH.svg",
    },
    {
      name: "Timor-Leste",
      flag: "tl",
      emoji: "🇹🇱",
      unicode: "U+1F1F9 U+1F1F1",
      prefix: 670,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/TL.svg",
    },
    {
      name: "Togo",
      flag: "tg",
      emoji: "🇹🇬",
      unicode: "U+1F1F9 U+1F1EC",
      prefix: 228,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/TG.svg",
    },
    {
      name: "Tokelau",
      flag: "tk",
      emoji: "🇹🇰",
      unicode: "U+1F1F9 U+1F1F0",
      prefix: 690,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/TK.svg",
    },
    {
      name: "Tonga",
      flag: "to",
      emoji: "🇹🇴",
      unicode: "U+1F1F9 U+1F1F4",
      prefix: 676,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/TO.svg",
    },
    {
      name: "Tunisia",
      flag: "tn",
      emoji: "🇹🇳",
      unicode: "U+1F1F9 U+1F1F3",
      prefix: 216,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/TN.svg",
    },
    {
      name: "Turkey",
      flag: "tr",
      emoji: "🇹🇷",
      unicode: "U+1F1F9 U+1F1F7",
      prefix: 90,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/TR.svg",
    },
    {
      name: "Turkmenistan",
      flag: "tm",
      emoji: "🇹🇲",
      unicode: "U+1F1F9 U+1F1F2",
      prefix: 993,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/TM.svg",
    },
    {
      name: "Tuvalu",
      flag: "tv",
      emoji: "🇹🇻",
      unicode: "U+1F1F9 U+1F1FB",
      prefix: 688,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/TV.svg",
    },
    {
      name: "Uganda",
      flag: "ug",
      emoji: "🇺🇬",
      unicode: "U+1F1FA U+1F1EC",
      prefix: 256,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/UG.svg",
    },
    {
      name: "Ukraine",
      flag: "ua",
      emoji: "🇺🇦",
      unicode: "U+1F1FA U+1F1E6",
      prefix: 380,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/UA.svg",
    },
    {
      name: "United Arab Emirates",
      flag: "ae",
      emoji: "🇦🇪",
      unicode: "U+1F1E6 U+1F1EA",
      prefix: 971,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/AE.svg",
    },
    {
      name: "United Kingdom",
      flag: "gb",
      emoji: "🇬🇧",
      unicode: "U+1F1EC U+1F1E7",
      prefix: 44,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/GB.svg",
    },
    {
      name: "United States",
      flag: "us",
      emoji: "🇺🇸",
      unicode: "U+1F1FA U+1F1F8",
      prefix: 1,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/US.svg",
    },
    {
      name: "Uruguay",
      flag: "uy",
      emoji: "🇺🇾",
      unicode: "U+1F1FA U+1F1FE",
      prefix: 598,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/UY.svg",
    },
    {
      name: "Uzbekistan",
      flag: "uz",
      emoji: "🇺🇿",
      unicode: "U+1F1FA U+1F1FF",
      prefix: 998,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/UZ.svg",
    },
    {
      name: "Vanuatu",
      flag: "vu",
      emoji: "🇻🇺",
      unicode: "U+1F1FB U+1F1FA",
      prefix: 678,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/VU.svg",
    },
    {
      name: "Vatican City",
      flag: "va",
      emoji: "🇻🇦",
      unicode: "U+1F1FB U+1F1E6",
      prefix: 379,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/VA.svg",
    },
    {
      name: "Venezuela",
      flag: "ve",
      emoji: "🇻🇪",
      unicode: "U+1F1FB U+1F1EA",
      prefix: 58,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/VE.svg",
    },
    {
      name: "vietnam",
      flag: "vn",
      emoji: "🇻🇳",
      unicode: "U+1F1FB U+1F1F3",
      prefix: 84,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/VN.svg",
    },
    {
      name: "Wallis & Futuna",
      flag: "wf",
      emoji: "🇼🇫",
      unicode: "U+1F1FC U+1F1EB",
      prefix: 681,
      image:
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/WF.svg",
    },
  ];

  // Suponiendo que 'countries' y 'newEditedData' ya están definidos

  // Suponiendo que 'countries' y 'newEditedData' ya están definidos

  function initializeDropdowns() {
    var nationalityDropdown = document.getElementById("nationalityDropdown");
    var residenceDropdown = document.getElementById("residenceDropdown");

    countries.forEach(function (country) {
      var optionNationality = document.createElement("option");
      var optionResidence = document.createElement("option");

      optionNationality.value = optionResidence.value = country.flag;
      optionNationality.textContent = optionResidence.textContent =
        country.emoji + " " + country.name;

      nationalityDropdown.appendChild(optionNationality);
      residenceDropdown.appendChild(optionResidence);

      // Seleccionar el país por defecto para nacionalidad y residencia
      if (country.flag === newEditedData.userNationality) {
        nationalityDropdown.value = country.flag;
      }
      if (country.flag === newEditedData.userResidence) {
        residenceDropdown.value = country.flag;
      }
    });
  }

  function onCountryChange(event) {
    var selectedDropdown = event.target;
    var selectedFlag = selectedDropdown.value;

    if (selectedDropdown.id === "nationalityDropdown") {
      // Actualizar userNationality con el flag seleccionado
      newEditedData.userNationality = selectedFlag;
      console.log("Nueva nacionalidad seleccionada:", selectedFlag);
    } else if (selectedDropdown.id === "residenceDropdown") {
      // Sobrescribir userResidence con el flag seleccionado
      newEditedData.userResidence = selectedFlag;
      console.log("Nuevo userResidence:", selectedFlag);
    }
  }

  // Inicializar ambos dropdowns
  initializeDropdowns();

  // Asignar el mismo manejador de eventos para ambos dropdowns
  document
    .getElementById("nationalityDropdown")
    .addEventListener("change", onCountryChange);
  document
    .getElementById("residenceDropdown")
    .addEventListener("change", onCountryChange);

  // ---------------------------------------------------------------------------- Languages

  function mapLanguages(element) {
    switch (element) {
      default:
        return element; // Devuelve el mismo valor si no hay traducción
    }
  }
  dataSelectMultiple(
    "data-language",
    newEditedData.userLanguages,
    dataLanguage,
    mapLanguages,
    (newValue) => updateProperty(newValue, "userLanguages")
  );

  // ---------------------------------------------------------------------------- AdminState

  function mapAdminState(element) {
    switch (element) {
      case "searching":
        return "S";
      case "2o3":
        return "2 - 3";
      case "one":
        return "1";
      case "now":
        return "inmediata";
      // Agrega más casos según tus necesidades
      default:
        return element; // Devuelve el mismo valor si no hay traducción
    }
  }
  dataSelectOneAdmin(
    "data-adminstate",
    newEditedData.userAdminState,
    dataAdminState,
    mapAdminState,
    (newValue) => updateProperty(newValue, "userAdminState")
  );

  // ---------------------------------------------------------------------------- AdminType

  function mapAdminType(element) {
    switch (element) {
      case "searching":
        return "S";
      case "2o3":
        return "2 - 3";
      case "one":
        return "1";
      case "now":
        return "inmediata";
      // Agrega más casos según tus necesidades
      default:
        return element; // Devuelve el mismo valor si no hay traducción
    }
  }
  dataSelectOneAdmin(
    "data-admintype",
    newEditedData.userAdminType,
    dataAdminType,
    mapAdminType,
    (newValue) => updateProperty(newValue, "userAdminType")
  );

  // ---------------------------------------------------------------------------- Sports

  var otherOptionSport = document.querySelector("[data-other-sport]");

  if (!(newEditedData.userAdditionalSport === "")) {
    otherOptionSport.value = newEditedData.userAdditionalSport;
    otherOptionSport.style.display = "flex";
  }

  otherOptionSport.addEventListener("input", () => {
    newEditedData.userAdditionalSport = otherOptionSport.value;

    if (!(newEditedData.userAdditionalSport === "")) {
      otherOptionSport.value = newEditedData.userAdditionalSport;
      otherOptionSport.style.display = "flex";
    }
  });

  function mapSport(data) {
    switch (data) {
      case "tenis":
        return "tenis";
      case "padel":
        return "padel";
      case "pickleball":
        return "pickleball";
      default:
        return data; // Devuelve el mismo valor si no hay traducción
    }
  }
  dataSelectMultiple(
    "data-sport",
    newEditedData.userSports,
    dataSports,
    mapSport
  );

  // ---------------------------------------------------------------------------- Experience
  function mapExp(data) {
    switch (data) {
      case "two-or-less":
        return "&lt; 2";
      case "two-to-five":
        return "2 - 5";
      case "five-to-ten":
        return "5 - 10";
      case "ten-or-more":
        return "> 10";
      case "professional player":
        return "jugador profesional";
      // Agrega más casos según tus necesidades
      default:
        return data; // Devuelve el mismo valor si no hay traducción
    }
  }
  dataSelectOne(
    "data-experience",
    newEditedData.userExperience,
    dataExp,
    mapExp,
    (newValue) => updateProperty(newValue, "userExperience")
  );

  // ---------------------------------------------------------------------------- Additional experience
  dataSelectOne(
    "data-experience-additional-option",
    newEditedData.userAdditionalExperience,
    dataExp,
    mapExp,
    (newValue) => updateProperty(newValue, "userAdditionalExperience")
  );

  // ---------------------------------------------------------------------------- Weekly hours
  function mapWeekly(data) {
    switch (data) {
      case "0010":
        return "&lt; 10h";
      case "1020":
        return "10 - 20h";
      case "2030":
        return "20 - 30h";
      case "30mo":
        return "> 30h";
      case "professional player":
        return "jugador profesional";
      // Agrega más casos según tus necesidades
      default:
        return data; // Devuelve el mismo valor si no hay traducción
    }
  }
  dataWeeklyhours.innerHTML = mapWeekly(newEditedData.userWeeklyHours);

  dataSelectOne(
    "data-hours",
    newEditedData.userWeeklyHours,
    dataWeeklyhours,
    mapWeekly,
    (newValue) => updateProperty(newValue, "userWeeklyHours")
  );

  // ---------------------------------------------------------------------------- Alumni Profile
  function mapLevel(element) {
    switch (element) {
      case "initiation":
        return "iniciación";
      case "intermed":
        return "intermedio";
      case "advanced":
        return "avanzado";
      case "profesional":
        return "profesional";
      // Agrega más casos según tus necesidades
      default:
        return element; // Devuelve el mismo valor si no hay traducción
    }
  }
  dataSelectMultiple(
    "data-level",
    newEditedData.userPreferredLevel,
    dataAlumn,
    mapLevel
  );

  // ---------------------------------------------------------------------------- Alumni Profile
  dataSelectMultiple(
    "data-studentsage",
    newEditedData.userStudentsAge,
    dataAlumnAge,
    mapLevel
  );

  // ---------------------------------------------------------------------------- Availability
  function mapAvailability(element) {
    switch (element) {
      case "4mo":
        return "> 4";
      case "2o3":
        return "2 - 3";
      case "one":
        return "1";
      case "now":
        return "inmediata";
      case "von":
        return "verano / navidad";
      // Agrega más casos según tus necesidades
      default:
        return element; // Devuelve el mismo valor si no hay traducción
    }
  }
  dataSelectOne(
    "data-startingtime",
    newEditedData.userAvailability,
    dataAvailability,
    mapAvailability,
    (newValue) => updateProperty(newValue, "userAvailability")
  );

  // ---------------------------------------------------------------------------- Mobility
  function mapContinents(element) {
    switch (element) {
      case "europe":
        return "europa";
      case "america":
        return "resto de america";
      case "usa":
        return "estados unidos";
      case "asia":
        return "asia";
      case "africa":
        return "áfrica";
      case "oceania":
        return "oceanía";
      default:
        return continente;
    }
  }
  dataSelectMultiple(
    "data-mobility",
    newEditedData.userMobilityContinents,
    dataMobility,
    mapContinents
  );

  // ---------------------------------------------------------------------------- Oportunity
  function mapOportunity(element) {
    switch (element) {
      case "full":
        return "full time";
      case "part":
        return "part time";
      case "temp":
        return "temporal";
      case "esp":
        return "esporádico";
      // Agrega más casos según tus necesidades
      default:
        return element; // Devuelve el mismo valor si no hay traducción
    }
  }
  dataSelectMultiple(
    "data-oportunity",
    newEditedData.userOportunityType,
    dataOportunity,
    mapOportunity
  );

  // ---------------------------------------------------------------------------- Salary
  function mapSalary(nivel) {
    switch (nivel) {
      case "0000":
        return "sin especificar";
      case "0001":
        return "&#60; 1k";
      case "0102":
        return "1k - 2k";
      case "0203":
        return "2k - 3k";
      case "0304":
        return "3k - 4k";
      case "0499":
        return "> 4k";
      // Agrega más casos según tus necesidades
      default:
        return nivel; // Devuelve el mismo valor si no hay traducción
    }
  }
  dataSelectOne(
    "data-salary",
    newEditedData.userExpectedSalary,
    dataRange,
    mapSalary,
    (newValue) => updateProperty(newValue, "userExpectedSalary")
  );

  // alert(newEditedData.userExpectedSalary)

  // ---------------------------------------------------------------------------- Recommendator
  function casesRecommendator(data) {
    switch (data) {
      case "no":
        return "No";
      case "diego-ortiz":
        return "Diego Ortiz";
      case "javier-marti":
        return "Javier Martí";
      case "miguel-semmler":
        return "Miguel Semmler";
      case "adriana-armenadriz":
        return "Adriana Armendariz";
      case "diego-ortiz":
        return "Diego Ortiz";
      case "alejandro-crespo":
        return "Alejandro Crespo";
      case "sergi-perez":
        return "Sergi Pérez";
      case "laura-marti":
        return "Laura Martí";
      case "global-college":
        return "Global College";
      case "pablo-franco":
        return "Pablo Franco";
      case "sergio-cerdeña":
        return "Sergio Cerdeña";
      case "iñigo-jofre":
        return "Iñigo Jofre";
      case "pablo-aycart":
        return "Pablo Aycart";
      case "radu-sanchez":
        return "Radu Sanchez";
      // Agrega más casos según tus necesidades
      default:
        return data; // Devuelve el mismo valor si no hay traducción
    }
  }
  dataSelectOne(
    "data-recommendator",
    newEditedData.userRecommendation,
    dataRecommendator,
    casesRecommendator,
    (newValue) => updateProperty(newValue, "userRecommendation")
  );

  // // // // // // // // // // // // // // // // // // // // // // // // // // - EDITABLE EXP

  // Función que devuelve el valor actualizado de queryVariable
  var expToggleSelection = (
    queryVariable,
    documentElement,
    newDataCallback
  ) => {
    queryVariable === "y" ? documentElement.classList.add("marked") : "";

    documentElement.addEventListener("click", () => {
      if (documentElement.classList.contains("editable")) {
        documentElement.classList.toggle("marked");
        queryVariable = documentElement.classList.contains("marked")
          ? "y"
          : "n";
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
  expToggleSelection(newEditedData.userClubExp, dataWorkedForClub, (newValue) =>
    updateNewEditedData(newValue, "userClubExp")
  );

  // ---------------------------------------------------------------------------- Other Coach Exp
  expToggleSelection(
    newEditedData.userOtherCoachExp,
    dataCoordinated,
    (newValue) => updateNewEditedData(newValue, "userOtherCoachExp")
  );

  // ---------------------------------------------------------------------------- Tournaments Organized
  expToggleSelection(
    newEditedData.userToursOrganized,
    dataTournaments,
    (newValue) => updateNewEditedData(newValue, "userToursOrganized")
  );

  // ---------------------------------------------------------------------------- Tours Juzge
  expToggleSelection(
    newEditedData.userProfessionalExp,
    dataProfesional,
    (newValue) => updateNewEditedData(newValue, "userProfessionalExp")
  );

  expToggleSelection(newEditedData.userToursJuzge, dataJudge, (newValue) =>
    updateNewEditedData(newValue, "userToursJuzge")
  );

  // ---------------------------------------------------------------------------- International Exp
  expToggleSelection(
    newEditedData.userInternationalExp,
    dataInternational,
    (newValue) => updateNewEditedData(newValue, "userInternationalExp")
  );

  // ---------------------------------------------------------------------------- Compiting Now
  expToggleSelection(
    newEditedData.userCompetingNow,
    dataCompiting,
    (newValue) => updateNewEditedData(newValue, "userCompetingNow")
  );

  //#region (l) text boxes

  // ---------------------------------------------------------------------------- Additional Info

  var textArea = document.getElementById("multilineInput");

  textArea.value = newEditedData.userAdditionalInfo;

  textArea.addEventListener("input", autoResize, false);

  function autoResize() {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
  }

  textArea.addEventListener("change", () => {
    newEditedData.userAdditionalInfo = textArea.value;
  });

  // ---------------------------------------------------------------------------- Admin Note

  var adminNoteArea = document.getElementById("adminNoteMultilineInput");

  adminNoteArea.value = newEditedData.userAdminNote;

  adminNoteArea.addEventListener("input", autoResize, false);

  adminNoteArea.addEventListener("change", () => {
    newEditedData.userAdminNote = adminNoteArea.value;
    // updateChanges()
  });

  //#endregion

  //#region (l) logout
};

//#endregion

//#region (l) profilePicture

var image = document.getElementById("output");
var imageContainer = document.getElementById("image-container");
var label = document.querySelector("#profile-image-label");
var profilePicLoading = document.querySelector("#profile-pic-loading");

imageContainer.addEventListener("click", (e) => {
  profilePicture.click();
});

profilePicture.addEventListener("change", (e) => {
  loadFile(e);
});

var setSettedImageStyling = (url) => {
  imageContainer.classList.add("image-set");
  imageContainer.classList.remove("loading-state");
  label.innerHTML = "Modifica la <br> foto de perfil";
};

var convertImageToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const base64String = reader.result.split(",")[1]; // Extraer solo la parte base64 de la URL de datos
      resolve(base64String);
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(file);
  });
};

var loadFile = (event) => {
  const reader = new FileReader();

  profilePicLoading.style.visibility = "visible";
  imageContainer.classList.add("loading-state");

  profilePicLoading.style.visibility = "hidden";

  image.src = URL.createObjectURL(event.target.files[0]);
  const base64String = convertImageToBase64(event.target.files[0]).then(
    (result) => {
      console.log(result);

      firebaseUpdateProfilePicture(result, `profilePicUserId=${userId}`).then(
        () => {
          setSettedImageStyling();
        }
      );
    }
  );
};

firebaseGetProfilePicture(userId)
  .then((url) => {
    image.src = url;
    setSettedImageStyling();
  })
  .catch((e) => {
    console.log(e);
  });
//#endregion

//#region (l) manage file uploading and downloading

const eraseDocument = document.querySelector(".erase-offer");

eraseDocument.addEventListener("click", () => {
  firebaseRemoveJobOffer(userId).then(() => {
    jobOfferButton.value = "";
    console.log("asjdoasjdos");
    downloadLinksLabel.classList.remove("download-available");
    eraseDocument.classList.remove("download-available");
    jobOfferButtonLabel.style.display = "flex";
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

firebaseGetJobOffer(userId).then((url) => {
  downloadLinksLabel.href = url;
  downloadLinksLabel.download = extraerNombreArchivo(url);
  downloadLinksLabel.innerHTML = `Descarga <svg xmlns="http://www.w3.org/2000/svg" style="margin-left: 1rem" width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M21 21H3M18 11L12 17M12 17L6 11M12 17V3" stroke="#025B7B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg`;
  jobOfferButtonLabel.style.display = "none";
  downloadLinksLabel.classList.add("download-available");
  eraseDocument.classList.add("download-available");
});

firebaseGetProfilePicture(userId)
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
  jobOfferButtonLabel.style.display = "none";

  firebaseUploadDocument(file, `profileDocument=${userId}.pdf`);
});

//#endregion

//#region (l) manage video uploading and downloading

const eraseVideo = document.querySelector(".erase-video");

eraseVideo.addEventListener("click", () => {
  firebaseRemoveVideo(userId).then(() => {
    jobVideoButton.value = "";
    downloadVideoLinksLabel.classList.remove("download-available");
    eraseVideo.classList.remove("download-available");
    jobVideoButtonLabel.style.display = "flex";
  });
});

const downloadVideoLinksLabel = document.querySelector(
  ".downloadVideoLink-wording"
);
const jobVideoButton = document.querySelector("#job-video");
const jobVideoButtonLabel = document.querySelector("#job-video-label");

firebaseGetVideo(userId).then((url) => {
  downloadVideoLinksLabel.href = url;
  downloadVideoLinksLabel.download = extraerNombreArchivo(url);
  downloadVideoLinksLabel.innerHTML = `Descarga <svg xmlns="http://www.w3.org/2000/svg" style="margin-left: 1rem" width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M21 21H3M18 11L12 17M12 17L6 11M12 17V3" stroke="#025B7B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg`;
  jobVideoButtonLabel.style.display = "none";
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
  jobVideoButtonLabel.style.display = "none";

  firebaseUploadDocument(file, `profileDocument=${userId}.mp4`);
});

//#endregion

logoutButton.addEventListener("click", () => {
  firebaseLogout();
});

//#endregion

//Store variable to navigate to FAQS
const faqsLink = document.querySelector(".Faqs-link");
faqsLink.addEventListener("click", () => {
  localStorage.setItem("seeFaqs", "yes");
});
