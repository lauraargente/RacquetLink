'use strict'

// Variables
const main = document.querySelector('.Main')
const footer = document.querySelector('.Footer')
const headerBurguer =document.querySelector('.Header-burguer')
const headerNav = document.querySelector('.Header-nav')
const sliderPoint= document.querySelectorAll('.Slider-li')
const valoresResponsive= document.querySelectorAll('.Valores-li-responsive')
const profiles = document.querySelectorAll('.Profiles-responsive .Profiles-li')
const profilesText = document.querySelectorAll('.Profiles-responsive .Profiles-text')
const profilesImage = document.querySelectorAll('.Profiles-responsive .Profiles-img')
const sliderQuotes= document.querySelector('.Slider-quotes')
const quotesPoint= document.querySelectorAll('.Quotes-li-dots')
const quotesItems= document.querySelectorAll('.Quotes-li-responsive')
const sliderImages = ["assets/about/AlvaroGonzalezSlider.jpg", "assets/about/AdobeStock_191850653-1-(3).jpg", "assets/about/JavierMartiSlider.jpg"]
const sliderImagesEnglish = ["../assets/about/AlvaroGonzalezSlider.jpg", "../assets/about/AdobeStock_191850653-1-(3).jpg", "../assets/about/JavierMartiSlider.jpg"]


//Cuando hago CLICK en headerBurguer hace una FUNCTION
    // a headerNav le TOGGLE la clase isActive
   
    headerBurguer.addEventListener(`click`, ()=>{
        headerNav.classList.toggle('isActive')
    })

// Cuando pasan 3 segundos, sliderActive aumenta para mostrar la siguiente imagen
    // sliderActive ++
    // a TODAS las sliderCenter le REMOVE la clase isActive
    // a sliderCenter con POSICION sliderActive le ADD la clase isActive 

    // a TODAS las sliderPoint les REMOVE la clase isActive
    // a sliderPoint con POSICION sliderActive le ADD la clase isActive 

    // Cuando pasan 3 segundos, sliderNextImg aparece 
    // el atributo src de sliderNextImg tiene que ser el mismo que el de sliderCenter

    let sliderActive = 0;

    let startSlider = () => {
        sliderActive++
        if(sliderActive >= valoresResponsive.length){
            sliderActive = 0
        }
        valoresResponsive.forEach(() =>{
            activeCarousel();
        })
    }
    
    let sliderInterval = setInterval(startSlider, 3000)

// Cuando hago CLICK en cualquier Slider-li hace una FUNCTION
    //le ADD la clase isActive

    sliderPoint.forEach((eachPoint, index)=> {
        sliderPoint[index].addEventListener('click',()=>{
            sliderActive = index;
            activeCarousel();
        })
    })

    let activeCarousel = () => {
        sliderPoint.forEach((eachPoint)=> {
            eachPoint.classList.remove('isActive');
            sliderPoint[sliderActive].classList.add('isActive');
        })
        valoresResponsive.forEach((eachValor)=> {
            eachValor.classList.remove('isActive');
            valoresResponsive[sliderActive].classList.add('isActive');
        })
        
        clearInterval(sliderInterval)
        sliderInterval = setInterval(startSlider, 3000)
    }

    // profiles.forEach((eachProfile, index)=>{
    //     eachProfile.addEventListener('click', ()=>{
    //         profiles[index].style.transform = 'scale(1.1)';
    //         profilesText[index].style.opacity = 1;
    //         profilesImage[index].style.opacity = 0;
    //     })
    //     document.addEventListener('touchend', ()=>{
    //         profiles[index].style.transform = 'scale(1)';
    //         profilesText[index].style.opacity = 0;
    //         profilesImage[index].style.opacity = 1;
    //     })
    // })

    let quoteActive = 0;

    let startQuotes = () => {
        quoteActive++
        if(quoteActive >= quotesItems.length){
            quoteActive = 0
        }
        quotesItems.forEach(() =>{
            activeQuotesCarousel();
        })
    }
    
    let quotesInterval = setInterval(startQuotes, 5000)

// Cuando hago CLICK en cualquier Slider-li hace una FUNCTION
    //le ADD la clase isActive

    quotesPoint.forEach((eachPoint, index)=> {
        quotesPoint[index].addEventListener('click',()=>{
            quoteActive = index;
            activeQuotesCarousel();
        })
    })

    let activeQuotesCarousel = () => {
        quotesPoint.forEach((eachPoint)=> {
            eachPoint.classList.remove('isActive');
            quotesPoint[quoteActive].classList.add('isActive');
        })
        quotesItems.forEach((eachQuote)=> {
            eachQuote.classList.remove('isActive');
            quotesItems[quoteActive].classList.add('isActive');
        })

        if(window.location.href.includes('aboutEN')){
            sliderQuotes.style.backgroundImage = 'url("' + sliderImagesEnglish[quoteActive] + '")';
        } else {
            sliderQuotes.style.backgroundImage = 'url("' + sliderImages[quoteActive] + '")';
        }
        
        clearInterval(quotesInterval)
        quotesInterval = setInterval(startQuotes, 5000)
    }

//Store variable to navigate to FAQS
const faqsLink = document.querySelector('.Faqs-link')
faqsLink.addEventListener('click', ()=>{
    localStorage.setItem('seeFaqs', 'yes');
})


