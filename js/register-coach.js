// Import firebase scripts
import { firebaseCreateCoach } from "./register-coach-firebase.js";
import { firebaseSaveCoachData } from "./register-coach-firebase.js";

var registerContainer = document.querySelector("#register-container");
var currentProgress = document.querySelector("#current-progress");

var backButtons = document.querySelectorAll(".register-element-back");

var allTextInputs = document.querySelectorAll(".textinput-text");
var allDateInputs = document.querySelectorAll(".dateinput-date");

//#region (v) input or seleciton elements
var userName = document.querySelector("#name-container > input");
var userSurname = document.querySelector("#surname-container > input");
var userBirthday = document.querySelector("#birthday-container > input");
var userNationality = document.querySelector("#js_number-prefix2");
var userResidence = document.querySelector("#js_number-prefix3");
var userAdditionalSport = document.querySelector("#additional-sport");
var userPhoneNumberPrefix = document.querySelector("#js_number-prefix");
var userPhoneNumber = document.querySelector("#js_input-phonenumber");
var userLinkedin = document.querySelector("#linkedin-container > input");
var userInsta = document.querySelector("#insta-container > input");
var userEmail = document.querySelector("#email-container > input");
var userPass = document.querySelector("#pass-container > input");

//#endregion

//#region (v) option elements
var optionsGenders = document.querySelectorAll(".data-gender-option");
var optionsLanguages = document.querySelectorAll(".data-language-option");
var optionsSports = document.querySelectorAll(".data-sport-option");
var optionsExperience = document.querySelectorAll(".data-experience-option");
var optionsExp = document.querySelectorAll(".data-clubexp-option");
var optionsClinic = document.querySelectorAll(".data-clinicexp-option");
var optionsCoaches = document.querySelectorAll(".data-othercoachexp-option");
var optionsTourOrg = document.querySelectorAll(".data-tourorg-option");
var optionsTourJuz = document.querySelectorAll(".data-tourjuz-option");
var optionsProfExp = document.querySelectorAll(".data-profexp-option");
var optionsCompNow = document.querySelectorAll(".data-compnow-option");
var optionsIntExp = document.querySelectorAll(".data-intexp-option");
var optionsHours = document.querySelectorAll(".data-hours-option");
var optionsLevel = document.querySelectorAll(".data-level-option");
var optionsStartingTime = document.querySelectorAll(
  ".data-startingtime-option"
);
var optionsMobility = document.querySelectorAll(".data-mobility-option");
var optionsOportunity = document.querySelectorAll(".data-oportunity-option");
var optionsSalary = document.querySelectorAll(".data-salary-option");

//#endregion

//#region (v) next buttons
var nextConditionalInfo = document.querySelector("#next-conditional-info");
var nextConditionalNation = document.querySelector("#next-conditional-nations");
var nextConditionalSport = document.querySelector("#next-conditional-sport");
var nextConditionalExpOne = document.querySelector(
  "#next-conditional-experienceone"
);
var nextConditionalExpTwo = document.querySelector(
  "#next-conditional-experiencetwo"
);
var nextConditionalExpThree = document.querySelector(
  "#next-conditional-experiencethree"
);
var nextConditionalPrefOne = document.querySelector(
  "#next-conditional-preferencesone"
);
var nextConditionalPrefTwo = document.querySelector(
  "#next-conditional-preferencestwo"
);
var nextConditionalPrefThree = document.querySelector(
  "#next-conditional-preferencesthree"
);
var nextConditionalData = document.querySelector("#next-conditional-data");
var nextConditionalPass = document.querySelector("#next-conditional-pass");

var nonFilledFieldsMessage = document.querySelectorAll(
  ".non-filled-fields-message"
);
var nonFilledFieldsMessageEmail = document.querySelector(
  ".non-filled-fields-message-email"
);
var nonFilledFieldsMessagePass = document.querySelector(
  ".non-filled-fields-message-pass"
);

var createCoachLoadingIcon = document.querySelector(
  "#create-coach-loading-icon"
);
var createCoachOkIcon = document.querySelector("#create-coach-ok-icon");

//#endregion

// Progress var elements
var currentPosition = 0;
var currentProgressValue = 8.5;

//#region focus and unfocus coloring

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

