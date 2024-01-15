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


//#region menu logic 

document.addEventListener('DOMContentLoaded', function() {
    // Almacenar los estilos originales
    var originalNavBackgroundColor = document.querySelector('nav').style.backgroundColor;
    var originalHeaderLiColor = []; // Para almacenar colores originales de los .Header-li
    var originalLogoPathFill = []; // Para almacenar fills originales de los .logo-path
    var originalHeaderBackgroundColor = []; document.querySelector('.Header').style.backgroundColor;
    var originalHeaderBoxShadow = []; document.querySelector('.Header').style.boxShadow;
    var originalHeaderBackDropFilter = []; document.querySelector('.Header').style.backdropFilter;
    // var originalHeaderPadding = []; document.querySelector('.Header').style.padding;
    var originalLoggedUserColor =  document.querySelector('#logged-user-text').style.color

    document.querySelectorAll('.Header-li').forEach(function(el, index) {
        originalHeaderLiColor[index] = el.style.color;
    });
    document.querySelectorAll('.logo-path').forEach(function(el, index) {
        originalLogoPathFill[index] = el.style.fill;
    });

    // Crear una instancia de IntersectionObserver
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                // Cuando #header-changer es visible
                document.querySelectorAll('.Header-li').forEach(function(el) {
                    el.style.color = 'white';
                });
                document.querySelector('nav').style.backgroundColor = 'rgba(0,0,0,0)';
                document.querySelectorAll('.logo-path').forEach(function(el) {
                    el.style.fill = 'white';
                });
                document.querySelector('.Header').style.backgroundColor = 'rgba(255,255,255,0)';
                // document.querySelector('.Header').style.padding = '2rem 6rem';
                document.querySelector('.Header').style.boxShadow = '1px 1px 20px rgba(0, 0, 0, 0)';
                document.querySelector('.Header').style.backdropFilter = 'blur(10px)';
                document.querySelector('#logged-user-text').style.color = 'white'
            } else {
                // Revertir los estilos cuando #header-changer no es visible
                document.querySelectorAll('.Header-li').forEach(function(el, index) {
                    el.style.color = originalHeaderLiColor[index];
                });
                document.querySelector('nav').style.backgroundColor = originalNavBackgroundColor;
                document.querySelectorAll('.logo-path').forEach(function(el, index) {
                    el.style.fill = originalLogoPathFill[index];
                });
                console.log(originalHeaderBackgroundColor)
                document.querySelector('.Header').style.backgroundColor = originalHeaderBackgroundColor;
                document.querySelector('.Header').style.boxShadow = originalHeaderBoxShadow;
                document.querySelector('.Header').style.backdropFilter = originalHeaderBackDropFilter;

                // document.querySelector('.Header').style.padding = originalHeaderPadding;
                document.querySelector('#logged-user-text').style.color = originalLoggedUserColor

            }
        });
    }, {
        threshold: [0, 1] // Dispara eventos tanto al entrar como al salir de la vista
    });

    // Observar el elemento #header-changer
    var target = document.querySelector('#header-changer');
    if (target) {
        observer.observe(target);
    }
});




//#endregion

