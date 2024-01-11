// Variables
const headerBurguer =document.querySelector('.Header-burguer')
const headerNav = document.querySelector('.Header-nav')


//Cuando hago CLICK en headerBurguer hace una FUNCTION
// a headerNav le TOGGLE la clase isActive

headerBurguer.addEventListener(`click`, ()=>{
    headerNav.classList.toggle('isActive')
})



