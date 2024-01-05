import { checkIfUserAdmin } from "./adminlist.js"


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

//#region donut charts 

// Sobrescribir la configuración predeterminada de la leyenda antes de crear el gráfico
Chart.overrides.doughnut.plugins.legend = {
    display: false
};

const ctxCoaches = document.getElementById("myDoughnutChartCoaches").getContext("2d");
const myDoughnutChartCoaches = new Chart(ctxCoaches, {
  type: "doughnut",
  data: {
    labels: ["Regular Coach", "Head Coach", "Student Athlete", "Pro Player"],
    datasets: [
      {
        data: [10, 20, 30, 40],
        backgroundColor: ["#1C1C1C", "#acd6ce", "#025B7B", "#94BAC8"],
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

const ctxClubs = document.getElementById("myDoughnutChartClubs").getContext("2d");
const myDoughnutChartClubs = new Chart(ctxClubs, {
  type: "doughnut",
  data: {
    labels: ["Buscando", "En duda", "Sin buscar"],
    datasets: [
      {
        data: [10, 20, 30],
        backgroundColor: ["#1C1C1C", "#acd6ce", "#94BAC8"],
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

//#endregion

//#region line chart 
const lineChart = document.getElementById("myLineChart").getContext("2d");

new Chart(lineChart, {
    type: 'line',
    data: {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril'],
        datasets: [{
            data: [10, 20, 15, 30],
            fill: false,
            borderColor: '#94BAC8',
            tension: 0.4,
            pointRadius: 5, // Tamaño de los puntos
            pointBackgroundColor: '#94BAC8', // Color de relleno de los puntos
            pointBorderColor: 'white' // Color del borde de los puntos
        },
        {
            data: [5, 15, 25, 20],
            fill: false,
            borderColor: '#025B7B',
            tension: 0.4,
            pointRadius: 5, // Tamaño de los puntos
            pointBackgroundColor: '#025B7B', // Color de relleno de los puntos
            pointBorderColor: 'white' // Color del borde de los puntos
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    drawBorder: false,
                    // display: false
                }
            },
            x: {
                grid: {
                    drawBorder: false,
                    display: false
                }
            }
        },
        plugins: {
            legend: {
                display: false
            }
        }
    }
});
//#endregion






