const btn = document.getElementById('barra_lateral');
const cajaL = document.getElementById('caja_desplegable');
    
    btn.addEventListener('click', () => {
            
            if (cajaL.style.display === 'none') {
                cajaL.style.display = 'flex';
            } else {
                cajaL.style.display = 'none';
            }
        });
        
        


const pasar = document.getElementById('pasar_pagina')
pasar.addEventListener('click', () =>{
    window.location.href = '/public/Registro_inicioSE.html';
})