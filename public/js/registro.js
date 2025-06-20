const nombre = document.getElementById("name")
const correo = document.getElementById('R_email')
const contraseña = document.getElementById('R_password')
const form = document.getElementById('registro')
const parrafo = document.getElementById('warning')
const parrafo2 = document.getElementById('warning2')
const parrafo3 = document.getElementById('warning3')
 

async function enviarDatos() {
    const nombreValue = nombre.value;
    const correoValue = correo.value;
    const contraseñaValue = contraseña.value;

    if (!nombreValue || !correoValue || !contraseñaValue){
        parrafo2.innerHTML = "todos los campos son necesarios"
        return false;
    }
    
    try{
        const response = await fetch('http://localhost:3000/insertData',{
             method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombre:nombreValue,
                email: correoValue,
                contraseña: contraseñaValue
            })
        });

        const result = await response.json();

        if(response.ok){
            console.log('datos insertados con exito');
            return true;
        } else if (response.status === 400) {
            parrafo2.innerHTML= result.Message;
            return false
        }else{
            console.log('error al insertar datos');
            parrafo2.innerHTML='Error al insertar datos. Por favor, intenta de nuevo.';
            return false;
        }
    }catch (error) {
        console.error('Error al enviar datos:', error);
        parrafo2.innerHTML = 'Error de conexión con el servidor';
        return false;
    }


}


form.addEventListener("submit",async e =>{
e.preventDefault();

let warning = ""
let warning2 = ""
let warning3 = ""
let entrar = false
let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

if(nombre.value.length <6){
    warning += 'el nombre no es valido '
    entrar = true
}

if(!regexEmail.test(correo.value)){
    warning2 += "email no es valido "
    entrar = true
}

if(contraseña.value.length <8){
    warning3 += "contraseña de 8 caracteres"
    entrar = true
}

if(entrar){

parrafo.innerHTML = warning
parrafo2.innerHTML = warning2
parrafo3.innerHTML = warning3

warning = ""
warning2 = ""
warning3 = ""
} else {
    const enviarDatosResult = await enviarDatos();
    if(enviarDatos){
        window.location = '/index.html'
    }
}

})