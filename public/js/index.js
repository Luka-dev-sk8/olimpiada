const btn = document.getElementById('barra_lateral');
const cajaL = document.getElementById('caja_desplegable');
    
    btn.addEventListener('click', event => {
            event.stopPropagation();
            if (cajaL.style.display === 'none') {
                cajaL.style.display = 'flex';
            } else {
                cajaL.style.display = 'none';
            }
        });
        
        document.addEventListener('click', function(event) {
            if (!cajaL.contains(event.target) && event.target !== btn) {
                cajaL.style.display = 'none';
            }
        });


const pasar = document.getElementById('pasar_pagina')
pasar.addEventListener('click', () =>{
    window.location.href = 'public/Registro_inicioSE.html';
})

const pasa = document.getElementById('pasar_carrito')
pasa.addEventListener('click', () =>{
    window.location.href = 'public/carrito.html';
})



const submenu = document.querySelector('.submenu');
const boton_abrir = document.querySelector('.open_submenu');

    
    boton_abrir.addEventListener('click', () => {
            submenu.classList.toggle('aparece')
            
        });
        
        document.addEventListener('click', function(e) {
            if (submenu.classList.contains('aparece')
                && !submenu.contains(e.target) && !boton_abrir.contains(e.target)){
                    submenu.classList.remove('aparece')
                }
        });


document.addEventListener('DOMContentLoaded',() =>{
    const botonesAgregar = document.querySelectorAll('.agg_carrito');
    botonesAgregar.forEach(boton =>{
        boton.addEventListener('click',(e)=>{
            const productoDiv = e.target.closest('.producto')
            const id = productoDiv.getAttribute('data-id');
            const text = productoDiv.getElementById('');
            const text_P = productoDiv.querySelector('').textContent.trim();
            const [textoS,precio] = text.slipt('$');

            const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        })
    })
})
