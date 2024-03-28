import { firebaseQueryTableCoach } from "./coaches-table-firebase.js";
import { checkIfUserAdmin } from "./adminlist.js";

var arrayOfResults = [];

var referenceRow = document.querySelector("#referenceRow");

//#region checkIfAdmin

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
const nombreCookieId = "loggedUserId";
const valorCookieId = getCookie(nombreCookieId);
// console.log(checkIfUserAdmin(valorCookieId))

checkIfUserAdmin(valorCookieId) ? "ok" : (window.location.href = "404");

//#endregion

//#region (f) queryFirebase

var searchApplied = (arrayOfResults, currentString) => {
  console.log(arrayOfResults);
  var previousElementsToDelete = document.querySelectorAll(".deletable");

  previousElementsToDelete.forEach((element) => {
    element.parentNode.removeChild(element);
  });

  arrayOfResults.forEach((element) => {
    // console.log(element);
    if (checkName(element.userName, element.userSurname, currentString)) {
      injectElement(element);
      console.log('ok')
    }
  });
};

function normalizeString(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function checkName(firstName, lastName, searchString) {
  // Normalizar y convertir a minúsculas el nombre completo y la cadena de búsqueda
  var fullNameNormalized = normalizeString(firstName + " " + lastName);
  var searchStringNormalized = normalizeString(searchString);

  // Comprueba si la cadena de búsqueda normalizada está contenida en el nombre completo normalizado
  return fullNameNormalized.includes(searchStringNormalized);
}

function compareDates(doc1, doc2) {
  let date1 = new Date(doc1.registerDate);
  let date2 = new Date(doc2.registerDate);

  // console.log(date1 - date2);
  return date1 - date2;
}

document
  .querySelector("#search-input-text")
  .addEventListener("input", function (event) {
    var currentString = event.target.value;
    searchApplied(arrayOfResults, currentString);
  });

var filteringApplied = (arrayOfResults) => {
  var previousElementsToDelete = document.querySelectorAll(".deletable");

  previousElementsToDelete.forEach((element) => {
    element.parentNode.removeChild(element);
  });

  arrayOfResults.forEach((element) => {
    if (checkFilters(element, queryData)) {
      injectElement(element);
    }
  });
};

var endOfCollectionReached = false;

var queryFirebase = (queryData, minDocuments = 100) => {
  // Si ya hemos alcanzado el final de la colección, retornar temprano.
  if (endOfCollectionReached) {
    console.log("No more documents to fetch. End of collection reached.");
    return;
  }

  firebaseQueryTableCoach(queryData)
    .then((result) => {
      let countValidDocuments = 0;

      if (result.documents.length > 0) {
        result.documents.forEach((element) => {
          arrayOfResults.push(element);
          if (checkFilters(element, queryData)) {
            injectElement(element);
            countValidDocuments++;
          }
        });
        console.log(arrayOfResults);
      }

      arrayOfResults.sort(compareDates);
      filteringApplied(arrayOfResults);

      if (!result.endOfCollection && countValidDocuments < minDocuments) {
        console.log(`Número de documentos válidos (${countValidDocuments}) es menor que el mínimo requerido (${minDocuments}). Relanzando la consulta...`);
        queryFirebase(queryData, minDocuments);
      } else if (result.endOfCollection) {
        console.log("No more documents to fetch. End of collection reached.");
        endOfCollectionReached = true; // Actualizamos la variable indicando que hemos llegado al final.
      }
    })
    .catch((error) => {
      console.error("Error al recuperar documentos:", error);
    });
};

//#endregion

//#region (l) downloadData

var downloadData = document.querySelector("#download-data");

downloadData.addEventListener("click", () => {
  // Convertir el objeto a un formato CSV
  let csvContent = "data:text/csv;charset=utf-8,";

  // Obtener las claves del primer objeto para los encabezados
  const headers = Object.keys(arrayOfResults[0]);
  csvContent += headers.join(",") + "\r\n"; // Añadir encabezados

  arrayOfResults.forEach((obj) => {
    let row = headers.map((header) => {
      let value = obj[header];
      if (Array.isArray(value)) {
        return '"' + value.join(" ") + '"'; // Entre comillas para manejar valores con comas
      } else {
        return value;
      }
    });
    csvContent += row.join(",") + "\r\n";
  });

  // Codificar el contenido CSV para que sea un URI
  const encodedUri = encodeURI(csvContent);

  // Crear un elemento de enlace para la descarga
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "arrayOfResults.csv");

  // Agregar el enlace al DOM y disparar el evento de clic
  document.body.appendChild(link); // Necesario para Firefox
  link.click();
  document.body.removeChild(link); // Limpiar después de la descarga
});

