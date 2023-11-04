var backButtons = document.querySelectorAll('.register-element-back')
var nextButtons = document.querySelectorAll('.register-element-next')
var registerContainer = document.querySelector('#register-container')
var currentProgress = document.querySelector('#current-progress')

var currentPosition = 0
var currentProgressValue = 10

var checkPossibleMotionBack = function() {
    if (currentPosition === 0) {
        backButtons[0].style.pointerEvents = 'none'
        backButtons[0].style.opacity = '0'
    } else {
        backButtons[0].style.pointerEvents = 'auto'
        backButtons[0].style.opacity = '1'
    }
}

checkPossibleMotionBack()

backButtons.forEach( (backButtons) => {
    backButtons.addEventListener('click', () => {
        currentPosition = currentPosition + 100
        checkPossibleMotionBack()
        registerContainer.style.transform = `translateY(${currentPosition}vh)`
        currentProgressValue = currentProgressValue - 10
        console.log(currentProgressValue)
        currentProgress.style.width = `${currentProgressValue}%`
    })
})

nextButtons.forEach(nextButtons => {
    nextButtons.addEventListener('click', () => {
        // checkPossibleMotion()
        currentPosition = currentPosition - 100
        // checkPossibleMotionBack(backButtons)
        registerContainer.style.transform = `translateY(${currentPosition}vh)`
        currentProgressValue = currentProgressValue + 10
        currentProgress.style.width = `${currentProgressValue}%`
    })
})

var activableElements = document.querySelectorAll('.activable')

activableElements.forEach(element => {
    element.addEventListener('click', () => {
        element.classList.toggle('active')
    })
})

// #region PhoneNumber

const selectContainer = document.getElementById("js_pn-select");
const countrySearchInput = document.getElementById("js_search-input");
const noResultListItem = document.getElementById("js_no-results-found");
const dropdownTrigger = document.getElementById("js_trigger-dropdown");
const phoneNumberInput = document.getElementById("js_input-phonenumber");
const dropdownContainer = document.getElementById("js_dropdown");
const selectedPrefix = document.getElementById("js_number-prefix");
const selectedFlag = document.getElementById("js_selected-flag");
const listContainer = document.getElementById("js_list");

let countryList;

const init = async (countries) => {
  const selectCountry = (e) => {
    const { flag, prefix } = e.target.closest("li").dataset;
    setNewSelected(prefix, flag);
    closeDropdown();
    addSelectedModifier(flag);
  };

  // -------------- Update the 'Selected country flag' to reflect changes

  const setNewSelected = (prefix, flag) => {
    selectedFlag.src = `https://flagpedia.net/data/flags/icon/36x27/${flag}.png`;
    selectedPrefix.value = `+${prefix}`;
    selectContainer.style.setProperty("--prefix-length", prefix.length);
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
    selectContainer.classList.remove("pn-select--open");
    listContainer.scrollTop = 0;
    countrySearchInput.value = "";
    countryList.search();
    phoneNumberInput.focus();
    removeDropdownEvents();
  };

  // -------------- Open dropdown

  const openDropdown = () => {
    selectContainer.classList.add("pn-select--open");
    attatchDropdownEvents();
  };

  // -------------- Dropdown event listeners

  let countdown;

  const closeOnMouseLeave = () => {
    // console.log("countdown activated");
    countdown = setTimeout(() => closeDropdown(), 2000);
  };

  const clearTimeOut = () => clearTimeout(countdown);

  const attatchDropdownEvents = () => {
    // console.log("Adding event listeners");
    dropdownContainer.addEventListener("mouseleave", closeOnMouseLeave);
    dropdownContainer.addEventListener("mouseenter", clearTimeOut);
  };

  const removeDropdownEvents = () => {
    // console.log("Removing event listeners and countdown");
    clearTimeout(countdown);
    dropdownContainer.removeEventListener("mouseleave", closeOnMouseLeave);
    dropdownContainer.removeEventListener("mouseenter", clearTimeOut);
  };

  // -------------- Close when clicked outside the dropdown

  document.addEventListener("click", (e) => {
    if (
      e.target !== selectContainer &&
      !selectContainer.contains(e.target) &&
      selectContainer.classList.contains("pn-select--open")
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
        } js_pn-list-item" data-flag="${flag}" data-prefix="${prefix}" tabindex="0" role="button" aria-pressed="false">
          <img class="pn-list-item__flag" src="https://flagpedia.net/data/flags/icon/36x27/${flag}.png" />
          <span class="pn-list-item__country js_country-name">${name}</span>
          <span class="pn-list-item__prefix js_country-prefix">(+${prefix})</span>
        </li>`;

        listContainer.innerHTML += element;

        if (index === countries.length - 1) {
          resolve();
        }
      });
    });

  // -------------- After all the listItems are created we loop over the items to attach the eventListeners

  const attatchListItemEventListeners = () =>
    new Promise((resolve, _) => {
      const listItems = [...document.getElementsByClassName("js_pn-list-item")];

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

  // -------------- After all the listItems are created we initate list and it's listeners

  const initiateList = () => {
    countryList = new List("js_pn-select", {
      valueNames: ["js_country-name", "js_country-prefix"],
    });

    // Add 'updated' listener for search results
    countryList.on("updated", (list) => {
        console.log('jsoajdosa')
      if (list.matchingItems.length < 5)
        listContainer.classList.toggle("pn-list--no-scroll");

      noResultListItem.style.display =
        list.matchingItems.length > 0 ? "none" : "block";
    });
  };

  await createList();
  await attatchListItemEventListeners();
  initiateList();

  dropdownTrigger.addEventListener("click", () => {
    const isOpen = selectContainer.classList.contains("pn-select--open");
    isOpen ? closeDropdown() : openDropdown();
  });
};

const countries = [
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

init(countries);

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
    console.log(e.target.closest("li").dataset)
    const { name, flag, prefix } = e.target.closest("li").dataset;
    setNewSelected(prefix, flag, name);
    closeDropdown();
    addSelectedModifier(flag);
  };

  // -------------- Update the 'Selected country flag' to reflect changes

  const setNewSelected = (prefix, flag, name) => {
    selectedFlag2.src = `https://flagpedia.net/data/flags/icon/36x27/${flag}.png`;
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
    // console.log("countdown activated");
    countdown = setTimeout(() => closeDropdown(), 2000);
  };

  const clearTimeOut = () => clearTimeout(countdown);

  const attatchDropdownEvents = () => {
    // console.log("Adding event listeners");
    dropdownContainer2.addEventListener("mouseleave", closeOnMouseLeave);
    dropdownContainer2.addEventListener("mouseenter", clearTimeOut);
  };

  const removeDropdownEvents = () => {
    // console.log("Removing event listeners and countdown");
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
          <img class="pn-list-item__flag" src="https://flagpedia.net/data/flags/icon/36x27/${flag}.png" />
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
      const listItems = [...document.getElementsByClassName("js_pn-list-item-2")];

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