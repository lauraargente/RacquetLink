import { firebaseQueryTableClub } from "./clubs-table-firebase.js";
import { checkIfUserAdmin } from "./adminlist.js"

var arrayOfResults = []

var referenceRow = document.querySelector('#referenceRow')

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

checkIfUserAdmin(valorCookieId) ? 'ok' : window.location.href = '404.html'

//#endregion

//#region (f) queryFirebase

var searchApplied = (arrayOfResults, currentString) => {
  console.log(arrayOfResults)
  var previousElementsToDelete = document.querySelectorAll('.deletable')

  previousElementsToDelete.forEach(element => {
      element.parentNode.removeChild(element)
  })

  arrayOfResults.forEach(element => {
      console.log(element)
      if (checkName(element.clubName, currentString)) {
          injectElement(element)
      }
  })
}
function normalizeString(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function checkName(firstName, searchString) {
  var nameNormalized = normalizeString(firstName);
  var searchStringNormalized = normalizeString(searchString);

  return nameNormalized.includes(searchStringNormalized);
}


document.querySelector('#search-input-text').addEventListener('input', function(event) {
  var currentString = event.target.value;
  searchApplied(arrayOfResults, currentString);
});

var filteringApplied = (arrayOfResults) => {
  var previousElementsToDelete = document.querySelectorAll('.deletable')

  previousElementsToDelete.forEach(element => {
      element.parentNode.removeChild(element)
  })

  console.log(queryData)

  arrayOfResults.forEach(element => {
      if (checkFilters(element, queryData)) {
          injectElement(element);
      }
  })
}

var queryFirebase = (queryData, minDocuments = 10) => {
  firebaseQueryTableClub(queryData).then(result => {
        let countValidDocuments = 0;

        if (result.documents.length > 0) {
            result.documents.forEach(element => {
                arrayOfResults.push(element);
                if (checkFilters(element, queryData)) {
                    injectElement(element);
                    countValidDocuments++;
                }
            });
            console.log(arrayOfResults);
        }

        if (!result.endOfCollection && countValidDocuments < minDocuments) {
            console.log(`Número de documentos válidos (${countValidDocuments}) es menor que el mínimo requerido (${minDocuments}). Relanzando la consulta...`);
            queryFirebase(queryData, minDocuments);
        } else if (result.endOfCollection) {
            console.log("Se ha alcanzado el final de la colección. No hay más documentos para recuperar.");
        }
    }).catch(error => {
        console.error("Error al recuperar documentos:", error);
    });
}

//#endregion

//#region (l) downloadData 

var downloadData = document.querySelector('#download-data')

downloadData.addEventListener('click', () => {
  // Convertir el objeto a un formato CSV
  let csvContent = "data:text/csv;charset=utf-8,";

  // Obtener las claves del primer objeto para los encabezados
  const headers = Object.keys(arrayOfResults[0]);
  csvContent += headers.join(",") + "\r\n"; // Añadir encabezados

  arrayOfResults.forEach(obj => {
      let row = headers.map(header => {
          let value = obj[header];
          if (Array.isArray(value)) {
              return '"' + value.join(' ') + '"'; // Entre comillas para manejar valores con comas
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

//#region (l) Intersection observer 

// Función callback para el observer
const handleIntersect = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            console.log('El elemento ha entrado en la pantalla!');
            // Aquí puedes realizar cualquier acción que desees cuando el elemento entra en la pantalla
            queryFirebase(queryData)
            
        } else {
            console.log('El elemento ha salido de la pantalla!');
            // Aquí puedes realizar cualquier acción que desees cuando el elemento sale de la pantalla
        }
    });
};

// Opciones para el observer
const options = {
    root: null, // Usar el viewport como raíz
    rootMargin: '0px', // Sin márgenes
    threshold: 0.1 // El elemento es considerado visible si al menos el 10% está en la pantalla
};

// Crear el observer
const observer = new IntersectionObserver(handleIntersect, options);

// Observar un elemento específico
const element = document.querySelector('#page-navigator');
observer.observe(element);


//#endregion

//#region (l) Select filter element 

var untouchedQueryData = {
  dataSports: ['all'],
  dataState: ['all'],
  dataConsulting: ['all'],
  dataNationality: ['un'],
}


var queryData = {
    dataSports: ['all'],
    dataState: ['all'],
    dataConsulting: ['all'],
    dataNationality: [],
}

function isLastSelected(elementos, elemento) {
  const isSelected = elemento.classList.contains('selected');
  const selectedCount = Array.from(elementos).filter(el => el.classList.contains('selected')).length;
  return isSelected && selectedCount === 1;
}

// ---------------------------------------------------------------------------------- LANGUAGE FILTER
var filterElementsLanguage = document.querySelectorAll('[data-language]');
filterElementsLanguage.forEach(element => {
  element.addEventListener('click', () => {
      if (element.classList.contains('filterall')) {
          filterElementsLanguage.forEach(el => el.classList.remove('selected'));
          element.classList.add('selected');
          queryData.dataLanguages.length = 0;
          queryData.dataLanguages.push('all');
      } else {
          filterElementsLanguage[0].classList.remove('selected');

          if (!isLastSelected(filterElementsLanguage, element)) {
              element.classList.toggle('selected');
          }

          queryData.dataLanguages.length = 0;
          filterElementsLanguage.forEach(el => {
              if (el.classList.contains('selected')) {
                  queryData.dataLanguages.push(el.getAttribute("data-language"));
              }
          });
      }
  });
});

// ---------------------------------------------------------------------------------- SPORT FILTER
var filterElementsSport = document.querySelectorAll('[data-sport]');
filterElementsSport.forEach(element => {
  element.addEventListener('click', () => {
      if (element.classList.contains('filterall')) {
          filterElementsSport.forEach(el => el.classList.remove('selected'));
          element.classList.add('selected');
          queryData.dataSports.length = 0;
          queryData.dataSports.push('all');
      } else {
          filterElementsSport[0].classList.remove('selected');

          if (!isLastSelected(filterElementsSport, element)) {
              element.classList.toggle('selected');
          }

          queryData.dataSports.length = 0;
          filterElementsSport.forEach(el => {
              if (el.classList.contains('selected')) {
                  queryData.dataSports.push(el.getAttribute("data-sport"));
              }
          });
      }
  });
});

// ---------------------------------------------------------------------------------- STATE FILTER
var filterElementsState = document.querySelectorAll('[data-state]');
filterElementsState.forEach(element => {
  element.addEventListener('click', () => {
      if (element.classList.contains('filterall')) {
          filterElementsState.forEach(el => el.classList.remove('selected'));
          element.classList.add('selected');
          queryData.dataState.length = 0;
          queryData.dataState.push('all');
      } else {
          filterElementsState[0].classList.remove('selected');

          if (!isLastSelected(filterElementsState, element)) {
              element.classList.toggle('selected');
          }

          queryData.dataState.length = 0;
          filterElementsState.forEach(el => {
              if (el.classList.contains('selected')) {
                  queryData.dataState.push(el.getAttribute("data-state"));
              }
          });
      }
  });
});

// ---------------------------------------------------------------------------------- CONSULTING FILTER
var filterElementsConsulting = document.querySelectorAll('[data-consulting]');
filterElementsConsulting.forEach(element => {
  element.addEventListener('click', () => {
      if (element.classList.contains('filterall')) {
          filterElementsConsulting.forEach(el => el.classList.remove('selected'));
          element.classList.add('selected');
          queryData.dataConsulting.length = 0;
          queryData.dataConsulting.push('all');
      } else {
          filterElementsConsulting[0].classList.remove('selected');

          if (!isLastSelected(filterElementsConsulting, element)) {
              element.classList.toggle('selected');
          }

          queryData.dataConsulting.length = 0;
          filterElementsConsulting.forEach(el => {
              if (el.classList.contains('selected')) {
                  queryData.dataConsulting.push(el.getAttribute("data-consulting"));
              }
          });
      }
  });
});


var filtersOpen = document.querySelector('#filters-button')
var filtersPopup = document.querySelector('#filters-popup-container')

filtersOpen.addEventListener('click', () => {
    filtersPopup.style.display = 'flex'
})

var applyPopup = document.querySelector('#popup-apply')
var closePopup = document.querySelector('#popup-close')

var selectedCountry = document.querySelector('#js_number-prefix2')
var userNationality = document.querySelector("#js_selected-flag2");

closePopup.addEventListener('click', () => {
    filtersPopup.style.display = 'none'
})

function calculateAge(birthDateString) {
    let birthDate = new Date(birthDateString);
    let today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    let monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
}

function checkFilters(coach, filterCriteria) {
  if (filterCriteria.dataNationality.length > 0 && filterCriteria.dataNationality[0] !== 'un') {
      if (!filterCriteria.dataNationality.includes(coach.clubCountry)) {
          return false;
      }
  }

  if (filterCriteria.dataSports.length > 0 && filterCriteria.dataSports[0] !== 'all') {
      if (!filterCriteria.dataSports.some(sport => coach.clubSports.includes(sport))) {
          return false;
      }
  }

  if (filterCriteria.dataState.length > 0 && filterCriteria.dataState[0] !== 'all') {
      if (!filterCriteria.dataState.includes(coach.clubState)) {
          return false;
      }
  }

  if (filterCriteria.dataConsulting.length > 0 && filterCriteria.dataConsulting[0] !== 'all') {
      if (!filterCriteria.dataConsulting.includes(coach.clubConsulting)) {
          return false;
      }
  }

  return true;
}

function mapSportToSVG(sport) {
  const sportsSVGs = {
      'tenis': `<svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
      <rect x="2.59961" y="3" width="4" height="18" fill="#B9CBD4"/>
      <rect x="18.5996" y="3" width="4" height="18" fill="#B9CBD4"/>
      <path d="M6.59961 3H18.5996M6.59961 3V7.5M6.59961 3H2.59961V21H6.59961M6.59961 21H18.5996M6.59961 21V16.5M18.5996 21V16.5M18.5996 21H22.5996V3H18.5996M18.5996 3V7.5M6.59961 7.5V16.5M6.59961 7.5H12.5996M18.5996 7.5V16.5M18.5996 7.5H12.5996M6.59961 16.5H12.5996M18.5996 16.5H12.5996M12.5996 16.5V7.5" stroke="#025B7B" stroke-width="1.5" stroke-linejoin="round"/>
    </svg>`, // Reemplaza '...' con el contenido SVG para el fútbol
      'padel': `<svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
      <path d="M5.59961 7.5V3H19.5996V7.5M5.59961 7.5V16.5M5.59961 7.5H12.5996M19.5996 7.5V16.5M19.5996 7.5H12.5996M5.59961 16.5V21H19.5996V16.5M5.59961 16.5H12.5996M19.5996 16.5H12.5996M12.5996 16.5V7.5" stroke="#025B7B" stroke-width="1.5" stroke-linejoin="round"/>
    </svg>`, // SVG para baloncesto
      'pickleball': `<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
      <rect x="5.59961" y="9.20001" width="14" height="6" fill="#B9CBD4"/>
      <path d="M5.59961 9.20001V3.20001H19.5996V9.20001M5.59961 9.20001V15.2M5.59961 9.20001H12.5996M19.5996 9.20001V15.2M19.5996 9.20001H12.5996M5.59961 15.2V21.2H19.5996V15.2M5.59961 15.2H12.5996M19.5996 15.2H12.5996M12.5996 15.2V9.20001" stroke="#025B7B" stroke-width="1.5" stroke-linejoin="round"/>
    </svg>`, // SVG para tenis
      // ... Agrega más deportes y sus SVGs correspondientes
  };

  return sportsSVGs[sport]
}

function mapInfoToSVG(info) {
  const infoSVGs = {
      'yes': `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <g clip-path="url(#clip0_197_1447)">
        <path d="M18.3337 9.2381V10.0048C18.3326 11.8018 17.7507 13.5503 16.6748 14.9896C15.5988 16.4289 14.0864 17.4818 12.3631 17.9913C10.6399 18.5009 8.79804 18.4397 7.11238 17.8169C5.42673 17.1942 3.98754 16.0432 3.00946 14.5357C2.03138 13.0281 1.56682 11.2448 1.68506 9.4517C1.80329 7.65857 2.498 5.95171 3.66556 4.58566C4.83312 3.21962 6.41098 2.26759 8.16382 1.87156C9.91665 1.47553 11.7505 1.65671 13.392 2.3881M18.3337 3.33333L10.0003 11.675L7.50032 9.175" stroke="#025B7B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
      <defs>
        <clipPath id="clip0_197_1447">
          <rect width="20" height="20" fill="white"/>
        </clipPath>
      </defs>
    </svg>`, // Reemplaza '...' con el contenido SVG para el fútbol
      'prx': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
      <path d="M9.62598 8.30314C9.87265 7.60192 10.3595 7.01062 11.0004 6.63398C11.6413 6.25734 12.3948 6.11966 13.1274 6.24533C13.86 6.37099 14.5246 6.7519 15.0033 7.32058C15.482 7.88926 15.744 8.60901 15.7429 9.35236C15.7429 11.4508 12.5953 12.5 12.5953 12.5M12.6358 16.7H12.6498" stroke="#025B7B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`, // SVG para baloncesto
      'not': ``, // SVG para tenis
      // ... Agrega más deportes y sus SVGs correspondientes
  };

  return infoSVGs[info]
}

var injectElement = (element) => {
    
  function normalizeString(str) {
    return str.split(' ')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
              .join(' ');
}
    var rowName = normalizeString(element.clubName);
    
    var rowCountry = element.clubCountry

    function calculateStateSVGs(rawArray) {
      return mapInfoToSVG(rawArray)
    }
    var rowStateSVGs = calculateStateSVGs(element.clubState);

    function calculateConsultingSVGs(rawArray) {
      return mapInfoToSVG(rawArray)
    }
    var rowConsultingSVGs = calculateConsultingSVGs(element.clubConsulting);

    function calculateSportsSVGs(rawArray) {
      return rawArray.map(mapSportToSVG).join(''); // Mapea cada deporte a su SVG y luego combina los SVGs con comas
    }
    var rowSportsSVGs = calculateSportsSVGs(element.clubSports);

    const newRow = document.createElement('a');
    newRow.classList.add('row');
    newRow.classList.add('deletable');
    newRow.href = `profileclub.html?id=${element.clubId}`
    newRow.innerHTML = `
        <div class="cell name">${rowName}</div>
        <div class="cell nationality">${rowCountry}</div>
        <div class="cell">${rowSportsSVGs}</div>
        <div class="cell">${rowStateSVGs}</div>
        <div class="cell">${rowConsultingSVGs}</div>
    `;

    // Inserta el nuevo elemento después de referenceRow
    referenceRow.insertAdjacentElement('afterend', newRow);
}

applyPopup.addEventListener('click', () => {

    // Rest of elements already updated

    // Nationality
    const countryRegex = /\/([a-zA-Z]+)\.png$/;
    queryData.dataNationality.length = 0
    const coincidenciaNationality = userNationality.src.match(countryRegex);
    coincidenciaNationality
      ? (queryData.dataNationality.push(coincidenciaNationality[1]))
      : "";
  
    filtersPopup.style.display = 'none'

    console.log(queryData)
    console.log(untouchedQueryData)

    function deepEqual(obj1, obj2) {
      if (obj1 === obj2) return true;
      if (typeof obj1 !== "object" || obj1 === null || typeof obj2 !== "object" || obj2 === null) {
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
      filtersOpen.classList.remove('filtered')
  } else {
    filtersOpen.classList.add('filtered')
  }
  
    filteringApplied(arrayOfResults)
})


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

const init2 = async (countries2) => {
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
      countries2.forEach((country, index, countries2) => {
        const { name, prefix, flag } = country;

        const element = `<li class="pn-list-item ${
          flag === "nl" ? "pn-list-item--selected" : ""
        } js_pn-list-item-2" data-name="${name}" data-flag="${flag}" data-prefix="${prefix}" tabindex="0" role="button" aria-pressed="false">
          <img class="pn-list-item__flag" src="https://flagcdn.com/36x27/${flag}.png" />
          <span class="pn-list-item__country js_country-name">${name}</span>
        </li>`;

        listContainer2.innerHTML += element;

        if (index === countries2.length - 1) {
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

const countries2 = [
{
    name: "Cualquiera",
    prefix: 9999,
    flag: "un",
    },
  {
    name: "Austria",
    prefix: 43,
    flag: "at",
  },
  {
    name: "Bélgica",
    prefix: 32,
    flag: "be",
  },
  {
    name: "Bulgaria",
    prefix: 359,
    flag: "bg",
  },
  {
    name: "Croacia",
    prefix: 385,
    flag: "hr",
  },
  {
    name: "Chipre",
    prefix: 357,
    flag: "cy",
  },
  {
    name: "República Checa",
    prefix: 420,
    flag: "cz",
  },
  {
    name: "Dinamarca",
    prefix: 45,
    flag: "dk",
  },
  {
    name: "Estonia",
    prefix: 372,
    flag: "ee",
  },
  {
    name: "Finlandia",
    prefix: 358,
    flag: "fi",
  },
  {
    name: "Francia",
    prefix: 33,
    flag: "fr",
  },
  {
    name: "Alemania",
    prefix: 49,
    flag: "de",
  },
  {
    name: "Grecia",
    prefix: 30,
    flag: "gr",
  },
  {
    name: "Hungría",
    prefix: 36,
    flag: "hu",
  },
  {
    name: "Islandia",
    prefix: 354,
    flag: "is",
  },
  {
    name: "República de Irlanda",
    prefix: 353,
    flag: "ie",
  },
  {
    name: "Italia",
    prefix: 39,
    flag: "it",
  },
  {
    name: "Letonia",
    prefix: 371,
    flag: "lv",
  },
  {
    name: "Liechtenstein",
    prefix: 423,
    flag: "li",
  },
  {
    name: "Lituania",
    prefix: 370,
    flag: "lt",
  },
  {
    name: "Luxemburgo",
    prefix: 352,
    flag: "lu",
  },
  {
    name: "Malta",
    prefix: 356,
    flag: "mt",
  },
  {
    name: "Países Bajos",
    prefix: 31,
    flag: "nl",
  },
  {
    name: "Noruega",
    prefix: 47,
    flag: "no",
  },
  {
    name: "Polonia",
    prefix: 48,
    flag: "pl",
  },
  {
    name: "Portugal",
    prefix: 351,
    flag: "pt",
  },
  {
    name: "Rumania",
    prefix: 40,
    flag: "ro",
  },
  {
    name: "Eslovaquia",
    prefix: 421,
    flag: "sk",
  },
  {
    name: "Eslovenia",
    prefix: 386,
    flag: "si",
  },
  {
    name: "España",
    prefix: 34,
    flag: "es",
  },
  {
    name: "Suecia",
    prefix: 46,
    flag: "se",
  },
];

init2(countries2);

//#endregion PhoneNumber
