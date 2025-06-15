
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const formularioRegistro = document.querySelector('.forms form:nth-child(2)');


formularioRegistro.addEventListener('submit', function(event) {
    event.preventDefault(); 

    //logica sacada de estudIAAR
    const inputs = this.querySelectorAll('input');
    const nombre = inputs[0].value.trim();
    const email = inputs[1].value.trim();
    const password = inputs[2].value.trim();

    
    const errores = [];

    
    if (nombre === '') {
        errores.push("El nombre de usuario no puede estar vacío.");
    } else if (nombre.length <= 4) {
        errores.push("El nombre de usuario debe tener más de 4 caracteres.");
    }

    
    if (email === '') {
        errores.push("El correo electrónico no puede estar vacío.");
    } else if (!emailRegex.test(email)) {
        errores.push("El correo electrónico no es válido.");
    }

    
    if (password === '') {
        errores.push("La contraseña no puede estar vacía.");
    } else if (password.length < 8) {
        errores.push("La contraseña debe tener al menos 8 caracteres.");
    }

    //parte sacada de pagina infra
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    
    if (usuarios.some(usuario => usuario.email === email)) {
        errores.push("El correo electrónico ya está registrado.");
    }

    
    if (errores.length > 0) {
        errores.forEach(error => console.error(error));
    } else {
        
        const nuevoUsuario = { nombre, email, password };
        usuarios.push(nuevoUsuario);
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        console.log("Usuario registrado exitosamente.");
        
        window.location.href = "/index.html";
    }
});