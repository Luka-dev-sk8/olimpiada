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