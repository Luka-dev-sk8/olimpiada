/**const boton = document.getElementById('mostrar_datos');
        const caja = document.getElementById('caja_datos');

        boton.addEventListener('click', function(event) {
            event.stopPropagation();
            if (caja.style.display === 'none') {
                caja.style.display = 'block';
            } else {
                caja.style.display = 'none';
            }
        });

        document.addEventListener('click', function(event) {
            if (!caja.contains(event.target) && event.target !== boton) {
                caja.style.display = 'none';
            }
        });
**/
const btn = document.getElementById('barra_lateral');
const cajaL = document.getElementById('caja_desplegable');

        btn.addEventListener('click', function(event) {
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
