import { checkIfUserAdmin } from "./adminlist.js";
import { firebaseGetAllClubs } from "./dashboard-firebase.js";
import { firebaseGetAllCoaches } from "./dashboard-firebase.js";

//#region general variables

let recommendatorsCounter = {
  laura_marti: 0,
  sergi_perez: 0,
  javier_marti: 0,
  iñigo_jofre: 0,
  miguel_semmler: 0,
  pablo_franco: 0,
  sergio_cerdeña: 0,
  global_college: 0,
  adriana_armendariz: 0,
  pablo_aycart: 0,
  radu_sanchez: 0,
};

//#endregion

//#region getData Clubs & Coaches

var clubsCounter = {
  total: 0,
  yes: 0,
  prx: 0,
  not: 0,
};

var coachesCounter = {
  total: 0,
  regular: 0,
  head: 0,
  student: 0,
  pro: 0,
};

firebaseGetAllClubs().then((outputClub) => {
  let dateCounts = {};
  let clubsList = []; // Array para almacenar los registros de clubs
  let clubsCounter = {
    total: 0,
    prx: 0,
    yes: 0,
    not: 0,
    // Agrega otros estados aquí si los hay
  };

  outputClub.forEach((club) => {
    clubsCounter.total++;
    switch (club.clubState) {
      case "prx":
        clubsCounter.prx++;
        break;
      case "yes":
        clubsCounter.yes++;
        break;
      case "not":
        clubsCounter.not++;
        break;
      // Si hay más estados, se pueden agregar más casos aquí
    }

    switch (club.clubRecommendation) {
      case "laura-marti":
        recommendatorsCounter.laura_marti++;
        break;
      case "sergi-perez":
        recommendatorsCounter.sergi_perez++;
        break;
      case "javier-marti":
        recommendatorsCounter.javier_marti++;
        break;
      case "iñigo-jofre":
        recommendatorsCounter.iñigo_jofre++;
        break;
      case "miguel-semmler":
        recommendatorsCounter.miguel_semmler++;
        break;
      case "pablo-franco":
        recommendatorsCounter.pablo_franco++;
        break;
      case "sergio-cerdeña":
        recommendatorsCounter.sergio_cerdeña++;
        break;
      case "global-college":
        recommendatorsCounter.global_college++;
        break;
      case "adriana-armendariz":
        recommendatorsCounter.adriana_armendariz++;
        break;
      case "pablo-aycart":
        recommendatorsCounter.pablo_aycart++;
        break;
      case "radu-sanchez":
        recommendatorsCounter.radu_sanchez++;
        break;
      // Agrega más casos si es necesario
    }

    let date = new Date(club.clubRegisterDate);
    let formattedDate = `${date.getDate().toString().padStart(2, "0")}-${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${date.getFullYear()}`;

    if (!dateCounts[formattedDate]) {
      dateCounts[formattedDate] = 0;
    }
    dateCounts[formattedDate]++;

    // Añadir el club al array con su fecha de registro
    clubsList.push({
      ...club,
      formattedRegisterDate: date,
    });
  });

  // Ordenar el array de clubs por fecha de registro en orden descendente y seleccionar los 6 primeros
  let lastClubs = clubsList
    .sort((a, b) => b.formattedRegisterDate - a.formattedRegisterDate)
    .slice(0, 6);

  updateTotalClubs(clubsCounter.total);
  updateLastClubs(lastClubs);
  updateLineChartMonth(dateCounts, true);
  updateLineChartYear(dateCounts, true);
  updateClubsDoughnut(clubsCounter);
});

