import { uploadArticle } from "./news-createpost-firebase.js"

// ------------------------------------------------------- FUNCTIONS

  // getNewsData obtiene los datos del artículo
  var articleTitle = ''
  var articleContent = ''
  var articleAuthor = ''
  var articleDate = ''
  var articleTags = []
  var articleLanguage = 'es'

  var getNewsData = () => {
    articleTitle = document.querySelector('#autoresize').value
    articleAuthor = document.querySelector('#autoresize-author').value
    articleContent = document.querySelector('#editor').innerHTML
    var articleDate = Date()
    articleTags = []
    document.querySelectorAll('.tag-selected').forEach( tag => {
      articleTags.push(tag.classList.item(1));
    })
    articleLanguage = document.querySelector('.lang-tag-selected').classList.item(1)
    var articleToUploadArray = {articleTitle, articleAuthor, articleContent, articleDate, articleTags, articleLanguage}

    return articleToUploadArray
  }

  // setPrevisualizer obtiene los datos del artículo y muestra una previsualización idéntica a la que aparecerá en la página de artículos
  var previewDateAndAuthor = document.querySelector('#prev-dateandauthor')
  var previewTitle = document.querySelector('#prev-title')
  var previewContent = document.querySelector('#prev-content')
  var previewTags = document.querySelectorAll('.prev-tag')
  var previewImage = document.querySelector('#prev-image img')

  var setPrevisualizer = () => {

    var articleToPrevArray = getNewsData()

    console.log(articleToPrevArray)

    // Date and Author
    var fullDate = articleToPrevArray.articleDate.toString();
    var regex = /([A-Za-z]{3} \d{1,2})/;
    var match = fullDate.match(regex);
    previewDateAndAuthor.innerHTML = `${match[0]} | ${articleToPrevArray.articleAuthor}`

    // Title
    previewTitle.innerHTML = `${articleToPrevArray.articleTitle}`

    // Content
    articleContent = document.querySelector('#editor')
    var pElements = articleContent.getElementsByTagName('p');
    for (var i = 0; i < pElements.length; i++) {
      var textContent = pElements[i].textContent;
      if (!(textContent === '')) {
          previewContent.innerHTML = textContent
          break;
      }
    }
    // Image
    for (var i = 0; i < pElements.length; i++) {
      if(pElements[i].querySelector('img')) {
        var imgContent = pElements[i].querySelector('img');
        var src = imgContent.getAttribute('src')
        previewImage.setAttribute('src', src)
        break
      }
    }
    
    // Tags
    previewTags.forEach( (tag, id) => {
      console.log(articleToPrevArray.articleTags[id])
      if ((articleToPrevArray.articleTags[id])) {
        tag.style.display = 'flex';
        tag.innerHTML = articleToPrevArray.articleTags[id];
      } else {
        tag.style.display = 'none';
        tag.innerHTML = '';
      }
    })

    // // Preview Image
    // previewImage.
    // var primeraImagen = divElement.querySelector('img');
  }

// ------------------------------------------------------- RESIZE LOGIC

// Article Title resize logic
const textarea = document.getElementById('autoresize');
textarea.addEventListener('input', function () {
  this.style.height = 'auto'; // Restablece la altura a automática
  this.style.height = this.scrollHeight + 'px'; // Ajusta la altura según el contenido
});
textarea.style.height = 'auto';
textarea.style.height = textarea.scrollHeight + 'px';

// Article Author resize logic
const textareaAuthor = document.getElementById('autoresize-author');
textareaAuthor.addEventListener('input', function () {
  this.style.height = 'auto'; // Restablece la altura a automática
  this.style.height = this.scrollHeight + 'px'; // Ajusta la altura según el contenido
});
textareaAuthor.style.height = 'auto';
textareaAuthor.style.height = textareaAuthor.scrollHeight + 'px';

// ------------------------------------------------------- MAIN FLOW LOGIC

const titleText = document.querySelector('#autoresize')
const authorText = document.querySelector('#autoresize-author')

const editor = document.querySelector('#editor')
const editorToolbar = document.querySelector('.ql-toolbar')

const buttonContainer= document.querySelector('#uploadbuttoncontainer')

const buttonPublicar = document.querySelector('#uploadtitle')
const buttonBack = document.querySelector('#uploadbuttonback')
const buttonConfirm = document.querySelector('#uploadbuttonconfirm')
const buttonLoading = document.querySelector('#uploadbuttonloading')

const tagsContainer = document.querySelector('#tagscontainer')

var firstScreen = document.querySelector('#firstscreen')
var secondScreen = document.querySelector('#previsualizercontainer')

// Publish logic

buttonPublicar.addEventListener('click', () => {

  firstScreen.classList.toggle('lowopacity')
  secondScreen.classList.toggle('hidden')
  secondScreen.classList.toggle('locked-translate')

  buttonContainer.classList.toggle('displaced')

  // buttonPublicar.innerHTML = 'Publicar'
  buttonPublicar.classList.toggle('hidden')
  buttonBack.classList.toggle('hidden')
  buttonConfirm.classList.toggle('hidden')

  window.scrollBy(0, 200);

  setPrevisualizer()

})

buttonBack.addEventListener('click', () => {

  firstScreen.classList.toggle('lowopacity')
  secondScreen.classList.toggle('hidden')
  secondScreen.classList.toggle('locked-translate')

  buttonPublicar.classList.toggle('hidden')
  buttonBack.classList.toggle('hidden')
  buttonConfirm.classList.toggle('hidden')

  window.scrollBy(0, -200);

})

buttonConfirm.addEventListener('click', () => {

  buttonPublicar.innerHTML = 'Publicando...'
  buttonPublicar.classList.toggle('hidden')
  buttonPublicar.classList.toggle('publicarnobackground')

  buttonBack.classList.toggle('hidden')
  buttonConfirm.classList.toggle('hidden')
  buttonLoading.classList.toggle('hidden')

  uploadArticle(getNewsData()).then( () => {
    setTimeout(function() {
      window.location.href = 'news';
    }, 4000);
  })

})

// ------------------------------------------------------- TAGS SELECTION LOGIC

var tags = document.querySelectorAll('.tag')

tags.forEach( (tag, id) => {
  tag.addEventListener('click', () => {
    tag.classList.toggle('tag-selected')
  })
})

// ------------------------------------------------------- LANG TAGS SELECTION LOGIC

var langTags = document.querySelectorAll('.lang-tag')

langTags.forEach( (langTag, id) => {
  langTag.addEventListener('click', () => {
      langTags.forEach( (langTag, id) => {
        langTag.classList.remove('lang-tag-selected')
      })
    langTag.classList.toggle('lang-tag-selected')
  })
})


