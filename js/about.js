'use strict'

// Variables
const main = document.querySelector('.Main')
const footer = document.querySelector('.Footer')
const cursor= document.querySelector('.Main-cursor')
const headerBurguer =document.querySelector('.Header-burguer')
const headerNav = document.querySelector('.Header-nav')
const sliderPoint= document.querySelectorAll('.Slider-li')
const valoresResponsive= document.querySelectorAll('.Valores-li-responsive')
const profiles = document.querySelectorAll('.Profiles-responsive .Profiles-li')
const profilesText = document.querySelectorAll('.Profiles-responsive .Profiles-text')
const profilesImage = document.querySelectorAll('.Profiles-responsive .Profiles-img')


// Cuando cursor se desplaza/mueve hace una FUNCTION
     // del objeto e transforamos las propiedade translateX y translateY
    
     window.addEventListener('mousemove', (e)=>{
        let {clientX, clientY}=e
    
        cursor.style.transform = `translateX(${clientX}px) translateY(${clientY}px)`
        let cursorStyle = window.getComputedStyle(e.target)["cursor"]
        
        const textArray = ['SPAN','P','H2','H3','H4','H5', 'BUTTON']
        console.log(e.target.tagName)
        if(textArray.includes(e.target.tagName) || cursorStyle === "pointer"){
            cursor.classList.add('hide')
            main.classList.add('cursor-text')
            footer.classList.add('cursor-text')
        }
        else{
            cursor.classList.remove('hide')
            main.classList.remove('cursor-text')
            footer.classList.remove('cursor-text')
        }
    
    })

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

    profiles.forEach((eachProfile, index)=>{
        eachProfile.addEventListener('click', ()=>{
            profiles[index].style.transform = 'scale(1.1)';
            profilesText[index].style.opacity = 1;
            profilesImage[index].style.opacity = 0;
        })
        document.addEventListener('touchend', ()=>{
            profiles[index].style.transform = 'scale(1)';
            profilesText[index].style.opacity = 0;
            profilesImage[index].style.opacity = 1;
        })
    })