//#endregion

//#region (l) Draggable bar

function controlFromInput(fromSlider, fromInput, toInput, controlSlider) {
  const [from, to] = getParsed(fromInput, toInput);
  fillSlider(fromInput, toInput, "#eaeaec", "#025B7B", controlSlider);
  if (from > to) {
    fromSlider.value = to;
    fromInput.value = to;
  } else {
    fromSlider.value = from;
  }
}

function controlToInput(toSlider, fromInput, toInput, controlSlider) {
  const [from, to] = getParsed(fromInput, toInput);
  fillSlider(fromInput, toInput, "#eaeaec", "#025B7B", controlSlider);
  setToggleAccessible(toInput);
  if (from <= to) {
    toSlider.value = to;
    toInput.value = to;
  } else {
    toInput.value = from;
  }
}

function controlFromSlider(fromSlider, toSlider, fromInput) {
  const [from, to] = getParsed(fromSlider, toSlider);
  fillSlider(fromSlider, toSlider, "#eaeaec", "#025B7B", toSlider);
  if (from > to) {
    fromSlider.value = to;
    fromInput.value = to;
  } else {
    fromInput.value = from;
  }
}

function controlToSlider(fromSlider, toSlider, toInput) {
  const [from, to] = getParsed(fromSlider, toSlider);
  fillSlider(fromSlider, toSlider, "#eaeaec", "#025B7B", toSlider);
  setToggleAccessible(toSlider);
  if (from <= to) {
    toSlider.value = to;
    toInput.value = to;
  } else {
    toInput.value = from;
    toSlider.value = from;
  }
}

function getParsed(currentFrom, currentTo) {
  const from = parseInt(currentFrom.value, 10);
  const to = parseInt(currentTo.value, 10);
  return [from, to];
}

function fillSlider(from, to, sliderColor, rangeColor, controlSlider) {
  const rangeDistance = to.max - to.min;
  const fromPosition = from.value - to.min;
  const toPosition = to.value - to.min;
  controlSlider.style.background = `linear-gradient(
      to right,
      ${sliderColor} 0%,
      ${sliderColor} ${(fromPosition / rangeDistance) * 100}%,
      ${rangeColor} ${(fromPosition / rangeDistance) * 100}%,
      ${rangeColor} ${(toPosition / rangeDistance) * 100}%, 
      ${sliderColor} ${(toPosition / rangeDistance) * 100}%, 
      ${sliderColor} 100%)`;
}

function setToggleAccessible(currentTarget) {
  const toSlider = document.querySelector("#toSlider");
  if (Number(currentTarget.value) <= 0) {
    toSlider.style.zIndex = 2;
  } else {
    toSlider.style.zIndex = 0;
  }
}

const fromSlider = document.querySelector("#fromSlider");
const toSlider = document.querySelector("#toSlider");
const fromInput = document.querySelector("#fromInput");
const toInput = document.querySelector("#toInput");
fillSlider(fromSlider, toSlider, "#eaeaec", "#025B7B", toSlider);
setToggleAccessible(toSlider);

fromSlider.oninput = () => controlFromSlider(fromSlider, toSlider, fromInput);
toSlider.oninput = () => controlToSlider(fromSlider, toSlider, toInput);
fromInput.oninput = () =>
  controlFromInput(fromSlider, fromInput, toInput, toSlider);
toInput.oninput = () => controlToInput(toSlider, fromInput, toInput, toSlider);

//#endregion

//#region (l) Intersection observer

// Función callback para el observer
const handleIntersect = (entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      console.log("El elemento ha entrado en la pantalla!");
      // Aquí puedes realizar cualquier acción que desees cuando el elemento entra en la pantalla
      queryFirebase(queryData);
    } else {
      console.log("El elemento ha salido de la pantalla!");
      // Aquí puedes realizar cualquier acción que desees cuando el elemento sale de la pantalla
    }
  });
};