allDateInputs.forEach((dateinput) => {
  dateinput.addEventListener("blur", () => {
    if (!(dateinput.value === "")) {
      dateinput.style.backgroundColor = "#f3f5f9";
      dateinput.style.borderRadius = "0 0.75em 0.75em 0";
      dateinput.style.color = "#025b7b";
    } else {
      dateinput.style.backgroundColor = "rgba(0,0,0,0)";
      dateinput.style.borderRadius = "0";
      textinput.style.color = "black";
    }
  });
});

//#endregion

//#region backMotion

backButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentPosition = currentPosition + 100;
    registerContainer.style.transform = `translateY(${currentPosition}vh)`;
    currentProgressValue = currentProgressValue - 8.5;
    currentProgress.style.width = `${currentProgressValue}%`;
  });
});

//#endregion

//#region (f) forwardMotion

var moveForward = function () {
  currentPosition = currentPosition - 100;
  registerContainer.style.transform = `translateY(${currentPosition}vh)`;
  currentProgressValue = currentProgressValue + 8.5;
  currentProgress.style.width = `${currentProgressValue}%`;
};

//#endregion

//#region (f) shakeAnimation

var shakeAnimation = function (element) {
  element.style.animation = "shake 0.5s";
  // Restablecer la animación cuando termine
  element.addEventListener("animationend", () => {
    element.style.animation = "";
  });

  nonFilledFieldsMessage.forEach((message) => {
    // message.style.visibility = "visible";
    // message.style.opacity = "1";
    message.classList.add('displayed')

    setTimeout(function () {
      // message.style.visibility = "hidden";
      // message.style.opacity = "0";
      message.classList.remove('displayed')

    }, 2000); // 1000 milisegundos = 1 segundo
  });
};

//#endregion

// Each button going forward conditions

var registerData = {
  userName: "",
  userSurame: "",
  userBirthday: "",
  userGender: "",
  userNationality: "",
  userResidence: "",
  userLanguages: [],
  userSports: [],
  userExperience: "",
  userClubExp: "",
  userClinicExp: "",
  userOtherCoachExp: "",
  userToursJuzge: "",
  userToursOrganized: "",
  userProfessionalExp: "",
  userCompetingNow: "",
  userInternationalExp: "",
  userWeeklyHours: "",
  userPreferredLevel: [],
  userAvailability: "",
  userMobilityPossibility: "",
  userOportunityType: [],
  userExpectedSalary: "",
  userPhoneNumber: "",
  userLinkedin: "",
  userInstagram: "",
  userEmail: "",
  userPass: "",
  coachId: "",
  registerDate: "",
};

//#region 1 info tab

// 1 ---- Info

optionsGenders.forEach((option) => {
  option.addEventListener("click", () => {
    if (option.classList.contains("active")) {
      option.classList.remove("active")
    } else {
      optionsGenders.forEach((option) => {
        option.classList.remove("active");
      });
      option.classList.add("active");
    }
  });
});

nextConditionalInfo.addEventListener("click", (e) => {
  var moveForwardVariable = true;

  userName.value === ""
    ? (moveForwardVariable = false)
    : (registerData.userName = userName.value);
  userSurname.value === ""
    ? (moveForwardVariable = false)
    : (registerData.userSurame = userSurname.value);
  userBirthday.value === ""
    ? (moveForwardVariable = false)
    : (registerData.userBirthday = userBirthday.value);

  // var stopper = true;
  optionsGenders.forEach((field) => {
    if (field.classList.contains("active")) {
      registerData.userGender = field.getAttribute("data-gender");
      // stopper = false;
    }
  });
  // stopper ? (moveForwardVariable = false) : "";

  console.log(registerData);
  console.log(moveForwardVariable);

  moveForwardVariable ? moveForward() : shakeAnimation(e.target);
});

//#endregion

//#region 2 nationality tab

optionsLanguages.forEach((option) => {
  option.addEventListener("click", () => {
    option.classList.toggle("active");
  });
});

nextConditionalNation.addEventListener("click", (e) => {
  var moveForwardVariable = true;

  userNationality.value === ""
    ? (moveForwardVariable = false)
    : (registerData.userNationality = userNationality.value);
  userResidence.value === ""
    ? (moveForwardVariable = false)
    : (registerData.userResidence = userResidence.value);


  registerData.userLanguages = []
  optionsLanguages.forEach((field) => {
    if (field.classList.contains("active")) {
      registerData.userLanguages.push(field.getAttribute("data-language"));
    }
  });

  moveForwardVariable ? moveForward() : shakeAnimation(e.target);
});

