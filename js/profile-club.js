import { firebaseFetchUserDataById } from "./profile-club-firebase.js";
import { firebaseUpdateProfilePicture } from "./profile-club-firebase.js";
import { firebaseGetProfilePicture } from "./profile-club-firebase.js";
import { firebaseGetJobOffer } from "./profile-club-firebase.js";
import { firebaseUploadDocument } from "./profile-club-firebase.js";
import { firebaseUpdateUserData } from "./profile-club-firebase.js";
import { firebaseRemoveJobOffer } from "./profile-club-firebase.js";
import { firebaseLogout } from "./firebase-auth-checker.js";
import { checkIfUserAdmin } from "./adminlist.js";

const dataElement = document.querySelectorAll(".profile-data");
const dataElementExp = document.querySelectorAll(".profile-exp");

const nombreCookie = "loggedUser";
const nombreCookieId = "loggedUserId";
const valorCookieId = getCookie(nombreCookieId);

const params = new URLSearchParams(window.location.search);
const userId = params.get("id");

const pageLoader = document.querySelector("#page-loader");
const body = document.querySelector("body");

var logoutButton = document.querySelector("#logout-button");

var editableOptions = document.querySelectorAll(".editable-option");
var editableTexts = document.querySelectorAll(".editable-text");

var newEditedData;

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
var profileLabel = document.getElementById("profile-image-label");

//#endregion

//#region newregion

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

  actionsWrapper.style.right = "100%";
};

editButton.addEventListener("click", () => {
  setEditableStyles();
  makeAllFieldsEditable();
});