// Opciones para el observer
const options = {
  root: null, // Usar el viewport como raíz
  rootMargin: "0px", // Sin márgenes
  threshold: 0.1, // El elemento es considerado visible si al menos el 10% está en la pantalla
};

// Crear el observer
const observer = new IntersectionObserver(handleIntersect, options);

// Observar un elemento específico
const element = document.querySelector("#page-navigator");
observer.observe(element);

//#endregion

//#region (l) Select filter element

var untouchedQueryData = {
  dataLanguages: ["all"],
  dataSports: ["all"],
  dataAvailability: ["all"],
  dataExperience: ["all"],
  dataNationality: ["un"],
  dataAge: ["0", "100"],
  dataAdminType: ["all"],
};

var queryData = {
  dataLanguages: ["all"],
  dataSports: ["all"],
  dataAvailability: ["all"],
  dataExperience: ["all"],
  dataNationality: [],
  dataAge: [],
  dataAdminType: ["all"],
};

function isLastSelected(elementos, elemento) {
  const isSelected = elemento.classList.contains("selected");
  const selectedCount = Array.from(elementos).filter((el) =>
    el.classList.contains("selected")
  ).length;
  return isSelected && selectedCount === 1;
}

// ---------------------------------------------------------------------------------- LANGUAGE FILTER
var filterElementsLanguage = document.querySelectorAll("[data-language]");
filterElementsLanguage.forEach((element) => {
  element.addEventListener("click", () => {
    if (element.classList.contains("filterall")) {
      filterElementsLanguage.forEach((el) => el.classList.remove("selected"));
      element.classList.add("selected");
      queryData.dataLanguages.length = 0;
      queryData.dataLanguages.push("all");
    } else {
      filterElementsLanguage[0].classList.remove("selected");

      if (!isLastSelected(filterElementsLanguage, element)) {
        element.classList.toggle("selected");
      }

      queryData.dataLanguages.length = 0;
      filterElementsLanguage.forEach((el) => {
        if (el.classList.contains("selected")) {
          queryData.dataLanguages.push(el.getAttribute("data-language"));
        }
      });
    }
  });
});

// ---------------------------------------------------------------------------------- SPORT FILTER
var filterElementsSport = document.querySelectorAll("[data-sport]");
filterElementsSport.forEach((element) => {
  element.addEventListener("click", () => {
    if (element.classList.contains("filterall")) {
      filterElementsSport.forEach((el) => el.classList.remove("selected"));
      element.classList.add("selected");
      queryData.dataSports.length = 0;
      queryData.dataSports.push("all");
    } else {
      filterElementsSport[0].classList.remove("selected");

      if (!isLastSelected(filterElementsSport, element)) {
        element.classList.toggle("selected");
      }

      queryData.dataSports.length = 0;
      filterElementsSport.forEach((el) => {
        if (el.classList.contains("selected")) {
          queryData.dataSports.push(el.getAttribute("data-sport"));
        }
      });
    }
  });
});

// ---------------------------------------------------------------------------------- STARTING TIME FILTER
var filterElementsAvailability = document.querySelectorAll(
  "[data-startingtime]"
);
filterElementsAvailability.forEach((element) => {
  element.addEventListener("click", () => {
    if (element.classList.contains("filterall")) {
      filterElementsAvailability.forEach((el) =>
        el.classList.remove("selected")
      );
      element.classList.add("selected");
      queryData.dataAvailability.length = 0;
      queryData.dataAvailability.push("all");
    } else {
      filterElementsAvailability[0].classList.remove("selected");

      if (!isLastSelected(filterElementsAvailability, element)) {
        element.classList.toggle("selected");
      }

      queryData.dataAvailability.length = 0;
      filterElementsAvailability.forEach((el) => {
        if (el.classList.contains("selected")) {
          queryData.dataAvailability.push(el.getAttribute("data-startingtime"));
        }
      });
    }
  });
});