//#endregion

//#region 3 sports tab
optionsSports.forEach((option) => {
  option.addEventListener("click", () => {
    option.classList.toggle("active");
  });
});

optionsExperience.forEach((option) => {
  option.addEventListener("click", () => {
    optionsExperience.forEach((option) => {
      option.classList.remove("active");
    });
    option.classList.add("active");
  });
});

nextConditionalSport.addEventListener("click", (e) => {
  var moveForwardVariable = true;

  var stopper = true;

  registerData.userSports = []
  optionsSports.forEach((field) => {
    if (field.classList.contains("active")) {
      registerData.userSports.push(field.getAttribute("data-sport"));
      stopper = false;
    }
  });
  stopper ? (moveForwardVariable = false) : "";

  var stopper2 = true;
  optionsExperience.forEach((field) => {
    if (field.classList.contains("active")) {
      registerData.userExperience = field.getAttribute("data-experience");
      stopper2 = false;
    }
  });
  stopper2 ? (moveForwardVariable = false) : "";

  userAdditionalSport.value === ""
    ? ""
    : registerData.userSports.push(userAdditionalSport.value);

  console.log(registerData);
  moveForwardVariable ? moveForward() : shakeAnimation(e.target);
});

//#endregion

//#region 4 experience one tab

optionsExp.forEach((option) => {
  option.addEventListener("click", () => {
    optionsExp.forEach((option) => {
      option.classList.remove("active");
    });
    option.classList.add("active");
  });
});

optionsClinic.forEach((option) => {
  option.addEventListener("click", () => {
    optionsClinic.forEach((option) => {
      option.classList.remove("active");
    });
    option.classList.add("active");
  });
});

optionsCoaches.forEach((option) => {
  option.addEventListener("click", () => {
    optionsCoaches.forEach((option) => {
      option.classList.remove("active");
    });
    option.classList.add("active");
  });
});

nextConditionalExpOne.addEventListener("click", (e) => {
  var moveForwardVariable = true;

  var stopper1 = true;
  optionsExp.forEach((field) => {
    if (field.classList.contains("active")) {
      registerData.userClubExp = field.getAttribute("data-clubexp");
      stopper1 = false;
    }
  });
  stopper1 ? (moveForwardVariable = false) : "";

  var stopper2 = true;
  optionsClinic.forEach((field) => {
    if (field.classList.contains("active")) {
      registerData.userClinicExp = field.getAttribute("data-clinicexp");
      stopper2 = false;
    }
  });
  stopper2 ? (moveForwardVariable = false) : "";

  var stopper3 = true;
  optionsCoaches.forEach((field) => {
    if (field.classList.contains("active")) {
      registerData.userOtherCoachExp = field.getAttribute("data-othercoachexp");
      stopper3 = false;
    }
  });
  stopper3 ? (moveForwardVariable = false) : "";

  moveForwardVariable ? moveForward() : shakeAnimation(e.target);
});

//#endregion

//#region 5 experience two tab
optionsTourOrg.forEach((option) => {
  option.addEventListener("click", () => {
    optionsTourOrg.forEach((option) => {
      option.classList.remove("active");
    });
    option.classList.add("active");
  });
});

optionsTourJuz.forEach((option) => {
  option.addEventListener("click", () => {
    optionsTourJuz.forEach((option) => {
      option.classList.remove("active");
    });
    option.classList.add("active");
  });
});

nextConditionalExpTwo.addEventListener("click", (e) => {
  var moveForwardVariable = true;

  var stopper1 = true;
  optionsTourOrg.forEach((field) => {
    if (field.classList.contains("active")) {
      registerData.userToursOrganized = field.getAttribute("data-tourorg");
      stopper1 = false;
    }
  });
  stopper1 ? (moveForwardVariable = false) : "";

  var stopper2 = true;
  optionsTourJuz.forEach((field) => {
    if (field.classList.contains("active")) {
      registerData.userToursJuzge = field.getAttribute("data-tourjuz");
      stopper2 = false;
    }
  });
  stopper2 ? (moveForwardVariable = false) : "";

  moveForwardVariable ? moveForward() : shakeAnimation(e.target);
});

