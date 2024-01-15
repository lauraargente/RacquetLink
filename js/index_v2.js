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


var headersLi = document.querySelectorAll('.Header-li')
var logoPaths = document.querySelectorAll('.logo-path')

document.querySelector('.Header').style.backgroundColor = 'white'
document.querySelector('.Header').style.padding = '1rem 4rem'

logoPaths.forEach(element => {
    element.style.fill = '#025B7B'
})

headersLi.forEach(element => {
    element.style.color = '#025B7B'
})