// ---------------------------------------------------------------------------------- EXPERIENCE FILTER
var filterElementsExperience = document.querySelectorAll("[data-experience]");
filterElementsExperience.forEach((element) => {
  element.addEventListener("click", () => {
    if (element.classList.contains("filterall")) {
      filterElementsExperience.forEach((el) => el.classList.remove("selected"));
      element.classList.add("selected");
      queryData.dataExperience.length = 0;
      queryData.dataExperience.push("all");
    } else {
      filterElementsExperience[0].classList.remove("selected");

      if (!isLastSelected(filterElementsExperience, element)) {
        element.classList.toggle("selected");
      }

      queryData.dataExperience.length = 0;
      filterElementsExperience.forEach((el) => {
        if (el.classList.contains("selected")) {
          queryData.dataExperience.push(el.getAttribute("data-experience"));
        }
      });
    }
  });
});

// ---------------------------------------------------------------------------------- USER ADMIN STATE FILTER
var filterElementsAdminType = document.querySelectorAll("[data-admintype]");
filterElementsAdminType.forEach((element) => {
  element.addEventListener("click", () => {
    if (element.classList.contains("filterall")) {
      filterElementsAdminType.forEach((el) => el.classList.remove("selected"));
      element.classList.add("selected");
      queryData.dataAdminType.length = 0;
      queryData.dataAdminType.push("all");
    } else {
      filterElementsAdminType[0].classList.remove("selected");

      if (!isLastSelected(filterElementsAdminType, element)) {
        element.classList.toggle("selected");
      }

      queryData.dataAdminType.length = 0;
      filterElementsAdminType.forEach((el) => {
        if (el.classList.contains("selected")) {
          queryData.dataAdminType.push(el.getAttribute("data-admintype"));
        }
      });
    }
  });
});

var filtersOpen = document.querySelector("#filters-button");
var filtersPopup = document.querySelector("#filters-popup-container");

filtersOpen.addEventListener("click", () => {
  filtersPopup.style.display = "flex";
});

var applyPopup = document.querySelector("#popup-apply");
var closePopup = document.querySelector("#popup-close");

var selectedCountry = document.querySelector("#js_number-prefix2");
var userNationality = document.querySelector("#js_selected-flag2");

closePopup.addEventListener("click", () => {
  filtersPopup.style.display = "none";
});

function calculateAge(birthDateString) {
  let birthDate = new Date(birthDateString);
  let today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  let monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}

function checkFilters(coach, filterCriteria) {
  // Filtrado por idiomas
  if (
    filterCriteria.dataLanguages.length > 0 &&
    filterCriteria.dataLanguages[0] !== "all"
  ) {
    if (
      !filterCriteria.dataLanguages.some((lang) =>
        coach.userLanguages.includes(lang)
      )
    ) {
      console.log("1");
      return false;
    }
  }

  // Filtrado por deportes
  if (
    filterCriteria.dataSports.length > 0 &&
    filterCriteria.dataSports[0] !== "all"
  ) {
    if (
      !filterCriteria.dataSports.some((sport) =>
        coach.userSports.includes(sport)
      )
    ) {
      console.log("2");
      return false;
    }
  }

  // Filtrado por disponibilidad
  if (
    filterCriteria.dataAvailability.length > 0 &&
    filterCriteria.dataAvailability[0] !== "all"
  ) {
    if (
      !filterCriteria.dataAvailability.some((avail) =>
        coach.userAvailability.includes(avail)
      )
    ) {
      console.log("3");
      return false;
    }
  }

  // Filtrado por experiencia
  if (
    filterCriteria.dataExperience.length > 0 &&
    filterCriteria.dataExperience[0] !== "all"
  ) {
    if (
      !filterCriteria.dataExperience.some((exp) =>
        coach.userExperience.includes(exp)
      )
    ) {
      console.log("4");
      return false;
    }
  }

  // Filtrado por nacionalidad
  if (
    filterCriteria.dataNationality.length > 0 &&
    filterCriteria.dataNationality[0] !== "un"
  ) {
    if (!filterCriteria.dataNationality.includes(coach.userNationality)) {
      console.log("5");
      return false;
    }
  }

  // Filtrado por edad
  if (filterCriteria.dataAge.length === 2) {
    const age = calculateAge(coach.userBirthday);
    if (age < filterCriteria.dataAge[0] || age > filterCriteria.dataAge[1]) {
      console.log("6");
      return false;
    }
  }

  // Filtrado por tipo
  if (
    filterCriteria.dataAdminType.length > 0 &&
    filterCriteria.dataAdminType[0] !== "all"
  ) {
    if (!filterCriteria.dataAdminType.includes(coach.userAdminType)) {
      console.log("Nuevo filtro por userAdminType");
      return false;
    }
  }

  return true;
}

