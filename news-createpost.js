// Functions

  // // Popup Logic
  // var togglePopup = function(popupElement) {
  //   popupElement.classList.toggle('popup-displayed')
  //   body.classList.toggle('overflow-hide')
  // }

// Article Title resize logic
const textarea = document.getElementById('autoresize');

textarea.addEventListener('input', function () {
  this.style.height = 'auto'; // Restablece la altura a automática
  this.style.height = this.scrollHeight + 'px'; // Ajusta la altura según el contenido
});

// Asegúrate de que el textarea tenga la altura inicial correcta al cargar la página
textarea.style.height = 'auto';
textarea.style.height = textarea.scrollHeight + 'px';


// Publish logic


const editor = document.querySelector('#editor')
const editorToolbar = document.querySelector('.ql-toolbar')


const buttonContainer= document.querySelector('#uploadbuttoncontainer')

const buttonPublicar = document.querySelector('#uploadbutton')
const buttonBack = document.querySelector('#uploadbuttonback')
const buttonConfirm = document.querySelector('#uploadbuttonconfirm')
const buttonLoading = document.querySelector('#uploadbuttonloading')
const confirmationTitle = document.querySelector('#uploadtitle')



var articleTitle = ''
var articleContent = ''
var articleAuthor = ''
var articleDate = ''

buttonPublicar.addEventListener('click', () => {
  confirmationTitle.innerHTML = '¿Seguro?'

  buttonPublicar.classList.toggle('hidden')
  buttonBack.classList.toggle('hidden')
  buttonConfirm.classList.toggle('hidden')
  buttonContainer.classList.toggle('displaced')
  editor.classList.toggle('beforepublish')
  editorToolbar.classList.toggle('zeroheight')
})

buttonBack.addEventListener('click', () => {
  confirmationTitle.innerHTML = 'Publicar'
  buttonPublicar.classList.toggle('hidden')
  buttonBack.classList.toggle('hidden')
  buttonConfirm.classList.toggle('hidden')
  buttonContainer.classList.toggle('displaced')
  editor.classList.toggle('beforepublish')
  editorToolbar.classList.toggle('zeroheight')

})

buttonConfirm.addEventListener('click', () => {
  articleTitle = document.querySelector('#autoresize').innerHTML
  articleContent = document.querySelector('#editor').innerHTML
  buttonBack.classList.toggle('hidden')
  buttonConfirm.classList.toggle('hidden')
  buttonLoading.classList.toggle('hidden')

  confirmationTitle.innerHTML = 'Publicando...'
})