//#endregion

//#region 6 experience three tab

optionsProfExp.forEach((option) => {
  option.addEventListener("click", () => {
    optionsProfExp.forEach((option) => {
      option.classList.remove("active");
    });
    option.classList.add("active");
  });
});

optionsCompNow.forEach((option) => {
  option.addEventListener("click", () => {
    optionsCompNow.forEach((option) => {
      option.classList.remove("active");
    });
    option.classList.add("active");
  });
});

optionsIntExp.forEach((option) => {
  option.addEventListener("click", () => {
    optionsIntExp.forEach((option) => {
      option.classList.remove("active");
    });
    option.classList.add("active");
  });
});

nextConditionalExpThree.addEventListener("click", (e) => {
  var moveForwardVariable = true;

  var stopper1 = true;
  optionsProfExp.forEach((field) => {
    if (field.classList.contains("active")) {
      registerData.userProfessionalExp = field.getAttribute("data-profexp");
      stopper1 = false;
    }
  });
  stopper1 ? (moveForwardVariable = false) : "";

  var stopper2 = true;
  optionsCompNow.forEach((field) => {
    if (field.classList.contains("active")) {
      registerData.userCompetingNow = field.getAttribute("data-compnow");
      stopper2 = false;
    }
  });
  stopper2 ? (moveForwardVariable = false) : "";

  var stopper3 = true;
  optionsIntExp.forEach((field) => {
    if (field.classList.contains("active")) {
      registerData.userInternationalExp = field.getAttribute("data-intexp");
      stopper3 = false;
    }
  });
  stopper3 ? (moveForwardVariable = false) : "";

  moveForwardVariable ? moveForward() : shakeAnimation(e.target);
});

//#endregion

//#region 7 preferences one tab

optionsHours.forEach((option) => {
  option.addEventListener("click", () => {
    optionsHours.forEach((option) => {
      option.classList.remove("active");
    });
    option.classList.add("active");
  });
});

optionsLevel.forEach((option) => {
  option.addEventListener("click", () => {
    option.classList.toggle("active");
  });
});

nextConditionalPrefOne.addEventListener("click", (e) => {
  var moveForwardVariable = true;

  var stopper1 = true;
  optionsHours.forEach((field) => {
    if (field.classList.contains("active")) {
      registerData.userWeeklyHours = field.getAttribute("data-hours");
      stopper1 = false;
    }
  });
  stopper1 ? (moveForwardVariable = false) : "";

  var stopper2 = true;
  registerData.userPreferredLevel = []
  optionsLevel.forEach((field) => {
    if (field.classList.contains("active")) {
      registerData.userPreferredLevel.push(field.getAttribute("data-level"));
      stopper2 = false;
    }
  });
  stopper2 ? (moveForwardVariable = false) : "";

  moveForwardVariable ? moveForward() : shakeAnimation(e.target);
});

//#endregion

//#region 8 preferences two tab

optionsStartingTime.forEach((option) => {
  option.addEventListener("click", () => {
    optionsStartingTime.forEach((option) => {
      option.classList.remove("active");
    });
    option.classList.add("active");
  });
});

optionsMobility.forEach((option) => {
  option.addEventListener("click", () => {
    optionsMobility.forEach((option) => {
      option.classList.remove("active");
    });
    option.classList.add("active");
  });
});

nextConditionalPrefTwo.addEventListener("click", (e) => {
  var moveForwardVariable = true;

  var stopper1 = true;
  optionsStartingTime.forEach((field) => {
    if (field.classList.contains("active")) {
      registerData.userAvailability = field.getAttribute("data-startingtime");
      stopper1 = false;
    }
  });
  stopper1 ? (moveForwardVariable = false) : "";

  var stopper2 = true;
  optionsMobility.forEach((field) => {
    if (field.classList.contains("active")) {
      registerData.userMobilityPossibility =
        field.getAttribute("data-mobility");
      stopper2 = false;
    }
  });
  stopper2 ? (moveForwardVariable = false) : "";

  moveForwardVariable ? moveForward() : shakeAnimation(e.target);
});

//#endregion

//#region 9 preferences three tab
optionsOportunity.forEach((option) => {
  option.addEventListener("click", () => {
    option.classList.add("active");
  });
});