function mapSportToSVG(sport) {
  const sportsSVGs = {
    tenis: `<svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
      <rect x="2.59961" y="3" width="4" height="18" fill="#B9CBD4"/>
      <rect x="18.5996" y="3" width="4" height="18" fill="#B9CBD4"/>
      <path d="M6.59961 3H18.5996M6.59961 3V7.5M6.59961 3H2.59961V21H6.59961M6.59961 21H18.5996M6.59961 21V16.5M18.5996 21V16.5M18.5996 21H22.5996V3H18.5996M18.5996 3V7.5M6.59961 7.5V16.5M6.59961 7.5H12.5996M18.5996 7.5V16.5M18.5996 7.5H12.5996M6.59961 16.5H12.5996M18.5996 16.5H12.5996M12.5996 16.5V7.5" stroke="#025B7B" stroke-width="1.5" stroke-linejoin="round"/>
    </svg>`, // Reemplaza '...' con el contenido SVG para el fútbol
    padel: `<svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
      <path d="M5.59961 7.5V3H19.5996V7.5M5.59961 7.5V16.5M5.59961 7.5H12.5996M19.5996 7.5V16.5M19.5996 7.5H12.5996M5.59961 16.5V21H19.5996V16.5M5.59961 16.5H12.5996M19.5996 16.5H12.5996M12.5996 16.5V7.5" stroke="#025B7B" stroke-width="1.5" stroke-linejoin="round"/>
    </svg>`, // SVG para baloncesto
    pickleball: `<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
      <rect x="5.59961" y="9.20001" width="14" height="6" fill="#B9CBD4"/>
      <path d="M5.59961 9.20001V3.20001H19.5996V9.20001M5.59961 9.20001V15.2M5.59961 9.20001H12.5996M19.5996 9.20001V15.2M19.5996 9.20001H12.5996M5.59961 15.2V21.2H19.5996V15.2M5.59961 15.2H12.5996M19.5996 15.2H12.5996M12.5996 15.2V9.20001" stroke="#025B7B" stroke-width="1.5" stroke-linejoin="round"/>
    </svg>`, // SVG para tenis
    // ... Agrega más deportes y sus SVGs correspondientes
  };

  return sportsSVGs[sport];
}

var injectElement = (element) => {
  function formatName(userName, userSurname) {
    let fullName = userName + " " + userSurname;
    // Restringe la cadena a un máximo de 15 caracteres
    // return fullName.substring(0, 15);
    return fullName;
  }
  var rowName = formatName(element.userName, element.userSurname);

  function calculateAge(birthDateString) {
    let birthDate = new Date(birthDateString);
    let today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    let monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }
  var rowAge = calculateAge(element.userBirthday);

  var rowNationality = element.userNationality;

  function calculateLanguages(rawArray) {
    let languagesString = ""; // Inicializa una cadena vacía para almacenar los idiomas

    rawArray.forEach((language, index) => {
      languagesString += language;
      if (index < rawArray.length - 1) {
        languagesString += ", ";
      }
    });

    return languagesString;
  }
  var rowLanguages = calculateLanguages(element.userLanguages);

  var rowSports = calculateLanguages(element.userSports);

  function mapAvailability(availability) {
    const mapping = {
      "4mo": "4",
      "6mo": "6",
      "1yr": "12",
      now: "Now",
      one: "1",
      "2o3": "2 - 3",
      von: "VoN",
      // Agrega aquí más mapeos según sea necesario
    };

    // Retorna el valor mapeado si existe, de lo contrario devuelve el valor original
    return mapping[availability] || availability;
  }
  var rowAvailability = mapAvailability(element.userAvailability);

  function mapExperience(experience) {
    const mapping = {
      "two-or-less": "0 - 2",
      "two-to-five": "2 - 5",
      "five-to-ten": "5 - 10",
      "ten-or-more": "> 10",
      "professional player": "Pro",
      "profesional player": "Pro",
      // Agrega aquí más mapeos según sea necesario
    };

    // Retorna el valor mapeado si existe, de lo contrario devuelve el valor original
    return mapping[experience] || experience;
  }
  var rowExperience = mapExperience(element.userExperience);

  function calculateSportsSVGs(rawArray) {
    return rawArray.map(mapSportToSVG).join(""); // Mapea cada deporte a su SVG y luego combina los SVGs con comas
  }
  var rowSportsSVGs = calculateSportsSVGs(element.userSports);

  const newRow = document.createElement("a");
  newRow.classList.add("row");
  newRow.classList.add("deletable");
  newRow.href = `profilecoach?id=${element.coachId}`;
  newRow.innerHTML = `
        <div class="cell name">${rowName}</div>
        <div class="cell age">${rowAge}</div>
        <div class="cell nationality">${rowNationality}</div>
        <div class="cell">${rowLanguages}</div>
        <div class="cell">${rowSportsSVGs}</div>
        <div class="cell">${rowAvailability}</div>
        <div class="cell">${rowExperience}</div>
    `;

  // Inserta el nuevo elemento después de referenceRow
  referenceRow.insertAdjacentElement("afterend", newRow);
};

