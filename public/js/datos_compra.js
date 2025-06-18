document.addEventListener('DOMContentLoaded', () => {
    const btnEnviar = document.getElementById('Enviar');

    btnEnviar.addEventListener('click', async () => {
        console.log('Evento click disparado');

        const emailInput = document.getElementById('email_com');
        const mensaje = document.getElementById('mensaje');
        const email = emailInput.value.trim();

        // Validación
        if (!email || !mensaje) {
            console.error('Elemento email o mensaje no encontrado');
            return;
        }

        const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!regexEmail.test(email)) {
            mensaje.textContent = 'Por favor, ingrese un correo válido';
            mensaje.style.color = 'red';
            return;
        }

        try {
            console.log('Enviando solicitud a: http://localhost:3000/enviar-comprobante');
            const res = await fetch('http://localhost:3000/enviar-comprobante', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            console.log('Respuesta recibida:', res.status, res.statusText);

            const responseData = await res.json();

            if (!res.ok) {
                console.error('Error:', responseData.message);
                mensaje.textContent = `Error: ${responseData.message}`;
                mensaje.style.color = 'red';
                return;
            }

            mensaje.textContent = responseData.message || 'Comprobante enviado correctamente';
            mensaje.style.color = 'green';

        } catch (error) {
            console.error('Error en la solicitud:', error);
            mensaje.textContent = 'Error de conexión. Intente de nuevo.';
            mensaje.style.color = 'red';
        }
    });
});