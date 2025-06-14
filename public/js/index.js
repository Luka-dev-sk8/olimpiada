const boton = document.getElementById('mostrar_datos');
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