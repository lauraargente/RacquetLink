import { firebaseCreateClub } from "./register-club-firebase.js";
import { firebaseSaveClubData } from "./register-club-firebase.js";
import { setUserNameOnHeader } from "./firebase-auth-checker.js";

var allTextInputs = document.querySelectorAll(".textinput-text");
var specialTextInput = document.querySelector("#additional-sport");
var specialTextInputPhone = document.querySelector("#pn-input-blur");

var backButtons = document.querySelectorAll(".register-element-back");
var nextButtons = document.querySelectorAll(".register-element-next");

var nextConditionalClub = document.querySelector("#next-conditional-club");
var nextConditionalCountry = document.querySelector(
  "#next-conditional-country"
);
var nextConditionalSports = document.querySelector("#next-conditional-sport");
var nextConditionalField = document.querySelector("#next-conditional-fields");
var nextConditionalState = document.querySelector("#next-conditional-state");
var nextConditionalConsulting = document.querySelector(
  "#next-conditional-consulting"
);
var nextConditionalEmail = document.querySelector("#next-conditional-email");
var nextConditionalPhone = document.querySelector("#next-conditional-phone");
var nextConditionalPassword = document.querySelector("#next-conditional-pass");

var registerContainer = document.querySelector("#register-container");
var currentProgress = document.querySelector("#current-progress");

var nonFilledFieldsMessage = document.querySelectorAll(
  ".non-filled-fields-message"
);
var nonFilledFieldsMessageEmail = document.querySelector(
  ".non-filled-fields-message-email"
);
var nonFilledFieldsMessagePass = document.querySelector(
  ".non-filled-fields-message-pass"
);
var nonFilledFieldsMessagePrivacy = document.querySelector(
  ".non-filled-fields-message-privacy"
);
var privacyPolicyCheckbox = document.querySelector('#privacy-policy-box')

var createCoachLoadingIcon = document.querySelector(
  "#create-coach-loading-icon"
);
var createCoachOkIcon = document.querySelector("#create-coach-ok-icon");

var currentPosition = 0;
var currentProgressValue = 12;

var clubName = document.querySelector("#name-container > input");
var clubWebPage = document.querySelector("#web-container > input");
var clubCountry = document.querySelector("#js_selected-flag2");
var clubCity = document.querySelector("#city-container > input");
var clubSports = document.querySelectorAll(".data-sport-option");
var clubField = document.querySelectorAll(".data-fields-option");
var clubState = document.querySelectorAll(".data-state-option");
var clubConsulting = document.querySelectorAll(".data-consulting-option");
var clubEmail = document.querySelector("#email-container > input");
var clubNumber = document.querySelector("#js_input-phonenumber");
var clubPrefix = document.querySelector("#js_number-prefix");
var clubPassword = document.querySelector("#pass-container > input");

var additionalSport = document.querySelector("#additional-sport");

// On unfocus make colores if right answer
allTextInputs.forEach((textinput) => {
  textinput.addEventListener("blur", () => {
    if (!(textinput.value === "")) {
      textinput.style.backgroundColor = "#f3f5f9";
      textinput.style.borderRadius = "0 0.75em 0.75em 0";
      textinput.style.color = "#025b7b";
    } else {
      textinput.style.backgroundColor = "rgba(0,0,0,0)";
      textinput.style.borderRadius = "0";
      textinput.style.color = "black";
    }
  });
});

specialTextInput.addEventListener("blur", () => {
  if (!(specialTextInput.value === "")) {
    specialTextInput.style.backgroundColor = "#f3f5f9";
    specialTextInput.style.border = "1px solid #025B7B"
    specialTextInput.style.borderRadius = "2rem";
    specialTextInput.style.color = "#025b7b";
  } else {
    specialTextInput.style.backgroundColor = "rgba(0,0,0,0)";
    specialTextInput.style.border = "1px solid rgba(0,0,0,0)"
    specialTextInput.style.borderRadius = "2rem";
    specialTextInput.style.color = "black";
  }
});

clubNumber.addEventListener("blur", () => {
  if (!(clubNumber.value === "")) {
    specialTextInputPhone.style.backgroundColor = "#f3f5f9";
    specialTextInputPhone.style.borderRadius = "0 0.75em 0.75em 0";
    specialTextInputPhone.style.color = "#025b7b";
  } else {
    specialTextInputPhone.style.backgroundColor = "rgba(0,0,0,0)";
    specialTextInputPhone.style.borderRadius = "2rem";
    specialTextInputPhone.style.color = "black";
  }
});

