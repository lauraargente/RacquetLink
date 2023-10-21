// Functions

  // // Popup Logic
  // var togglePopup = function(popupElement) {
  //   popupElement.classList.toggle('popup-displayed')
  //   body.classList.toggle('overflow-hide')
  // }

  var articleTitle = ''
  var articleContent = ''
  var articleAuthor = ''
  var articleDate = ''
  var articleTags = []

  var getNewsData = function() {
    articleTitle = document.querySelector('#autoresize').innerHTML
    articleAuthor = document.querySelector('#autoresize-author').innerHTML
    articleContent = document.querySelector('#editor').innerHTML
    var articleDate = Date()
    document.querySelectorAll('.tag-selected').forEach( tag => {
      articleTags.push(tag.classList.item(1));
    })
    console.log(articleTags)
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



// Publish logic


const editor = document.querySelector('#editor')
const editorToolbar = document.querySelector('.ql-toolbar')


const buttonContainer= document.querySelector('#uploadbuttoncontainer')

const buttonPublicar = document.querySelector('#uploadtitle')
const buttonBack = document.querySelector('#uploadbuttonback')
const buttonConfirm = document.querySelector('#uploadbuttonconfirm')
const buttonLoading = document.querySelector('#uploadbuttonloading')
// const buttonPublicar = document.querySelector('#uploadtitle')





buttonPublicar.addEventListener('click', () => {
  buttonContainer.classList.toggle('displaced')

  buttonPublicar.innerHTML = 'Publicar'
  buttonPublicar.classList.toggle('hidden')

  buttonBack.classList.toggle('hidden')
  buttonConfirm.classList.toggle('hidden')

  editor.classList.toggle('beforepublish')
  editorToolbar.classList.toggle('zeroheight')
})

buttonBack.addEventListener('click', () => {
  buttonContainer.classList.toggle('displaced')

  buttonPublicar.innerHTML = 'Revisar y publicar'
  buttonPublicar.classList.toggle('hidden')

  buttonBack.classList.toggle('hidden')
  buttonConfirm.classList.toggle('hidden')
  
  editor.classList.toggle('beforepublish')
  editorToolbar.classList.toggle('zeroheight')

})

buttonConfirm.addEventListener('click', () => {

  buttonPublicar.innerHTML = 'Publicando...'
  buttonPublicar.classList.toggle('hidden')
  buttonPublicar.classList.toggle('publicarnobackground')

  buttonBack.classList.toggle('hidden')
  buttonConfirm.classList.toggle('hidden')
  buttonLoading.classList.toggle('hidden')

  getNewsData()

})

// Tags selection

var tags = document.querySelectorAll('.tag')

tags.forEach( (tag, id) => {
  tag.addEventListener('click', () => {
    tag.classList.toggle('tag-selected')
  })
})


