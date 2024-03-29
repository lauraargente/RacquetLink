import { firebaseFetchArticlesByDate } from "../js/news-allposts-firebase.js";
import { firebaseFetchArticleById } from "../../js/news-showpost-firebase.js";
import { firebaseGetArticleNumber } from "../../js/news-createpost-firebase.js";
import { checkIfUserAdmin } from "../../js/adminlist.js";

var loadmoreButton = document.querySelector("#loadmore");

var arrayOfArticlesIds = [];
var referenceArticle;

var loadingContainer = document.querySelector("#articles-loading-display");

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

if (checkIfUserAdmin(valorCookieId)) {
  ("ok");
} else {
  var createArticle = document.querySelector("#createNew");
  createArticle.style.display = "none";
}

//#endregion

firebaseGetArticleNumber().then((referenceArticleToLoadFrom) => {
  firebaseFetchArticlesByDate(referenceArticleToLoadFrom).then(
    ([outputData, newReferenceArticle]) => {
      // For each ID, get the data of the article
      outputData.forEach((element) => {
        arrayOfArticlesIds.push(element);
        firebaseFetchArticleById(element).then((articleData) => {
          // For each article data, inject in the page
          injectArticleFromData(articleData);
        });
      });
      // Set a new reference article for further loading
      referenceArticle = newReferenceArticle;
    }
  );
});

loadmoreButton.addEventListener("click", () => {
  // Get articles ID by reference Article (not Date actually, to be updated)
  firebaseFetchArticlesByDate(referenceArticle - 1).then(
    ([outputData, newReferenceArticle]) => {
      // For each ID, get the data of the article
      outputData.forEach((element) => {
        arrayOfArticlesIds.push(element);
        firebaseFetchArticleById(element).then((articleData) => {
          // For each article data, inject in the page
          injectArticleFromData(articleData);
        });
      });
      // Set a new reference article for further loading
      referenceArticle = newReferenceArticle;
    }
  );
});

var createNew = document.querySelector("#createNew");

createNew.addEventListener("click", () => {
  window.location.href = "news-createpost";
});

var articleIteration = 0;
var currentHref = window.location.href;

var injectArticleFromData = (articleToPrevArray) => {
  console.log(articleToPrevArray.articleNumber);

  if (articleToPrevArray.articleNumber === 1) {
    // loadmoreButton.style.display = 'none'
    loadmoreButton.style.opacity = "0";
    loadmoreButton.style.pointerEvents = "none";
  }

  var newDiv = document.createElement("a");
  newDiv.classList.add("previsualizercontainer");
  newDiv.href = `news-post?${arrayOfArticlesIds[articleIteration]}`;
  loadmoreButton.insertAdjacentElement("beforebegin", newDiv);

  // if (articleIteration % 2 === 0) {
  newDiv.innerHTML = `
    <div class="previsualizertextcontainer _${articleIteration}">
    <div class="prev-dateandauthor _${articleIteration}" class="prev-item">Oct 21 | Diego Colino</div>
    <div class="prev-title _${articleIteration}" class="prev-item">Aquí va el título</div>
    <div class="prev-content _${articleIteration}" class="prev-item">Aquí va el contenido, lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incAquí va el contenido, lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incAquí va el contenido, lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incAquí va el contenido, lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incAquí va el contenido, lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incAquí va el contenido, lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor inc</div>
    <div class="prev-tags _${articleIteration}" class="prev-item">
        <div class="prev-tag _${articleIteration}"></div>
        <div class="prev-tag _${articleIteration}"></div>
        <div class="prev-tag _${articleIteration}"></div>
        <div class="prev-tag _${articleIteration}"></div>
        <div class="prev-tag _${articleIteration}"></div>
    </div>
    </div>
    <div class="previsualizerimagecontainer _${articleIteration}">
      <div class="prev-image _${articleIteration}" class="prev-item"><img src=""></div>
    </div>
  `;

  var articleIterationString = articleIteration.toString();

  // setPrevisualizer obtiene los datos del artículo y muestra una previsualización idéntica a la que aparecerá en la página de artículos
  var previewDateAndAuthor = document.querySelector(
    ".prev-dateandauthor._" + articleIterationString
  );
  var previewTitle = document.querySelector(
    ".prev-title._" + articleIterationString
  );
  var previewContent = document.querySelector(
    ".prev-content._" + articleIterationString
  );
  var previewTags = document.querySelectorAll(
    ".prev-tag._" + articleIterationString
  );
  var previewImage = document.querySelector(
    ".prev-image._" + articleIterationString + " > img"
  );

  // Date and Author
  var fullDate = articleToPrevArray.date.toString();
  var regex = /([A-Za-z]{3} \d{1,2})/;
  var match = fullDate.match(regex);
  previewDateAndAuthor.innerHTML = `${match[0]} | ${articleToPrevArray.author}`;

  // Title
  previewTitle.innerHTML = `${articleToPrevArray.title}`;

  // Content
  previewContent.innerHTML = articleToPrevArray.content;
  var articleContent = document.querySelector(
    ".prev-content._" + articleIterationString
  );
  var pElements = articleContent.getElementsByTagName("p");
  // Image
  for (var i = 0; i < pElements.length; i++) {
    if (pElements[i].querySelector("img")) {
      var imgContent = pElements[i].querySelector("img");
      var src = imgContent.getAttribute("src");
      previewImage.setAttribute("src", src);
      break;
    }
  }
  for (var i = 0; i < pElements.length; i++) {
    var textContent = pElements[i].textContent;
    if (!(textContent === "")) {
      previewContent.innerHTML = textContent;
      console.log(textContent);
      break;
    }
  }

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

  const mapping = getMapping();

  // Tags
  previewTags.forEach((tag, id) => {
    if (articleToPrevArray.tags[id]) {
      tag.style.display = "flex";
      let originalWord = articleToPrevArray.tags[id];
      let mappedWord = mapping[originalWord] || originalWord;
      tag.innerHTML = mappedWord;
    } else {
      tag.style.display = "none";
      tag.innerHTML = "";
    }
  });

  // Hiding the loading container
  loadingContainer.style.display = "none";

  articleIteration = articleIteration + 1;
};
