import { firebaseCreateClub } from "./register-club-firebase.js";
import { firebaseSaveClubData } from "./register-club-firebase.js";
import { setUserNameOnHeader } from "./firebase-auth-checker.js";

// Variables
const headerBurguer =document.querySelector('.Header-burguer')
const headerNav = document.querySelector('.Header-nav')


var allTextInputs = document.querySelectorAll(".textinput-text");
var allIconInputs = document.querySelectorAll(".textinput-icon");
var specialTextInput = document.querySelector("#additional-sport");
var specialTextInputPhone = document.querySelector("#pn-input-blur");

var backButtons = document.querySelectorAll(".register-element-back");
var nextButtons = document.querySelectorAll(".register-element-next");

var nextConditionalDisclaimer = document.querySelector("#next-conditional-disclaimer");
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
var nonFilledFieldsMessagePassCoincidence = document.querySelector(
  ".non-filled-fields-message-pass-coincidence"
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
var currentProgressValue = 10;

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
var clubConfirmPassword = document.querySelector("#confirm-pass-container > input");

var additionalSport = document.querySelector("#additional-sport");

//#region (v) custom dropdown

var dropdown = document.querySelector(".dropdown");
var dropdownSelection = document.querySelector(".dropdown-selection");
var dropdownArrow = document.querySelector(".dropdown-arrow");
var dropdownOptionsContainer = document.querySelector(".dropdown-options");
var dropdownOptions = document.querySelectorAll(".dropdown-option");

//#endregion

//Cuando hago CLICK en headerBurguer hace una FUNCTION
// a headerNav le TOGGLE la clase isActive

headerBurguer.addEventListener(`click`, ()=>{
  headerNav.classList.toggle('isActive')
})

// On unfocus make colores if right answer
allTextInputs.forEach((textinput, id) => {
  textinput.addEventListener("blur", () => {
    if (!(textinput.value === "")) {
      textinput.style.backgroundColor = "#f3f5f9";
      textinput.style.borderRadius = "0 0.75em 0.75em 0";
      textinput.style.color = "#025b7b";
      allIconInputs[id].style.backgroundColor = '#f3f5f9'
    } else {
      textinput.style.backgroundColor = "rgba(0,0,0,0)";
      textinput.style.borderRadius = "0";
      textinput.style.color = "black";
      allIconInputs[id].style.backgroundColor = 'rgba(0,0,0,0)'
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
    currentProgressValue = currentProgressValue - 10;
    currentProgress.style.width = `${currentProgressValue}%`;
  });
});

// Motion Forward
var moveForward = function () {
  currentPosition = currentPosition - 100;
  registerContainer.style.transform = `translateY(${currentPosition}vh)`;
  currentProgressValue = currentProgressValue + 10;
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

//#region 0 disclaimer 

nextConditionalDisclaimer.addEventListener("click", (e) => {
  moveForward();
});

//#endregion

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

// Función para verificar la seguridad de la contraseña
function isPassSafe(pass) {
  return (
    pass.length >= 8 &&
    /[A-Z]/.test(pass) &&
    /[a-z]/.test(pass) &&
    /\d/.test(pass)
  );
}

// Función para alternar la visibilidad de la contraseña
function togglePasswordVisibility(inputId, svgPrefix) {
  var input = document.getElementById(inputId);
  var showIcon = document.getElementById(svgPrefix + "-show");
  var hideIcon = document.getElementById(svgPrefix + "-hide");

  if (input.type === "password") {
      input.type = "text";
      showIcon.style.display = "none";
      hideIcon.style.display = "block";
  } else {
      input.type = "password";
      showIcon.style.display = "block";
      hideIcon.style.display = "none";
  }
}

document.querySelector('#pass-show').addEventListener('click', () => {
  togglePasswordVisibility('password', 'pass')
})

document.querySelector('#pass-hide').addEventListener('click', () => {
  togglePasswordVisibility('password', 'pass')
})

document.querySelector('#confirm-pass-show').addEventListener('click', () => {
  togglePasswordVisibility('confirm-password', 'confirm-pass')
})

document.querySelector('#confirm-pass-hide').addEventListener('click', () => {
  togglePasswordVisibility('confirm-password', 'confirm-pass')
})


// Evento de clic para el botón de registro
nextConditionalPassword.addEventListener("click", (e) => {
  const pass = clubPassword.value;
  const confirmPass = clubConfirmPassword.value; // Asegúrate de tener este campo en tu HTML

  if (!privacyPolicyCheckbox.checked) {
    shakeAnimation(e.target);
    nonFilledFieldsMessagePrivacy.classList.add('displayed');
    setTimeout(() => {
      nonFilledFieldsMessagePrivacy.classList.remove('displayed');
    }, 2000);
  } else if (pass === "") {
    shakeAnimation(e.target);
    nonFilledFieldsMessagePass.classList.add('displayed');
    setTimeout(() => {
      nonFilledFieldsMessagePass.classList.remove('displayed');
    }, 2000);
  } else if (!isPassSafe(pass)) {
    shakeAnimation(e.target);
    nonFilledFieldsMessagePass.classList.add('displayed');
    setTimeout(() => {
      nonFilledFieldsMessagePass.classList.remove('displayed');
    }, 2000);
  } else if (pass !== confirmPass) {
    shakeAnimation(e.target);
    nonFilledFieldsMessagePassCoincidence.classList.add('displayed'); // Asegúrate de tener este elemento en tu HTML
    setTimeout(() => {
      nonFilledFieldsMessagePassCoincidence.classList.remove('displayed');
    }, 2000);
  } else {
    createCoachLoadingIcon.style.visibility = "visible";
    createCoachOkIcon.style.visibility = "hidden";

    setTimeout(() => {
      firebaseCreateClub(registerData)
        .then((user) => {
          registerData.clubId = user;
          firebaseSaveClubData(registerData).then;
          moveForward();
          setUserNameOnHeader(`Club ${registerData.clubName}`, registerData.clubId);
          document.querySelector('#next-conditional-finish').href = `profileclub?id=${registerData.clubId}`;
        })
        .catch((error) => {
          console.error(error);
          createCoachLoadingIcon.style.visibility = "hidden";
          createCoachOkIcon.style.visibility = "visible";
          shakeAnimation(e.target);
          nonFilledFieldsMessageEmail.classList.add('displayed');

          setTimeout(() => {
            nonFilledFieldsMessageEmail.classList.remove('displayed');
          }, 2000);
        });
    }, 1000);
  }
});


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

init2(countries);

//#endregion PhoneNumber

// #region RegisterLogic

var registerData = {
  clubName: "",
  clubRecommendation: "no",
  clubWebPage: "",
  clubCountry: "",
  clubCity: "",
  clubSports: [],
  clubAdditionalSport: "",
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
    registerData.clubAdditionalSport = additionalSport.value;
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
      registerData.clubConsulting = consulting.getAttribute("data-consulting");
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

//#region (f) dropdownDisplay

window.addEventListener("click", (event) => {
  if (!dropdown.contains(event.target)) {
    // Si el clic no ocurrió dentro del dropdown
    dropdownOptionsContainer.classList.remove("displayed");
    dropdownArrow.classList.remove("rotated");
  }
});
dropdown.addEventListener("click", () => {
  dropdownArrow.classList.toggle("rotated");
  dropdownOptionsContainer.classList.toggle("displayed");
});

dropdownOptions.forEach((option) => {
  option.addEventListener("click", () => {
    dropdownSelection.innerHTML = option.innerHTML;
    registerData.clubRecommendation = option.getAttribute("data-recommendator");
  });
});

//#endregion

//#region (l) Prevent default TAB behaviour 

document.addEventListener('keydown', function(event) {
  if (event.key === 'Tab') {
    event.preventDefault();
  }
});

//#endregion

//Store variable to navigate to FAQS
const faqsLink = document.querySelector('.Faqs-link')
faqsLink.addEventListener('click', ()=>{
    localStorage.setItem('seeFaqs', 'yes');
})