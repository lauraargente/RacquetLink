'use strict'

// Variables
const main = document.querySelector('.Main')
const footer = document.querySelector('.Footer')
const headerBurguer =document.querySelector('.Header-burguer')
const headerNav = document.querySelector('.Header-nav')
const element = document.getElementById('Section-presentation')


//Cuando hago CLICK en headerBurguer hace una FUNCTION
    // a headerNav le TOGGLE la clase isActive
   
    headerBurguer.addEventListener(`click`, ()=>{
        headerNav.classList.toggle('isActive')
    })



