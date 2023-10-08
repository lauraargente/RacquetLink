'use strict'

// Variables
const main = document.querySelector('.Main')
const footer = document.querySelector('.Footer')
const cursor= document.querySelector('.Main-cursor')
const headerBurguer =document.querySelector('.Header-burguer')
const headerNav = document.querySelector('.Header-nav')

// Cuando cursor se desplaza/mueve hace una FUNCTION
     // del objeto e transforamos las propiedade translateX y translateY
    
     window.addEventListener('mousemove', (e)=>{
        let {clientX, clientY}=e
    
        cursor.style.transform = `translateX(${clientX}px) translateY(${clientY}px)`
        let cursorStyle = window.getComputedStyle(e.target)["cursor"]
        
        const textArray = ['SPAN','P','H2','H3','H4','H5', 'BUTTON']
        
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
        console.log('hola')
    })