saveButton.addEventListener("click", () => {
  setLoading();

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
};
var unMakeAllFieldsEditable = () => {
  dataElement.forEach((element) => {
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

//#region (f) writeData functions 

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
  documentElement.innerHTML = mappingFunction(queryVariable);

  // Manage edition
  selectorAllOptions.forEach((element) => {
    element.addEventListener("click", () => {
      const newQueryVariable = element.getAttribute(`${optionsAttribute}`);
      updateQueryVariable(newQueryVariable); // Llamada a la función de actualización externa

      documentElement.innerHTML = mappingFunction(newQueryVariable);

      selectorAllOptions.forEach((elem) => {
        elem.classList.remove("selected");
      });
      element.classList.add("selected");
    });
  });
};

function updateProperty(newValue, propertyKey) {
  if (newEditedData.hasOwnProperty(propertyKey)) {
    newEditedData[propertyKey] = newValue;
    // Aquí podrías realizar otras acciones relacionadas con newEditedData si es necesario
  } else {
    console.error(`Property ${propertyKey} does not exist in newEditedData.`);
  }
}

//#endregion

//#region (l) writeData

var fillDataInDocument = (data) => {
  newEditedData = data;

  newEditedData.clubAdditionalInfo = newEditedData.clubAdditionalInfo || "";
  newEditedData.clubAdminNote = newEditedData.clubAdminNote || "";

  var dataEmail = document.querySelector("#data-email");
  var dataNumber = document.querySelector("#data-number");
  var dataName = document.querySelector("#profile-element-container-name");
  var dataRecommendator = document.querySelector("#data-recommendator");
  var dataResidence = document.querySelector("#data-residence");
  var dataWeb = document.querySelector("#data-web");

  function formatearURL(url) {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      if (url.startsWith("www.")) {
        url = "http://" + url;
      } else {
        url = "http://" + url;
      }
    }
    return url;
  }

  // ---------------------------------------------------------------------------- Name
  dataName.innerHTML = newEditedData.clubName;

  // ---------------------------------------------------------------------------- Web
  if (newEditedData.clubWebPage === "") {
    dataWeb.parentNode.style.display = "none";
  } else if (newEditedData.clubWebPage.length <= 30) {
    dataWeb.innerHTML = newEditedData.clubWebPage;
    dataWeb.parentNode.href = formatearURL(newEditedData.clubWebPage);
  } else {
    dataWeb.innerHTML = `${newEditedData.clubWebPage.substring(0, 30)}...`;
    dataWeb.parentNode.href = formatearURL(newEditedData.clubWebPage);
  }
  // ---------------------------------------------------------------------------- Email
  dataEmail.innerHTML = newEditedData.clubEmail;

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
    newEditedData.clubRecommendation,
    dataRecommendator,
    casesRecommendator,
    (newValue) => updateProperty(newValue, "userRecommendation")
  );

  if (newEditedData.clubRecommendation === 'no') {
    document.querySelector('#recommendator-row').style.display = 'none'
  }

  // ---------------------------------------------------------------------------- Number
  dataNumber.innerHTML = newEditedData.clubNumber;
  function mapCountry(code) {
    const countryCodes = {
      at: "Austria",
      be: "Bélgica",
      bg: "Bulgaria",
      hr: "Croacia",
      cy: "Chipre",
      cz: "República Checa",
      dk: "Dinamarca",
      ee: "Estonia",
      fi: "Finlandia",
      fr: "Francia",
      de: "Alemania",
      gr: "Grecia",
      hu: "Hungría",
      is: "Islandia",
      ie: "República de Irlanda",
      it: "Italia",
      lv: "Letonia",
      li: "Liechtenstein",
      lt: "Lituania",
      lu: "Luxemburgo",
      mt: "Malta",
      nl: "Países Bajos",
      no: "Noruega",
      pl: "Polonia",
      pt: "Portugal",
      ro: "Rumania",
      sk: "Eslovaquia",
      si: "Eslovenia",
      es: "España",
      se: "Suecia",
    };

    // Verificar si el código de país existe en el mapa
    if (countryCodes.hasOwnProperty(code)) {
      return countryCodes[code]; // Devuelve el nombre del país correspondiente
    } else {
      return "País no especificado"; // O un mensaje predeterminado para códigos no encontrados
    }
  }
  var country = mapCountry(newEditedData.clubCountry);
  dataResidence.innerHTML = `${newEditedData.clubCity}, ${country} `;

// ---------------------------------------------------------------------------- Sports
var dataSports = document.querySelectorAll("[data-sport]");
var dataOtherSport = document.querySelector("[data-other-sport]");

dataSports.forEach((element) => {
  // Marcar como seleccionados los deportes ya guardados
  if (newEditedData.clubSports.includes(element.getAttribute("data-sport"))) {
    element.classList.add("selected");
  }

  // Evento click para seleccionar/deseleccionar deportes
  element.addEventListener("click", () => {
    if (element.classList.contains("editable")) {
      element.classList.toggle("selected");
      updateSelectedSports();
    }
  });
});

// Actualizar la lista de deportes seleccionados
function updateSelectedSports() {
  newEditedData.clubSports = Array.from(dataSports)
    .filter(element => element.classList.contains("selected"))
    .map(element => element.getAttribute("data-sport"));
}

// Evento input para el campo 'Otro deporte'
dataOtherSport.addEventListener("input", () => {
  if (dataOtherSport.value !== "") {
    dataOtherSport.classList.add("selected");
    newEditedData.clubAdditionalSport = dataOtherSport.value;
  } else {
    dataOtherSport.classList.remove("selected");
    newEditedData.clubAdditionalSport = "";
  }
});

// Inicializar el campo 'Otro deporte' con el valor actual
if (newEditedData.clubAdditionalSport && newEditedData.clubAdditionalSport !== "") {
  dataOtherSport.value = newEditedData.clubAdditionalSport;
  dataOtherSport.classList.add("selected");
}



  // ---------------------------------------------------------------------------- Fields
  var dataFields = document.querySelectorAll("[data-fields]");
  dataFields.forEach((element) => {
    if (element.getAttribute("data-fields") === newEditedData.clubField) {
      element.classList.add("selected");
    }
    element.addEventListener("click", () => {
      dataFields.forEach((element) => {
        element.classList.remove("selected");
      });
      element.classList.add("selected");
      newEditedData.clubField = element.getAttribute("data-fields");

      // updateChanges()
    });
  });

  // ---------------------------------------------------------------------------- Coaches Search
  var dataCoaches = document.querySelectorAll("[data-state]");
  dataCoaches.forEach((element) => {
    if (element.getAttribute("data-state") === newEditedData.clubState) {
      element.classList.add("selected");
    }
    element.addEventListener("click", () => {
      dataCoaches.forEach((element) => {
        element.classList.remove("selected");
      });
      element.classList.add("selected");
      newEditedData.clubState = element.getAttribute("data-state");
      // updateChanges()
    });
  });

  // ---------------------------------------------------------------------------- Consulting
  var dataConsulting = document.querySelectorAll("[data-consulting]");
  dataConsulting.forEach((element) => {
    if (
      element.getAttribute("data-consulting") === newEditedData.clubConsulting
    ) {
      element.classList.add("selected");
    }
    element.addEventListener("click", () => {
      dataConsulting.forEach((element) => {
        element.classList.remove("selected");
      });
      element.classList.add("selected");
      newEditedData.clubConsulting = element.getAttribute("data-consulting");
      // updateChanges()
    });
  });

  // ---------------------------------------------------------------------------- Additional Info

  var textArea = document.getElementById("multilineInput");

  textArea.value = newEditedData.clubAdditionalInfo;

  textArea.addEventListener("input", autoResize, false);

  function autoResize() {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
  }

  textArea.addEventListener("blur", () => {
    newEditedData.clubAdditionalInfo = textArea.value;
  });

  // ---------------------------------------------------------------------------- Admin Note

  var adminNoteArea = document.getElementById("adminNoteMultilineInput");

  adminNoteArea.value = newEditedData.clubAdminNote;

  adminNoteArea.addEventListener("input", autoResize, false);

  adminNoteArea.addEventListener("blur", () => {
    newEditedData.clubAdminNote = adminNoteArea.value;
    // updateChanges()
  });
};

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

const downloadLink = document.querySelector("#downloadLink");
const downloadLinksLabel = document.querySelector(".downloadLink-wording");
const jobOfferButton = document.querySelector("#job-offer");
const jobOfferButtonLabel = document.querySelector("#job-offer-label");
const tellUsMoreContainer = document.querySelector("#tellusmore-container");
const adminNoteContainer = document.querySelector("#adminnote-container");

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

//#region (l) checkIfUserIsAllowed

var isUserAllowed = () => {
  const params = new URLSearchParams(window.location.search);

  if (params.has("id")) {
    if (params.get("id") === valorCookieId || checkIfUserAdmin(valorCookieId)) {
      firebaseFetchUserDataById(userId)
        .then((userData) => {
          // fillDataInPage()
          pageLoader.style.display = "none";
          logoutButton.style.display = "flex";
          body.style.overflowY = "visible";
          fillDataInDocument(userData);
        })
        .catch();
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
var label = document.querySelector("#profile-image-label");
var profilePicLoading = document.querySelector("#profile-pic-loading");

imageContainer.addEventListener("click", (e) => {
  profilePicture.click();
});

profilePicture.addEventListener("change", (e) => {
  loadFile(e);
});

var setSettedImageStyling = (url) => {
  image.style.border = "4px solid white";
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
      firebaseUpdateProfilePicture(
        result,
        `profilePicUserId=${userId}.png`
      ).then(() => {
        setSettedImageStyling();
      });
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

//#region (l) logout

logoutButton.addEventListener("click", () => {
  firebaseLogout();
});

//#endregion

//Store variable to navigate to FAQS
const faqsLink = document.querySelector('.Faqs-link')
faqsLink.addEventListener('click', ()=>{
    localStorage.setItem('seeFaqs', 'yes');
})
