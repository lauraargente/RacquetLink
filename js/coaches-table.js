import { firebaseQueryTableCoach } from "./coaches-table-firebase.js";

var arrayOfResults = []

var referenceRow = document.querySelector('#referenceRow')

//#region (f) queryFirebase

var searchApplied = (arrayOfResults, currentString) => {
    console.log(arrayOfResults)
    var previousElementsToDelete = document.querySelectorAll('.deletable')

    previousElementsToDelete.forEach(element => {
        element.parentNode.removeChild(element)
    })

    arrayOfResults.forEach(element => {
        console.log(element)
        if (checkName(element.userName, element.userSurname, currentString)) {
            injectElement(element)
        }
    })
}

function normalizeString(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function checkName(firstName, lastName, searchString) {
  // Normalizar y convertir a minúsculas el nombre completo y la cadena de búsqueda
  var fullNameNormalized = normalizeString(firstName + ' ' + lastName);
  var searchStringNormalized = normalizeString(searchString);

  // Comprueba si la cadena de búsqueda normalizada está contenida en el nombre completo normalizado
  return fullNameNormalized.includes(searchStringNormalized);
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

    arrayOfResults.forEach(element => {
        if (checkFilters(element, queryData)) {
            injectElement(element);
        }
    })
}

var queryFirebase = (queryData, minDocuments = 10) => {
    firebaseQueryTableCoach(queryData).then(result => {
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

//#region (l) Draggable bar 

function controlFromInput(fromSlider, fromInput, toInput, controlSlider) {
    const [from, to] = getParsed(fromInput, toInput);
    fillSlider(fromInput, toInput, '#eaeaec', '#025B7B', controlSlider);
    if (from > to) {
        fromSlider.value = to;
        fromInput.value = to;
    } else {
        fromSlider.value = from;
    }
}
    
function controlToInput(toSlider, fromInput, toInput, controlSlider) {
    const [from, to] = getParsed(fromInput, toInput);
    fillSlider(fromInput, toInput, '#eaeaec', '#025B7B', controlSlider);
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
  fillSlider(fromSlider, toSlider, '#eaeaec', '#025B7B', toSlider);
  if (from > to) {
    fromSlider.value = to;
    fromInput.value = to;
  } else {
    fromInput.value = from;
  }
}

function controlToSlider(fromSlider, toSlider, toInput) {
  const [from, to] = getParsed(fromSlider, toSlider);
  fillSlider(fromSlider, toSlider, '#eaeaec', '#025B7B', toSlider);
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
    const rangeDistance = to.max-to.min;
    const fromPosition = from.value - to.min;
    const toPosition = to.value - to.min;
    controlSlider.style.background = `linear-gradient(
      to right,
      ${sliderColor} 0%,
      ${sliderColor} ${(fromPosition)/(rangeDistance)*100}%,
      ${rangeColor} ${((fromPosition)/(rangeDistance))*100}%,
      ${rangeColor} ${(toPosition)/(rangeDistance)*100}%, 
      ${sliderColor} ${(toPosition)/(rangeDistance)*100}%, 
      ${sliderColor} 100%)`;
}

function setToggleAccessible(currentTarget) {
  const toSlider = document.querySelector('#toSlider');
  if (Number(currentTarget.value) <= 0 ) {
    toSlider.style.zIndex = 2;
  } else {
    toSlider.style.zIndex = 0;
  }
}

const fromSlider = document.querySelector('#fromSlider');
const toSlider = document.querySelector('#toSlider');
const fromInput = document.querySelector('#fromInput');
const toInput = document.querySelector('#toInput');
fillSlider(fromSlider, toSlider, '#eaeaec', '#025B7B', toSlider);
setToggleAccessible(toSlider);

fromSlider.oninput = () => controlFromSlider(fromSlider, toSlider, fromInput);
toSlider.oninput = () => controlToSlider(fromSlider, toSlider, toInput);
fromInput.oninput = () => controlFromInput(fromSlider, fromInput, toInput, toSlider);
toInput.oninput = () => controlToInput(toSlider, fromInput, toInput, toSlider);

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
  dataLanguages: ['all'],
  dataSports: ['all'],
  dataAvailability: ['all'],
  dataExperience: ['all'],
  dataNationality: ['un'],
  dataAge: ['0','100']
}


var queryData = {
    dataLanguages: ['all'],
    dataSports: ['all'],
    dataAvailability: ['all'],
    dataExperience: ['all'],
    dataNationality: [],
    dataAge: []
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

// ---------------------------------------------------------------------------------- STARTING TIME FILTER
var filterElementsAvailability = document.querySelectorAll('[data-startingtime]');
filterElementsAvailability.forEach(element => {
  element.addEventListener('click', () => {
      if (element.classList.contains('filterall')) {
          filterElementsAvailability.forEach(el => el.classList.remove('selected'));
          element.classList.add('selected');
          queryData.dataAvailability.length = 0;
          queryData.dataAvailability.push('all');
      } else {
          filterElementsAvailability[0].classList.remove('selected');

          if (!isLastSelected(filterElementsAvailability, element)) {
              element.classList.toggle('selected');
          }

          queryData.dataAvailability.length = 0;
          filterElementsAvailability.forEach(el => {
              if (el.classList.contains('selected')) {
                  queryData.dataAvailability.push(el.getAttribute("data-startingtime"));
              }
          });
      }
  });
});

// ---------------------------------------------------------------------------------- EXPERIENCE FILTER
var filterElementsExperience = document.querySelectorAll('[data-experience]');
filterElementsExperience.forEach(element => {
  element.addEventListener('click', () => {
      if (element.classList.contains('filterall')) {
          filterElementsExperience.forEach(el => el.classList.remove('selected'));
          element.classList.add('selected');
          queryData.dataExperience.length = 0;
          queryData.dataExperience.push('all');
      } else {
          filterElementsExperience[0].classList.remove('selected');

          if (!isLastSelected(filterElementsExperience, element)) {
              element.classList.toggle('selected');
          }

          queryData.dataExperience.length = 0;
          filterElementsExperience.forEach(el => {
              if (el.classList.contains('selected')) {
                  queryData.dataExperience.push(el.getAttribute("data-experience"));
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
    // Filtrado por idiomas
    if (filterCriteria.dataLanguages.length > 0 && filterCriteria.dataLanguages[0] !== 'all') {
        if (!filterCriteria.dataLanguages.some(lang => coach.userLanguages.includes(lang))) {
            console.log('1');
            return false;
        }
    }

    // Filtrado por deportes
    if (filterCriteria.dataSports.length > 0 && filterCriteria.dataSports[0] !== 'all') {
        if (!filterCriteria.dataSports.some(sport => coach.userSports.includes(sport))) {
            console.log('2');
            return false;
        }
    }

    // Filtrado por disponibilidad
    if (filterCriteria.dataAvailability.length > 0 && filterCriteria.dataAvailability[0] !== 'all') {
        if (!filterCriteria.dataAvailability.some(avail => coach.userAvailability.includes(avail))) {
            console.log('3');
            return false;
        }
    }

    // Filtrado por experiencia
    if (filterCriteria.dataExperience.length > 0 && filterCriteria.dataExperience[0] !== 'all') {
        if (!filterCriteria.dataExperience.some(exp => coach.userExperience.includes(exp))) {
            console.log('4');
            return false;
        }
    }

    // Filtrado por nacionalidad
    if (filterCriteria.dataNationality.length > 0 && filterCriteria.dataNationality[0] !== 'un') {
        if (!filterCriteria.dataNationality.includes(coach.userNationality)) {
            console.log('5');
            return false;
        }
    }

    // Filtrado por edad
    if (filterCriteria.dataAge.length === 2) {
        const age = calculateAge(coach.userBirthday);
        if (age < filterCriteria.dataAge[0] || age > filterCriteria.dataAge[1]) {
            console.log('6');
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

var injectElement = (element) => {
    
    function formatName(userName, userSurname) {
        let fullName = userName + ' ' + userSurname;
        // Restringe la cadena a un máximo de 15 caracteres
        // return fullName.substring(0, 15);
        return fullName
    }
    var rowName = formatName(element.userName, element.userSurname);
    
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
    var rowAge = calculateAge(element.userBirthday)


    var rowNationality = element.userNationality

    function calculateLanguages(rawArray) {
        let languagesString = ''; // Inicializa una cadena vacía para almacenar los idiomas

        rawArray.forEach((language, index) => {
            languagesString += language;
            if (index < rawArray.length - 1) {
                languagesString += ', ';
            }
        });

        return languagesString;
    }
    var rowLanguages = calculateLanguages(element.userLanguages)


    var rowSports = calculateLanguages(element.userSports)

    function mapAvailability(availability) {
        const mapping = {
            '4mo': '4',
            '6mo': '6',
            '1yr': '12',
            'now': 'Now',
            'one': '1',
            '2o3': '2 - 3',
            // Agrega aquí más mapeos según sea necesario
        };
    
        // Retorna el valor mapeado si existe, de lo contrario devuelve el valor original
        return mapping[availability] || availability;
    }
    var rowAvailability = mapAvailability(element.userAvailability);

    function mapExperience(experience) {
        const mapping = {
            'two-or-less': '0 - 2',
            'two-to-five': '2 - 5',
            'five-to-ten': '5 - 10',
            'ten-or-more': '> 10',
            'professional player': 'Pro',
            'profesional player': 'Pro',
            // Agrega aquí más mapeos según sea necesario
        };
    
        // Retorna el valor mapeado si existe, de lo contrario devuelve el valor original
        return mapping[experience] || experience;
    }
    var rowExperience = mapExperience(element.userExperience);

    function calculateSportsSVGs(rawArray) {
      return rawArray.map(mapSportToSVG).join(''); // Mapea cada deporte a su SVG y luego combina los SVGs con comas
    }
    var rowSportsSVGs = calculateSportsSVGs(element.userSports);

    const newRow = document.createElement('a');
    newRow.classList.add('row');
    newRow.classList.add('deletable');
    newRow.href = `/profilecoach.html?id=${element.coachId}`
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
  
    // Age
    queryData.dataAge.length = 0
    queryData.dataAge.push(fromInput.value, toInput.value)


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