optionsSalary.forEach((option) => {
  option.addEventListener("click", () => {
    optionsSalary.forEach((option) => {
      option.classList.remove("active");
    });
    option.classList.add("active");
  });
});

nextConditionalPrefThree.addEventListener("click", (e) => {
  var moveForwardVariable = true;

  var stopper1 = true;
  registerData.userOportunityType = []
  optionsOportunity.forEach((field) => {
    if (field.classList.contains("active")) {
      registerData.userOportunityType.push(
        field.getAttribute("data-oportunity")
      );
      stopper1 = false;
    }
  });
  stopper1 ? (moveForwardVariable = false) : "";

  var stopper2 = true;
  optionsSalary.forEach((field) => {
    if (field.classList.contains("active")) {
      registerData.userExpectedSalary = field.getAttribute("data-salary");
      stopper2 = false;
    }
  });
  stopper2 ? (moveForwardVariable = false) : "";

  moveForwardVariable ? moveForward() : shakeAnimation(e.target);
});

//#endregion

//#region 10 data tab
nextConditionalData.addEventListener("click", (e) => {
  var moveForwardVariable = true;

  userPhoneNumber.value === ""
    ? (moveForwardVariable = false)
    : (registerData.userPhoneNumber = `${userPhoneNumberPrefix.value} ${userPhoneNumber.value}`);
  userLinkedin.value === ""
    ? ""
    : (registerData.userLinkedin = userLinkedin.value);
  userInsta.value === "" ? "" : (registerData.userInsta = userInsta.value);

  moveForwardVariable ? moveForward() : shakeAnimation(e.target);
});

//#endregion

//#region 11 credentials tab

