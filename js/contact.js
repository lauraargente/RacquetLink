'use strict'

//Variables

const lightBox = document.querySelector('.Lightbox')
const lightBoxClose = document.querySelector('.Lightbox-close')
const lightBoxBg = document.querySelector('.Lightbox-bg')
const formButton = document.querySelector('.Form-button')
const formFields = document.querySelectorAll('.Field')


// Funciones
    // closeLightBox es una función para cerrar el popup (lightbox)
    let closeLightBox = ()=>{
        lightBox.classList.remove('isActive')
        
        formFields.forEach((eachField, i) => {
            eachField.value = '';
        });
    }


// Cuando hago CLICK en formButton hace una FUNCTION
    // CUANDO los formFields están completos a Lightbox le Add la clase is Active 

    formButton.addEventListener('click', ()=>{
        let fieldValues = [];
        
        formFields.forEach((eachField, i) => {
            if(i != 4 && i != 5) {
                fieldValues.push(eachField.value);
            }
            
            if(i != 4 && i != 5 && eachField.value == ''){
                formFields[i].classList.add('Form-error')
            } else {
                formFields[i].classList.remove('Form-error')
            }
        });
        
        if(!fieldValues.includes('')){
            lightBox.classList.add('isActive')
        }
    })


// Cuando hago CLICK en lightboxClose hace una FUNCTION
// a Lightbox le remove la clase is Active --> Es decir llamamos a la función closeLightBox

lightBoxClose.addEventListener('click', closeLightBox)