// #region motionLogic

backButtons.forEach((backButtons) => {
  backButtons.addEventListener("click", () => {
    currentPosition = currentPosition + 100;
    registerContainer.style.transform = `translateY(${currentPosition}vh)`;
    currentProgressValue = currentProgressValue - 11;
    currentProgress.style.width = `${currentProgressValue}%`;
  });
});

// Motion Forward
var moveForward = function () {
  currentPosition = currentPosition - 100;
  registerContainer.style.transform = `translateY(${currentPosition}vh)`;
  currentProgressValue = currentProgressValue + 11;
  currentProgress.style.width = `${currentProgressValue}%`;
};

var shakeAnimation = function (element) {
  element.style.animation = "shake 0.5s";
  // Restablecer la animación cuando termine
  element.addEventListener("animationend", () => {
    element.style.animation = "";
  });

  nonFilledFieldsMessage.forEach((message) => {
    message.classList.add('displayed')
    // message.style.visibility = "visible";
    // message.style.opacity = "1";
    setTimeout(function () {
      message.classList.remove('displayed')

    }, 2000); // 1000 milisegundos = 1 segundo
  });
};

// Next Club
nextConditionalClub.addEventListener("click", (e) => {
  if (clubName.value === "") {
    shakeAnimation(e.target);
  } else {
    moveForward();
  }
});

// Next City
nextConditionalCountry.addEventListener("click", (e) => {
  if (clubCity.value === "") {
    shakeAnimation(e.target);
  } else {
    moveForward();
  }
});

// Next Sport
nextConditionalSports.addEventListener("click", (e) => {
  var breaker = true;
  clubSports.forEach((sport) => {
    if (sport.classList.contains("active") && breaker) {
      moveForward();
      breaker = false;
    }
  });
  if (!(additionalSport.value === "") && breaker) {
    moveForward();
    breaker = false;
  }
  if (breaker) {
    shakeAnimation(e.target);
  }
});

// Next Fields
nextConditionalField.addEventListener("click", (e) => {
  var breaker = true;
  clubField.forEach((field) => {
    if (field.classList.contains("active") && breaker) {
      moveForward();
      breaker = false;
    }
  });
  if (breaker) {
    shakeAnimation(e.target);
  }
});

// Next State
nextConditionalState.addEventListener("click", (e) => {
  var breaker = true;
  clubState.forEach((state) => {
    if (state.classList.contains("active") && breaker) {
      moveForward();
      breaker = false;
    }
  });
  if (breaker) {
    shakeAnimation(e.target);
  }
});

// Next Consulting
nextConditionalConsulting.addEventListener("click", (e) => {
  var breaker = true;
  clubConsulting.forEach((consulting) => {
    if (consulting.classList.contains("active") && breaker) {
      moveForward();
      breaker = false;
    }
  });
  if (breaker) {
    shakeAnimation(e.target);
  }
});

// Next Number
nextConditionalPhone.addEventListener("click", (e) => {
  if (clubNumber.value === "") {
    shakeAnimation(e.target);
  } else {
    moveForward();
  }
});

// Next Password
nextConditionalPassword.addEventListener("click", (e) => {
  const pass = clubPassword.value;
  console.log(privacyPolicyCheckbox.checked)
  if (!(privacyPolicyCheckbox.checked)) {
    shakeAnimation(e.target);
    nonFilledFieldsMessagePrivacy.classList.add('displayed');
    setTimeout(function () {
      nonFilledFieldsMessagePrivacy.classList.remove('displayed');
    }, 2000); // 1000 milisegundos = 1 segundo
  } else if (pass === "") {
    shakeAnimation(e.target);
    nonFilledFieldsMessagePass.classList.add('displayed');
    setTimeout(function () {
    nonFilledFieldsMessagePass.classList.remove('displayed');

    }, 2000); // 1000 milisegundos = 1 segundo
  } else if (!isPassSafe(pass)) {
    shakeAnimation(e.target);
    nonFilledFieldsMessagePass.classList.add('displayed');

    setTimeout(function () {
    nonFilledFieldsMessagePass.classList.remove('displayed');

    }, 2000); // 1000 milisegundos = 1 segundo
  } else {
    createCoachLoadingIcon.style.visibility = "visible";
    createCoachOkIcon.style.visibility = "hidden";
    // TimeOut to make loading appear more time
    setTimeout(function () {
      firebaseCreateClub(registerData)
        .then((user) => {
          registerData.clubId = user;
          firebaseSaveClubData(registerData).then;
          moveForward();
          setUserNameOnHeader(`Club ${registerData.clubName}`, registerData.clubId)
        })
        .catch((error) => {
          console.log(error)
          createCoachLoadingIcon.style.visibility = "hidden";
          createCoachOkIcon.style.visibility = "visible";
          shakeAnimation(e.target);
          // nonFilledFieldsMessageEmail.style.visibility = "visible";
          // nonFilledFieldsMessageEmail.style.opacity = "1";
          nonFilledFieldsMessageEmail.classList.add('displayed');

          setTimeout(function () {
            // nonFilledFieldsMessageEmail.style.visibility = "hidden";
            // nonFilledFieldsMessageEmail.style.opacity = "0";
            nonFilledFieldsMessageEmail.classList.remove('displayed');

          }, 2000); // 1000 milisegundos = 1 segundo
        });
    }, 1000); // 1000 milisegundos = 1 segundo
  }
});

