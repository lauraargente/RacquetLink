'use strict'

//Variables

const lightBox = document.querySelector('.Lightbox')
const lightBoxClose = document.querySelector('.Lightbox-close')
const lightBoxBg = document.querySelector('.Lightbox-bg')
const errorBox = document.querySelector('.Error')
const errorBoxClose = document.querySelector('.Error-close')
const errorBoxBg = document.querySelector('.Error-bg')
const formButton = document.querySelector('.Form-button')
const formFields = document.querySelectorAll('.Field')
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


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

    formButton.addEventListener('click', (event)=>{
        let mandatoryValues = [];
        let allValues = [];
        
        formFields.forEach((eachField, i) => {
            allValues.push(eachField.value);
            
            if(i != 4 && i != 5) {
                mandatoryValues.push(eachField.value);
            }
            
            if(i != 4 && i != 5 && eachField.value == ''){
                formFields[i].classList.add('Form-error')
            } else if(i == 2 && !emailRegex.test(eachField.value)){
                formFields[i].classList.add('Form-error')
            } else {
                formFields[i].classList.remove('Form-error')
            }
        });
        
        if(!mandatoryValues.includes('') && emailRegex.test(allValues[2])){
            sendEmail(allValues);
        }
    })

    // Función para enviar email 

    let sendEmail = (allValues)=>{
        Email.send({
            SecureToken : "9ec71190-9c6b-4048-9dc2-02427a92da95",
            To : 'info@racquet-link.com',
            From : 'info@racquet-link.com',
            Subject : "Contact Request",
            Body : "Name: " + allValues[0]
                    + "<br> Last name: " + allValues[1]
                    + "<br> Email: " + allValues[2]
                    + "<br> Phone: " + allValues[3]
                    + "<br> Company: " + allValues[4]
                    + "<br> City: " + allValues[5]
                    + "<br> Message: " + allValues[6]
        }).then(
            message => {
                if (message === 'OK') {
                    lightBox.classList.add('isActive')
                }
                else{
                    errorBox.classList.add('isActive')
                }
            }
        );
    }


// Cuando hago CLICK en lightboxClose hace una FUNCTION
// a Lightbox le remove la clase is Active --> Es decir llamamos a la función closeLightBox

lightBoxClose.addEventListener('click', closeLightBox)

//Store variable to navigate to FAQS
const faqs = document.querySelector('.Faqs-link')
faqs.addEventListener('click', ()=>{
    localStorage.setItem('seeFaqs', 'yes');
})

