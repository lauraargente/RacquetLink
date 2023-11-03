import { firebaseFetchArticlesByDate } from "./news-allposts-firebase.js"
import { firebaseFetchArticleById } from "./news-showpost-firebase.js"
import { firebaseGetArticleNumber } from "./news-createpost-firebase.js";

var loadmoreButton = document.querySelector('#loadmore')

var arrayOfArticlesIds = []
var referenceArticle

var loadingContainer = document.querySelector('#articles-loading-display')

firebaseGetArticleNumber()
  .then((referenceArticleToLoadFrom) => {
    firebaseFetchArticlesByDate(referenceArticleToLoadFrom)
      .then(([outputData, newReferenceArticle]) => {
        // For each ID, get the data of the article
        outputData.forEach(element => {
          arrayOfArticlesIds.push(element)
          firebaseFetchArticleById(element)
            .then((articleData) => {
              // For each article data, inject in the page
              injectArticleFromData(articleData)
            })
        });
        // Set a new reference article for further loading
        referenceArticle = newReferenceArticle
      })
  })

loadmoreButton.addEventListener('click', () => {
  // Get articles ID by reference Article (not Date actually, to be updated)
  firebaseFetchArticlesByDate(referenceArticle - 1)
    .then(([outputData, newReferenceArticle]) => {
      // For each ID, get the data of the article
      outputData.forEach(element => {
        arrayOfArticlesIds.push(element)
        firebaseFetchArticleById(element)
          .then((articleData) => {
            // For each article data, inject in the page
            injectArticleFromData(articleData)
          })
      });
      // Set a new reference article for further loading
      referenceArticle = newReferenceArticle
    })
})

var createNew = document.querySelector('#createNew')

createNew.addEventListener('click', () => {
  window.location.href = '/news-createpost.html'
})

var articleIteration = 0;
var currentHref = window.location.href;

var injectArticleFromData = (articleToPrevArray) => {

  console.log(articleToPrevArray.articleNumber)

  if (articleToPrevArray.articleNumber === 1) {
    // loadmoreButton.style.display = 'none'
    loadmoreButton.style.opacity = '0'
    loadmoreButton.style.pointerEvents = 'none'
  }

  var newDiv = document.createElement('a')
  newDiv.classList.add('previsualizercontainer')
  newDiv.href = `/news-post.html?${arrayOfArticlesIds[articleIteration]}`
  loadmoreButton.insertAdjacentElement('beforebegin', newDiv)

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
//   } else {
//     newDiv.innerHTML = `
//     <div class="previsualizerimagecontainer _${articleIteration}">
//     <div class="prev-image _${articleIteration}" class="prev-item"><img src=""></div>
//     </div>
//     <div class="previsualizertextcontainer _${articleIteration}">
//     <div class="prev-dateandauthor _${articleIteration}" class="prev-item">Oct 21 | Diego Colino</div>
//     <div class="prev-title _${articleIteration}" class="prev-item">Aquí va el título</div>
//     <div class="prev-content _${articleIteration}" class="prev-item">Aquí va el contenido, lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incAquí va el contenido, lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incAquí va el contenido, lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incAquí va el contenido, lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incAquí va el contenido, lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incAquí va el contenido, lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor inc</div>
//     <div class="prev-tags _${articleIteration}" class="prev-item">
//         <div class="prev-tag _${articleIteration}"></div>
//         <div class="prev-tag _${articleIteration}"></div>
//         <div class="prev-tag _${articleIteration}"></div>
//         <div class="prev-tag _${articleIteration}"></div>
//         <div class="prev-tag _${articleIteration}"></div>
//     </div>
//     </div>
// `;
//   }

  var articleIterationString = articleIteration.toString()

  // setPrevisualizer obtiene los datos del artículo y muestra una previsualización idéntica a la que aparecerá en la página de artículos
  var previewDateAndAuthor = document.querySelector('.prev-dateandauthor._' + articleIterationString);
  var previewTitle = document.querySelector('.prev-title._' + articleIterationString)
  var previewContent = document.querySelector('.prev-content._' + articleIterationString)
  var previewTags = document.querySelectorAll('.prev-tag._' + articleIterationString)
  var previewImage = document.querySelector('.prev-image._' + articleIterationString + ' > img')

  // Date and Author
  var fullDate = articleToPrevArray.date.toString();
  var regex = /([A-Za-z]{3} \d{1,2})/;
  var match = fullDate.match(regex);
  previewDateAndAuthor.innerHTML = `${match[0]} | ${articleToPrevArray.author}`

  // Title
  previewTitle.innerHTML = `${articleToPrevArray.title}`

  // Content
  previewContent.innerHTML = articleToPrevArray.content
  var articleContent = document.querySelector('.prev-content._' + articleIterationString)
  var pElements = articleContent.getElementsByTagName('p');
  // Image
  for (var i = 0; i < pElements.length; i++) {
    if (pElements[i].querySelector('img')) {
      var imgContent = pElements[i].querySelector('img');
      var src = imgContent.getAttribute('src')
      previewImage.setAttribute('src', src)
      break
    }
  }
  for (var i = 0; i < pElements.length; i++) {
    var textContent = pElements[i].textContent;
    if (!(textContent === '')) {
      previewContent.innerHTML = textContent
      break;
    }
  }
  // Image
  for (var i = 0; i < pElements.length; i++) {
    if (pElements[i].querySelector('img')) {
      var imgContent = pElements[i].querySelector('img');
      var src = imgContent.getAttribute('src')
      previewImage.setAttribute('src', src)
      break
    }
  }

  // Tags
  previewTags.forEach((tag, id) => {
    if ((articleToPrevArray.tags[id])) {
      tag.style.display = 'flex';
      tag.innerHTML = articleToPrevArray.tags[id];
    } else {
      tag.style.display = 'none';
      tag.innerHTML = '';
    }
  })

  // Hiding the loading container 
  loadingContainer.style.display = 'none'

  articleIteration = articleIteration + 1
}