applyPopup.addEventListener("click", () => {
  // Rest of elements already updated

  // Nationality
  const countryRegex = /\/([a-zA-Z]+)\.png$/;
  queryData.dataNationality.length = 0;
  const coincidenciaNationality = userNationality.src.match(countryRegex);
  coincidenciaNationality
    ? queryData.dataNationality.push(coincidenciaNationality[1])
    : "";

  // Age
  queryData.dataAge.length = 0;
  queryData.dataAge.push(fromInput.value, toInput.value);

  filtersPopup.style.display = "none";

  console.log(queryData);
  console.log(untouchedQueryData);

  function deepEqual(obj1, obj2) {
    if (obj1 === obj2) return true;
    if (
      typeof obj1 !== "object" ||
      obj1 === null ||
      typeof obj2 !== "object" ||
      obj2 === null
    ) {
      return false;
    }
    let keys1 = Object.keys(obj1);
    let keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) return false;
    for (let key of keys1) {
      if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
        return false;
      }
    }
    return true;
  }

  // Usando la función
  if (deepEqual(queryData, untouchedQueryData)) {
    filtersOpen.classList.remove("filtered");
  } else {
    filtersOpen.classList.add("filtered");
  }

  filteringApplied(arrayOfResults);
});

//#endregion

// #region PhoneNumber

const selectContainer2 = document.getElementById("js_pn-select2");
const countrySearchInput2 = document.getElementById("js_search-input2");
const noResultListItem2 = document.getElementById("js_no-results-found2");
const dropdownTrigger2 = document.getElementById("js_trigger-dropdown2");
const phoneNumberInput2 = document.getElementById("js_input-phonenumber2");
const dropdownContainer2 = document.getElementById("js_dropdown2");
const selectedPrefix2 = document.getElementById("js_number-prefix2");
const selectedFlag2 = document.getElementById("js_selected-flag2");
const listContainer2 = document.getElementById("js_list2");

let countryList2;