firebaseGetAllCoaches().then((outputCoach) => {
  let dateCounts = {};
  let coachesList = []; // Array para almacenar los registros de coaches
  let coachesCounter = {
    total: 0,
    regular: 0,
    head: 0,
    student: 0,
    pro: 0,
  };

  outputCoach.forEach((coach) => {
    coachesCounter.total++;
    switch (coach.userAdminType) {
      case "regular":
        coachesCounter.regular++;
        break;
      case "head":
        coachesCounter.head++;
        break;
      case "student":
        coachesCounter.student++;
        break;
      case "pro":
        coachesCounter.pro++;
        break;
      // Si hay más estados, se pueden agregar más casos aquí
    }

    switch (coach.userRecommendation) {
      case "laura-marti":
        recommendatorsCounter.laura_marti++;
        break;
      case "sergi-perez":
        recommendatorsCounter.sergi_perez++;
        break;
      case "javier-marti":
        recommendatorsCounter.javier_marti++;
        break;
      case "iñigo-jofre":
        recommendatorsCounter.iñigo_jofre++;
        break;
      case "miguel-semmler":
        recommendatorsCounter.miguel_semmler++;
        break;
      case "pablo-franco":
        recommendatorsCounter.pablo_franco++;
        break;
      case "sergio-cerdeña":
        recommendatorsCounter.sergio_cerdeña++;
        break;
      case "global-college":
        recommendatorsCounter.global_college++;
        break;
      case "adriana-armendariz":
        recommendatorsCounter.adriana_armendariz++;
        break;
      case "pablo-aycart":
        recommendatorsCounter.pablo_aycart++;
        break;
      case "radu-sanchez":
        recommendatorsCounter.radu_sanchez++;
        break;
      // Agrega más casos si es necesario
    }

    // Obtener la fecha de registro y formatearla a dd-mm-yyyy
    let date = new Date(coach.registerDate);
    let formattedDate = `${date.getDate().toString().padStart(2, "0")}-${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${date.getFullYear()}`;

    // Incrementar el contador para esa fecha
    if (!dateCounts[formattedDate]) {
      dateCounts[formattedDate] = 0;
    }
    dateCounts[formattedDate]++;

    // Añadir el coach al array con su fecha de registro
    coachesList.push({
      ...coach,
      formattedRegisterDate: date,
    });
  });

  // Ordenar el array de coaches por fecha de registro en orden descendente y seleccionar los 8 primeros
  let lastCoaches = coachesList
    .sort((a, b) => b.formattedRegisterDate - a.formattedRegisterDate)
    .slice(0, 6);

  updateTotalCoaches(coachesCounter.total);
  updateBarWidths(recommendatorsCounter);
  updateLastCoaches(lastCoaches);
  updateLineChartMonth(dateCounts, false); // Actualiza con datos de coaches
  updateLineChartYear(dateCounts, false); // Actualiza con datos de coaches
  updateCouachesDoughnut(coachesCounter);
});

//#endregion

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

checkIfUserAdmin(valorCookieId) ? "ok" : (window.location.href = "404.html");

//#endregion

//#region donut charts

// Sobrescribir la configuración predeterminada de la leyenda antes de crear el gráfico
Chart.overrides.doughnut.plugins.legend = {
  display: false,
};

var updateCouachesDoughnut = (inputData) => {
  document.querySelector("#coaches-regular").innerHTML = inputData.regular;
  document.querySelector("#coaches-head").innerHTML = inputData.head;
  document.querySelector("#coaches-student").innerHTML = inputData.student;
  document.querySelector("#coaches-pro").innerHTML = inputData.pro;

  const ctxCoaches = document
    .getElementById("myDoughnutChartCoaches")
    .getContext("2d");
  const myDoughnutChartCoaches = new Chart(ctxCoaches, {
    type: "doughnut",
    data: {
      labels: ["Regular Coach", "Head Coach", "Student Athlete", "Pro Player"],
      datasets: [
        {
          data: [
            inputData.regular,
            inputData.head,
            inputData.student,
            inputData.pro,
          ],
          backgroundColor: ["#025B7B", "#acd6ce", "#94bac8", "#696969"],
          // borderColor: 'rgba(0,0,0,0)',
          // borderDash: [5, 10],
          // borderDashOffset: 2.5,
          borderRadius: 20,
          borderWidth: 3,
          spacing: 10,
        },
      ],
    },
    options: {
      responsive: false,
      cutout: "66%",
    },
  });
};

