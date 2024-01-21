import { firebaseFetchArticleById } from "./news-showpost-firebase.js";

// URL de ejemplo
var url = window.location.href;

// Obtener la cadena de consulta
var id = url.split("?")[1];

// var id = 'GulRQCjqBCuPFXfo2riU'

// Tags language mapping
function getMapping() {
  const url = window.location.href;
  if (url.includes("/english/")) {
    return {
      noticias: "news",
      tenis: "tennis",
      torneos: "tournaments"
      // ... otros mapeos si son necesarios
    };
  } else {
    // Mapeo por defecto (o simplemente devuelve la palabra original si no hay mapeo)
    return {};
  }
}

// console.log(firebaseFetchArticle(id))

var loaderContainer = document.querySelector("#article-loader-container");
var showTitle = document.querySelector("#article-title");
var showContent = document.querySelector("#article-content");
var showDateAndAuthor = document.querySelector("#article-dateandauthor");
// var showAuthor = document.querySelector('#article-author')
// var showTags = document.querySelector('#article-tags')
var showTags = document.querySelectorAll(".article-tag");

firebaseFetchArticleById(id).then((result) => {
  console.log(result.author);
  showTitle.innerHTML = result.title;
  showContent.innerHTML = result.content;

  // Show reduced date
  var fullDate = result.date;
  var regex = /([A-Za-z]{3} \d{1,2})/;
  var match = fullDate.match(regex);
  showDateAndAuthor.innerHTML = `${match[0]} | ${result.author}`;

  // showAuthor.innerHTML = result.author;

  // Tags with language mapping
  const mapping = getMapping();
  result.tags.forEach((element, id) => {
    let mappedElement = mapping[element] || element;
    showTags[id].innerHTML = mappedElement;
    showTags[id].style.display = 'flex';
  });

  const element = document.querySelector("#article-content > div.ql-editor");
  element.setAttribute("contenteditable", "false");

  // result.Title =
  loaderContainer.style.display = "none";
});