nextConditionalPass.addEventListener("click", (e) => {
  var moveForwardVariablePass = true;
  var moveForwardVariableEmail = true;

  userEmail.value === ""
    ? (moveForwardVariableEmail = false)
    : (registerData.userEmail = userEmail.value);
    
  isPassSafe(userPass.value)
    ? (registerData.userPass = userPass.value)
    : (moveForwardVariablePass = false);

  // Logic for register
  if (moveForwardVariablePass) {

    // Set loading state
    createCoachLoadingIcon.style.visibility = "visible";
    createCoachOkIcon.style.visibility = "hidden";

    // Hold loading at least one additional second
    setTimeout(function () {
      // After the additional second, call create coach
      firebaseCreateCoach(registerData)
        .then((user) => {
        // If coach succesfully created, set userId and register Date to send to Firebase Database
          registerData.coachId = user;
          registerData.registerDate = Date();
          // Send all the data in Firebase Database
          firebaseSaveCoachData(registerData).then(() => {
            moveForward();
          });
        })
        .catch((error) => {
          // If error in creating the coach, stop loading and display error
          createCoachLoadingIcon.style.visibility = "hidden";
          createCoachOkIcon.style.visibility = "visible";
          shakeAnimation(e.target);
          // nonFilledFieldsMessageEmail.style.visibility = "visible";
          // nonFilledFieldsMessageEmail.style.opacity = "1";
          nonFilledFieldsMessageEmail.classList.add('displayed')

          setTimeout(function () {
            // nonFilledFieldsMessageEmail.style.visibility = "hidden";
            // nonFilledFieldsMessageEmail.style.opacity = "0";
            nonFilledFieldsMessageEmail.classList.remove('displayed')

          }, 2000); // 1000 milisegundos = 1 segundo
        });
    }, 1000); // 1000 milisegundos = 1 segundo

  } else {
    // If non valid password, display error
    shakeAnimation(e.target);
    // nonFilledFieldsMessagePass.style.visibility = "visible";
    // nonFilledFieldsMessagePass.style.opacity = "1";
    nonFilledFieldsMessagePass.classList.add('displayed')
    setTimeout(function () {
      // nonFilledFieldsMessagePass.style.visibility = "hidden";
      // nonFilledFieldsMessagePass.style.opacity = "0";
      nonFilledFieldsMessagePass.classList.remove('displayed')
    }, 2000); // 1000 milisegundos = 1 segundo
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

// #region inputCountry2

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
    selectedFlag2.src = `https://flagpedia.net/data/flags/emoji/twitter/256x256/${flag}.png`;
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
          <img class="pn-list-item__flag" src="https://flagpedia.net/data/flags/emoji/twitter/256x256/${flag}.png" />
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

init2(countries);

//#endregion Country2

// #region inputCountry3

const selectContainer3 = document.getElementById("js_pn-select3");
const countrySearchInput3 = document.getElementById("js_search-input3");
const noResultListItem3 = document.getElementById("js_no-results-found3");
const dropdownTrigger3 = document.getElementById("js_trigger-dropdown3");
const phoneNumberInput3 = document.getElementById("js_input-phonenumber3");
const dropdownContainer3 = document.getElementById("js_dropdown3");
const selectedPrefix3 = document.getElementById("js_number-prefix3");
const selectedFlag3 = document.getElementById("js_selected-flag3");
const listContainer3 = document.getElementById("js_list3");

let countryList3;

const init3 = async (countries) => {
  const selectCountry = (e) => {
    const { name, flag, prefix } = e.target.closest("li").dataset;
    setNewSelected(prefix, flag, name);
    closeDropdown();
    addSelectedModifier(flag);
  };

  // -------------- Update the 'Selected country flag' to reflect changes

  const setNewSelected = (prefix, flag, name) => {
    selectedFlag3.src = `https://flagpedia.net/data/flags/emoji/twitter/256x256/${flag}.png`;
    selectedPrefix3.value = `${name}`;
    selectContainer3.style.setProperty("--prefix-length", prefix.length);
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
    selectContainer3.classList.remove("pn-select--open");
    listContainer3.scrollTop = 0;
    countrySearchInput3.value = "";
    countryList3.search();
    phoneNumberInput3.focus();
    removeDropdownEvents();
  };

  // -------------- Open dropdown

  const openDropdown = () => {
    selectContainer3.classList.add("pn-select--open");
    attatchDropdownEvents();
  };

  // -------------- Dropdown event listeners

  let countdown;

  const closeOnMouseLeave = () => {
    countdown = setTimeout(() => closeDropdown(), 2000);
  };

  const clearTimeOut = () => clearTimeout(countdown);

  const attatchDropdownEvents = () => {
    dropdownContainer3.addEventListener("mouseleave", closeOnMouseLeave);
    dropdownContainer3.addEventListener("mouseenter", clearTimeOut);
  };

  const removeDropdownEvents = () => {
    clearTimeout(countdown);
    dropdownContainer3.removeEventListener("mouseleave", closeOnMouseLeave);
    dropdownContainer3.removeEventListener("mouseenter", clearTimeOut);
  };

  // -------------- Close when clicked outside the dropdown

  document.addEventListener("click", (e) => {
    if (
      e.target !== selectContainer3 &&
      !selectContainer3.contains(e.target) &&
      selectContainer3.classList.contains("pn-select--open")
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
        } js_pn-list-item-3" data-name="${name}" data-flag="${flag}" data-prefix="${prefix}" tabindex="0" role="button" aria-pressed="false">
          <img class="pn-list-item__flag" src="https://flagpedia.net/data/flags/emoji/twitter/256x256/${flag}.png" />
          <span class="pn-list-item__country js_country-name">${name}</span>
        </li>`;

        listContainer3.innerHTML += element;

        if (index === countries.length - 1) {
          resolve();
        }
      });
    });

  // -------------- After all the listItems are created we loop over the items to attach the eventListeners

  const attatchListItemEventListeners = () =>
    new Promise((resolve, _) => {
      const listItems = [
        ...document.getElementsByClassName("js_pn-list-item-3"),
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

  const init3iateList = () => {
    countryList3 = new List("js_pn-select3", {
      valueNames: ["js_country-name", "js_country-prefix"],
    });

    // Add 'updated' listener for search results
    countryList3.on("updated", (list) => {
      if (list.matchingItems.length < 5)
        listContainer3.classList.toggle("pn-list--no-scroll");

      noResultListItem3.style.display =
        list.matchingItems.length > 0 ? "none" : "block";
    });
  };

  await createList();
  await attatchListItemEventListeners();
  init3iateList();

  dropdownTrigger3.addEventListener("click", () => {
    const isOpen = selectContainer3.classList.contains("pn-select--open");
    isOpen ? closeDropdown() : openDropdown();
  });
};

init3(countries);

//#endregion Country3

// #region inputPhoneNumber

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

init(countries);

//#endregion PhoneNumber