var updateClubsDoughnut = (inputData) => {
  document.querySelector("#clubs-yes").innerHTML = inputData.yes;
  document.querySelector("#clubs-prx").innerHTML = inputData.prx;
  document.querySelector("#clubs-not").innerHTML = inputData.not;

  const ctxClubs = document
    .getElementById("myDoughnutChartClubs")
    .getContext("2d");
  const myDoughnutChartClubs = new Chart(ctxClubs, {
    type: "doughnut",
    data: {
      labels: ["Buscando", "En duda", "Sin buscar"],
      datasets: [
        {
          data: [inputData.yes, inputData.prx, inputData.not],
          backgroundColor: ["#025B7B", "#acd6ce", "#94BAC8"],
          // borderColor: 'rgba(0,0,0,0)',
          // borderDash: [5, 10],
          // borderDashOffset: 2.5,
          borderRadius: 20,
          borderWidth: 3,
          spacing: 10,
        },
      ],
    },
    options: {
      responsive: false,
      cutout: "66%",
    },
  });
};

//#endregion

//#region line chart month

const lineChartMonth = document
  .getElementById("myLineChartMonth")
  .getContext("2d");
let myLineChartInstanceMonth; // Variable global para almacenar la instancia del gráfico

const calculateLast15DaysTotals = (dateCounts) => {
  let totals = Array(15).fill(0);
  let currentDate = new Date();

  for (let i = 0; i < 15; i++) {
    let date = new Date(currentDate);
    date.setDate(date.getDate() - i);

    let formattedDate = `${date.getDate().toString().padStart(2, "0")}-${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${date.getFullYear()}`;

    if (dateCounts[formattedDate]) {
      totals[14 - i] = dateCounts[formattedDate]; // Llenar el array al revés para que los días más recientes estén al final
    }
  }

  return totals;
};

