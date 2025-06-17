document.getElementById('formulario').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const pedidoId = document.getElementById('pedido_id').value;
    const mensaje = document.getElementById('mensaje');

    try {
        const res = await fetch('http://localhost:3000/enviar-correo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `email=${encodeURIComponent(email)}&pedido_id=${encodeURIComponent(pedidoId)}`
        });

        const text = await res.text();
        mensaje.textContent = text;
        mensaje.style.color = res.ok ? 'green' : 'red';
    } catch (error) {
        mensaje.textContent = 'Error al enviar la solicitud.';
        mensaje.style.color = 'red';
    }
});
