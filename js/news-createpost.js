import { uploadArticle } from "./news-createpost-firebase.js"

// Functions

  // getNewsData obtiene los datos del artículo
  var articleTitle = ''
  var articleContent = ''
  var articleAuthor = ''
  var articleDate = ''
  var articleTags = []

  var getNewsData = () => {
    articleTitle = document.querySelector('#autoresize').value
    articleAuthor = document.querySelector('#autoresize-author').value
    articleContent = document.querySelector('#editor').innerHTML
    var articleDate = Date()
    document.querySelectorAll('.tag-selected').forEach( tag => {
      articleTags.push(tag.classList.item(1));
    })
    var articleToUploadArray = {articleTitle, articleAuthor, articleContent, articleDate, articleTags}

    return articleToUploadArray
  }

  // setPrevisualizer obtiene los datos del artículo y muestra una previsualización idéntica a la que aparecerá en la página de artículos
  var previewDateAndAuthor = document.querySelector('#prev-dateandauthor')
  var previewTitle = document.querySelector('#prev-title')
  var previewContent = document.querySelector('#prev-content')
  var previewTags = document.querySelector('#prev-tags')
  var previewImage = document.querySelector('#prev-image')

  var setPrevisualizer = () => {


    var articleToPrevArray = getNewsData()

    // Regex por date
    var fullDate = articleToPrevArray.articleDate.toString();
    var regex = /([A-Za-z]{3} \d{1,2})/;
    var match = fullDate.match(regex);

    previewDateAndAuthor.innerHTML = `${match[0]} | ${articleToPrevArray.articleAuthor}`
    // articleToPrevArray.articleTitle
    previewTitle.innerHTML = `${articleToPrevArray.articleTitle}`

    // Regex por content
    articleContent = document.querySelector('#editor')
    var pElements = articleContent.getElementsByTagName('p');

    for (var i = 0; i < pElements.length; i++) {
      var textContent = pElements[i].textContent;

      // Verifica si el párrafo contiene solo texto (sin etiquetas HTML)
      if (/^\s*[\w\s.,!?()-]*\s*$/.test(textContent)) {
          console.log('Primer párrafo con contenido de solo texto:', textContent);
          previewContent.innerHTML = textContent
          break;
      }
  }

    previewContent = `${articleToPrevArray.articleTitle}`
  }

// Article Title resize logic
const textarea = document.getElementById('autoresize');
textarea.addEventListener('input', function () {
  this.style.height = 'auto'; // Restablece la altura a automática
  this.style.height = this.scrollHeight + 'px'; // Ajusta la altura según el contenido
});
textarea.style.height = 'auto';
textarea.style.height = textarea.scrollHeight + 'px';

// Article Title resize logic
const textareaAuthor = document.getElementById('autoresize-author');
textareaAuthor.addEventListener('input', function () {
  this.style.height = 'auto'; // Restablece la altura a automática
  this.style.height = this.scrollHeight + 'px'; // Ajusta la altura según el contenido
});
textareaAuthor.style.height = 'auto';
textareaAuthor.style.height = textareaAuthor.scrollHeight + 'px';



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

// Publish logic

buttonPublicar.addEventListener('click', () => {
  buttonContainer.classList.toggle('displaced')

  // buttonPublicar.innerHTML = 'Publicar'
  buttonPublicar.classList.toggle('hidden')
  buttonBack.classList.toggle('hidden')
  buttonConfirm.classList.toggle('hidden')

  setPrevisualizer()

})

buttonBack.addEventListener('click', () => {

  buttonPublicar.classList.toggle('hidden')
  buttonBack.classList.toggle('hidden')
  buttonConfirm.classList.toggle('hidden')

})

buttonConfirm.addEventListener('click', () => {

  buttonPublicar.innerHTML = 'Publicando...'
  buttonPublicar.classList.toggle('hidden')
  buttonPublicar.classList.toggle('publicarnobackground')

  buttonBack.classList.toggle('hidden')
  buttonConfirm.classList.toggle('hidden')
  buttonLoading.classList.toggle('hidden')

  uploadArticle(getNewsData())

})

// Tags selection

var tags = document.querySelectorAll('.tag')

tags.forEach( (tag, id) => {
  tag.addEventListener('click', () => {
    tag.classList.toggle('tag-selected')
  })
})