var updateLineChartMonth = (data, isClubsData) => {
  let last15DaysTotals = calculateLast15DaysTotals(data);

  // Generar etiquetas para los últimos 15 días
  let labels = Array.from({ length: 15 }, (_, i) => {
    let date = new Date();
    date.setDate(date.getDate() - (14 - i));
    return `${date.getDate()}/${date.getMonth() + 1}`;
  });

  if (!myLineChartInstanceMonth) {
    myLineChartInstanceMonth = new Chart(lineChartMonth, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            data: isClubsData ? last15DaysTotals : Array(15).fill(0),
            fill: false,
            borderColor: "#65a79b",
            tension: 0.4,
            pointRadius: 5,
            pointBackgroundColor: "#65a79b",
            pointBorderColor: "white",
          },
          {
            data: isClubsData ? Array(15).fill(0) : last15DaysTotals,
            fill: false,
            borderColor: "#025B7B",
            tension: 0.4,
            pointRadius: 5,
            pointBackgroundColor: "#025B7B",
            pointBorderColor: "white",
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              drawBorder: false,
              // display: false
            },
          },
          x: {
            grid: {
              drawBorder: false,
              display: false,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  } else {
    // Actualiza solo el conjunto de datos correspondiente
    if (isClubsData) {
      myLineChartInstanceMonth.data.datasets[0].data = last15DaysTotals;
    } else {
      myLineChartInstanceMonth.data.datasets[1].data = last15DaysTotals;
    }
    myLineChartInstanceMonth.update();
  }
};

// Llamadas a la función updateLineChart
// Suponiendo que clubsDates y coachesDates ya están definidos y procesados
// updateLineChart(clubsDates, true); // Actualiza con datos de clubs
// updateLineChart(coachesDates, false); // Actualiza con datos de coaches

//#endregion

//#region line chart year

const lineChartYear = document
  .getElementById("myLineChartYear")
  .getContext("2d");
let myLineChartInstanceYear; // Variable global para almacenar la instancia del gráfico

const calculateLast12MonthsTotals = (dateCounts) => {
  let totals = Array(12).fill(0);
  let currentDate = new Date();

  for (let i = 0; i < 12; i++) {
    let month = currentDate.getMonth() - i;
    let year = currentDate.getFullYear();

    if (month < 0) {
      month += 12; // Ajustar cuando el mes es negativo
      year--; // Retroceder un año
    }

    Object.keys(dateCounts).forEach((date) => {
      let [day, monthDate, yearDate] = date.split("-").map(Number);
      if (monthDate - 1 === month && yearDate === year) {
        totals[11 - i] += dateCounts[date]; // Llenar el array al revés para que los meses más recientes estén al final
      }
    });
  }

  return totals;
};

var updateLineChartYear = (data, isClubsData) => {
  let last12MonthsTotals = calculateLast12MonthsTotals(data);

  // Generar etiquetas para los últimos 12 meses
  let labels = Array.from({ length: 12 }, (_, i) => {
    let date = new Date();
    date.setMonth(date.getMonth() - (11 - i));
    return `${date.toLocaleString("es", {
      month: "short",
    })}-${date.getFullYear()}`;
  });

  if (!myLineChartInstanceYear) {
    myLineChartInstanceYear = new Chart(lineChartYear, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            data: isClubsData ? last12MonthsTotals : Array(12).fill(0),
            fill: false,
            borderColor: "#65a79b",
            tension: 0.4,
            pointRadius: 5,
            pointBackgroundColor: "#65a79b",
            pointBorderColor: "white",
          },
          {
            data: isClubsData ? Array(12).fill(0) : last12MonthsTotals,
            fill: false,
            borderColor: "#025B7B",
            tension: 0.4,
            pointRadius: 5,
            pointBackgroundColor: "#025B7B",
            pointBorderColor: "white",
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              drawBorder: false,
              // display: false
            },
          },
          x: {
            grid: {
              drawBorder: false,
              display: false,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  } else {
    // Actualiza solo el conjunto de datos correspondiente
    if (isClubsData) {
      myLineChartInstanceYear.data.datasets[0].data = last12MonthsTotals;
    } else {
      myLineChartInstanceYear.data.datasets[1].data = last12MonthsTotals;
    }
    myLineChartInstanceYear.update();
  }
};

// Llamadas a la función updateLineChart
// Suponiendo que clubsDates y coachesDates ya están definidos y procesados
// updateLineChart(clubsDates, true); // Actualiza con datos de clubs
// updateLineChart(coachesDates, false); // Actualiza con datos de coaches

//#endregion

//#region recommendators

function updateBarWidths(recommendatorsCounter) {
  let maxValue = Math.max(...Object.values(recommendatorsCounter));

  for (let recommendator in recommendatorsCounter) {
    // Calcula el porcentaje
    let percentage = (recommendatorsCounter[recommendator] / maxValue) * 100;

    // Reemplaza los guiones bajos con guiones medios en el ID
    let recommendatorId = recommendator.replace(/_/g, "-");

    // Encuentra el elemento del DOM correspondiente y actualiza el ancho
    let barElement = document.querySelector(`#${recommendatorId} .recommendator-bar`);
    let valueElement = document.querySelector(`#${recommendatorId} .recommendator-value`); // Línea agregada

    if (barElement && valueElement) {
      barElement.style.width = `${percentage}%`;
      valueElement.textContent = recommendatorsCounter[recommendator]; // Línea agregada
    }
  }

  // Obtiene el texto del usuario logueado
  var loggedUserText = document
    .getElementById("logged-user-text")
    .textContent.trim()
    .toLowerCase();

  // Encuentra todos los elementos con la clase 'recommendator-element'
  var recommendatorElements = document.querySelectorAll(".recommendator-element");

  recommendatorElements.forEach(function (elem) {
    // Obtiene el nombre del recomendador del elemento actual
    var recommendatorName = elem
      .querySelector(".recommendator-name")
      .textContent.trim()
      .toLowerCase();

    // Verifica si el texto del usuario logueado contiene el nombre del recomendador
    if (loggedUserText.includes(recommendatorName)) {
      // Encuentra el elemento de la barra del recomendador y cambia su color
      var recommendatorBar = elem.querySelector(".recommendator-bar");
      var recommendatorBarStart = elem.querySelector(".recommendator-bar-start");
      recommendatorBar.style.backgroundColor = "#025b7b";
      recommendatorBarStart.style.backgroundColor = "#025b7b";
    }
  });
}



//#endregion

//#region last registered

function updateLastCoaches(lastCoaches) {
  const container = document.getElementById("lastCoachesContainer");

  // Limpiar el contenedor antes de agregar nuevos elementos
  container.innerHTML = '<div class="box-label">Últimos coaches</div>';

  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  lastCoaches.forEach((coach) => {
    const coachElement = document.createElement("div");
    coachElement.className = "last-registered-row";

    const nameAndIconDiv = document.createElement("div");
    nameAndIconDiv.className = "nameandicon";

    const iconDiv = document.createElement("div");
    iconDiv.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="17" viewBox="0 0 15 17" fill="none">
        <path d="M13.9112 15.4845C13.9112 14.3615 13.9112 13.8 13.773 13.3431C13.462 12.3143 12.6595 11.5093 11.6341 11.1972C11.1786 11.0586 10.6189 11.0586 9.49949 11.0586H5.48885C4.36943 11.0586 3.80972 11.0586 3.35427 11.1972C2.32883 11.5093 1.52637 12.3143 1.21531 13.3431C1.07715 13.8 1.07715 14.3615 1.07715 15.4845M11.1037 4.62111C11.1037 6.621 9.48768 8.24223 7.49417 8.24223C5.50066 8.24223 3.8846 6.621 3.8846 4.62111C3.8846 2.62123 5.50066 1 7.49417 1C9.48768 1 11.1037 2.62123 11.1037 4.62111Z" stroke="#025B7B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;

    const nameDiv = document.createElement("div");
    nameDiv.textContent = `${coach.userName} ${coach.userSurname}`; // Nombre y apellido del coach

    nameAndIconDiv.appendChild(iconDiv);
    nameAndIconDiv.appendChild(nameDiv);

    const dateDiv = document.createElement("div");
    dateDiv.className = "date";
    const coachDate = new Date(coach.registerDate);

    // Comprobar si la fecha del coach es la misma que la fecha actual
    if (
      coachDate.getDate() === currentDay &&
      coachDate.getMonth() + 1 === currentMonth &&
      coachDate.getFullYear() === currentYear
    ) {
      // Mostrar la hora si es el día actual
      dateDiv.textContent = `${coachDate
        .getHours()
        .toString()
        .padStart(2, "0")}:${coachDate
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;
    } else {
      // Mostrar la fecha en formato dd/mm si no es el día actual
      dateDiv.textContent = `${coachDate
        .getDate()
        .toString()
        .padStart(2, "0")}/${(coachDate.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;
    }

    coachElement.appendChild(nameAndIconDiv);
    coachElement.appendChild(dateDiv);

    container.appendChild(coachElement);
  });

  // Añadir el enlace "Ver tabla de coaches" al final del contenedor
  const linkElement = document.createElement("a");
  linkElement.href = "coaches-table.html";
  linkElement.className = "go-to-table";
  linkElement.innerHTML = `Ver tabla de coaches<svg xmlns="http://www.w3.org/2000/svg" width="6" height="10" viewBox="0 0 6 10" fill="none">
          <path d="M1 9L5 5L1 1" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;

  container.appendChild(linkElement);
}

function updateLastClubs(lastClubs) {
  const container = document.getElementById("lastClubsContainer");

  // Limpiar el contenedor antes de agregar nuevos elementos
  container.innerHTML = '<div class="box-label">Últimos clubs</div>';

  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  lastClubs.forEach((club) => {
    const clubElement = document.createElement("div");
    clubElement.className = "last-registered-row";

    const nameAndIconDiv = document.createElement("div");
    nameAndIconDiv.className = "nameandicon";

    // Aquí puedes insertar tu SVG o cualquier ícono que represente al club
    const iconDiv = document.createElement("div");
    iconDiv.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="18" viewBox="0 0 15 18" fill="none">
      <path d="M6.93429 16.7292C7.11188 16.8332 7.20067 16.8851 7.32598 16.9121C7.42323 16.933 7.56511 16.933 7.66236 16.9121C7.78767 16.8851 7.87646 16.8332 8.05405 16.7292C9.61663 15.8147 13.9112 12.942 13.9112 8.9922V5.14384C13.9112 4.50048 13.9112 4.1788 13.8063 3.90229C13.7136 3.65801 13.5631 3.44005 13.3676 3.26724C13.1464 3.07163 12.8461 2.95868 12.2456 2.73278L7.9448 1.11481C7.77804 1.05207 7.69466 1.02071 7.60889 1.00827C7.5328 0.997243 7.45554 0.997243 7.37945 1.00827C7.29367 1.02071 7.2103 1.05207 7.04354 1.11481L2.74269 2.73278C2.14221 2.95868 1.84197 3.07163 1.62072 3.26724C1.42526 3.44005 1.27469 3.65801 1.18203 3.90229C1.07715 4.1788 1.07715 4.50048 1.07715 5.14384V8.9922C1.07715 12.942 5.37171 15.8147 6.93429 16.7292Z" stroke="#025B7B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`; // Inserta tu SVG aquí

    const nameDiv = document.createElement("div");
    nameDiv.textContent = club.clubName; // Nombre del club

    nameAndIconDiv.appendChild(iconDiv);
    nameAndIconDiv.appendChild(nameDiv);

    const dateDiv = document.createElement("div");
    dateDiv.className = "date";
    const clubDate = new Date(club.clubRegisterDate);

    // Comprobar si la fecha del club es la misma que la fecha actual
    if (
      clubDate.getDate() === currentDay &&
      clubDate.getMonth() + 1 === currentMonth &&
      clubDate.getFullYear() === currentYear
    ) {
      // Mostrar la hora si es el día actual
      dateDiv.textContent = `${clubDate
        .getHours()
        .toString()
        .padStart(2, "0")}:${clubDate
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;
    } else {
      // Mostrar la fecha en formato dd/mm si no es el día actual
      dateDiv.textContent = `${clubDate
        .getDate()
        .toString()
        .padStart(2, "0")}/${(clubDate.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;
    }

    clubElement.appendChild(nameAndIconDiv);
    clubElement.appendChild(dateDiv);

    container.appendChild(clubElement);
  });

  // Añadir el enlace "Ver tabla de clubs" al final del contenedor
  const linkElement = document.createElement("a");
  linkElement.href = "clubs-table.html"; // Asegúrate de que esta es la URL correcta
  linkElement.className = "go-to-table";
  linkElement.innerHTML = `Ver tabla de clubs<svg xmlns="http://www.w3.org/2000/svg" width="6" height="10" viewBox="0 0 6 10" fill="none">
        <path d="M1 9L5 5L1 1" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;

  container.appendChild(linkElement);
}

//#endregion

//#region totals

var updateTotalClubs = (total) => {
  var number = document.querySelector(".total-number-clubs");
  number.innerHTML = total;
};

var updateTotalCoaches = (total) => {
  var number = document.querySelector(".total-number-coaches");
  number.innerHTML = total;
};

//#endregion