const init2 = async (countries) => {
  const selectCountry = (e) => {
    const { name, flag, prefix } = e.target.closest("li").dataset;
    setNewSelected(prefix, flag, name);
    closeDropdown();
    addSelectedModifier(flag);
  };

  // -------------- Update the 'Selected country flag' to reflect changes

  const setNewSelected = (prefix, flag, name) => {
    selectedFlag2.src = `https://flagcdn.com/36x27/${flag}.png`;
    selectedPrefix2.value = `${name}`;
    selectContainer2.style.setProperty("--prefix-length", prefix.length);
  };

  // -------------- Removes and adds modifier to selected country

  const addSelectedModifier = (flag) => {
    const previousSelected = document.getElementsByClassName(
      "pn-list-item--selected"
    )[0];
    const newSelected = document.querySelectorAll(
      `.pn-list-item[data-flag=${flag}]`
    )[0];
    previousSelected.classList.remove("pn-list-item--selected");
    newSelected.classList.add("pn-list-item--selected");
  };

  // -------------- Close dropdown

  const closeDropdown = () => {
    selectContainer2.classList.remove("pn-select--open");
    listContainer2.scrollTop = 0;
    countrySearchInput2.value = "";
    countryList2.search();
    phoneNumberInput2.focus();
    removeDropdownEvents();
  };

  // -------------- Open dropdown

  const openDropdown = () => {
    selectContainer2.classList.add("pn-select--open");
    attatchDropdownEvents();
  };

  // -------------- Dropdown event listeners

  let countdown;

  const closeOnMouseLeave = () => {
    countdown = setTimeout(() => closeDropdown(), 2000);
  };

  const clearTimeOut = () => clearTimeout(countdown);

  const attatchDropdownEvents = () => {
    dropdownContainer2.addEventListener("mouseleave", closeOnMouseLeave);
    dropdownContainer2.addEventListener("mouseenter", clearTimeOut);
  };

  const removeDropdownEvents = () => {
    clearTimeout(countdown);
    dropdownContainer2.removeEventListener("mouseleave", closeOnMouseLeave);
    dropdownContainer2.removeEventListener("mouseenter", clearTimeOut);
  };

  // -------------- Close when clicked outside the dropdown

  document.addEventListener("click", (e) => {
    if (
      e.target !== selectContainer2 &&
      !selectContainer2.contains(e.target) &&
      selectContainer2.classList.contains("pn-select--open")
    ) {
      closeDropdown();
    }
  });

  // -------------- Append generated listItems to list element

  const createList = () =>
    new Promise((resolve, _) => {
      countries.forEach((country, index, countries) => {
        const { name, prefix, flag } = country;

        const element = `<li class="pn-list-item ${
          flag === "nl" ? "pn-list-item--selected" : ""
        } js_pn-list-item-2" data-name="${name}" data-flag="${flag}" data-prefix="${prefix}" tabindex="0" role="button" aria-pressed="false">
          <img class="pn-list-item__flag" src="https://flagcdn.com/36x27/${flag}.png" />
          <span class="pn-list-item__country js_country-name">${name}</span>
        </li>`;

        listContainer2.innerHTML += element;

        if (index === countries.length - 1) {
          resolve();
        }
      });
    });

  // -------------- After all the listItems are created we loop over the items to attach the eventListeners

  const attatchListItemEventListeners = () =>
    new Promise((resolve, _) => {
      const listItems = [
        ...document.getElementsByClassName("js_pn-list-item-2"),
      ];

      listItems.forEach((item, index, listItems) => {
        item.addEventListener("click", (event) => {
          selectCountry(event);
        });
        // Keydown event listener - https://dev.to/tylerjdev/when-role-button-is-not-enough-dac
        item.addEventListener("keydown", function (e) {
          const keyD = e.key !== undefined ? e.key : e.keyCode;
          if (
            keyD === "Enter" ||
            keyD === 13 ||
            ["Spacebar", " "].indexOf(keyD) >= 0 ||
            keyD === 32
          ) {
            e.preventDefault();
            this.click();
          }
        });

        if (index === listItems.length - 1) {
          resolve();
        }
      });
    });

  // -------------- After all the listItems are created we init2ate list and it's listeners

  const init2iateList = () => {
    countryList2 = new List("js_pn-select2", {
      valueNames: ["js_country-name", "js_country-prefix"],
    });

    // Add 'updated' listener for search results
    countryList2.on("updated", (list) => {
      if (list.matchingItems.length < 5)
        listContainer2.classList.toggle("pn-list--no-scroll");

      noResultListItem2.style.display =
        list.matchingItems.length > 0 ? "none" : "block";
    });
  };

  await createList();
  await attatchListItemEventListeners();
  init2iateList();

  dropdownTrigger2.addEventListener("click", () => {
    const isOpen = selectContainer2.classList.contains("pn-select--open");
    isOpen ? closeDropdown() : openDropdown();
  });
};

var countries = [
  {
    name: "Cualquiera",
    prefix: 9999,
    flag: "un",
  },
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

init2(countries);

//#endregion PhoneNumber