function isPassSafe(pass) {
  return (
    pass.length >= 8 &&
    /[A-Z]/.test(pass) &&
    /[a-z]/.test(pass) &&
    /\d/.test(pass)
  );
}

//#endregion

var activableElements = document.querySelectorAll(".activable");

activableElements.forEach((element) => {
  element.addEventListener("click", () => {
    element.classList.toggle("active");
  });
});

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
    countdown = setTimeout(() => closeDropdown(), 2000);
  };

  const clearTimeOut = () => clearTimeout(countdown);

  const attatchDropdownEvents = () => {
    dropdownContainer.addEventListener("mouseleave", closeOnMouseLeave);
    dropdownContainer.addEventListener("mouseenter", clearTimeOut);
  };

  const removeDropdownEvents = () => {
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

// #region RegisterLogic

var registerData = {
  clubName: "",
  clubWebPage: "",
  clubCountry: "",
  clubCity: "",
  clubSports: [],
  clubField: "",
  clubState: "",
  clubConsulting: "",
  clubEmail: "",
  clubNumber: "",
  clubPassword: "",
  clubId: "",
};

// registerData



// logic not to select various at the time
clubField.forEach((field) => {
  field.addEventListener("click", () => {
    clubField.forEach((field) => {
      field.classList.remove("active");
    });
    field.classList.toggle("active");
  });
});

clubState.forEach((state) => {
  state.addEventListener("click", () => {
    clubState.forEach((state) => {
      state.classList.remove("active");
    });
    state.classList.toggle("active");
  });
});

clubConsulting.forEach((consulting) => {
  consulting.addEventListener("click", () => {
    clubConsulting.forEach((consulting) => {
      consulting.classList.remove("active");
    });
    consulting.classList.toggle("active");
  });
});

var lastNextButton = document.querySelector("#next-conditional-pass");

var writeRegisterData = function () {
  // Club Name
  registerData.clubName = clubName.value;

  // Club Name
  registerData.clubWebPage = clubWebPage.value;

  // Club Country
  const countryRegex = /\/([a-zA-Z]+)\.png$/;
  const coincidencia = clubCountry.src.match(countryRegex);

  if (coincidencia) {
    const parteDeseada = coincidencia[1];
    registerData.clubCountry = parteDeseada;
  } else {
    registerData.clubCountry = "";
  }

  // Club City
  registerData.clubCity = clubCity.value;

  // Club Sports
  registerData.clubSports.length = 0;
  clubSports.forEach((sport) => {
    if (sport.classList.contains("active")) {
      registerData.clubSports.push(sport.getAttribute("data-sport"));
    }
  });
  if (!(additionalSport.value === "")) {
    registerData.clubSports.push(additionalSport.value);
  }

  // Club Fields
  clubField.forEach((field) => {
    if (field.classList.contains("active")) {
      registerData.clubField = field.getAttribute("data-fields");
    }
  });

  // Club Trainer
  clubState.forEach((trainer) => {
    if (trainer.classList.contains("active")) {
      registerData.clubState = trainer.getAttribute("data-state");
    }
  });

  // Club Consulting
  clubConsulting.forEach((consulting) => {
    if (consulting.classList.contains("active")) {
      registerData.clubConsulting = consulting.getAttribute("data-state");
    }
  });

  // Club Email
  registerData.clubEmail = clubEmail.value;

  // Club Phone
  registerData.clubNumber = `${clubPrefix.value} ${clubNumber.value}`;

  // Club Password
  registerData.clubPassword = clubPassword.value;

  // console.log(registerData)
};

lastNextButton.addEventListener("click", () => {
  writeRegisterData();
});

// #endregion
