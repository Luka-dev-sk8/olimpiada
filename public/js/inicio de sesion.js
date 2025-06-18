
const btnSignIn = document.getElementById("btn-sign-in");
const btnSignUp = document.getElementById("btn-sign-up");
const forms = document.getElementById("forms");
const sidebar = document.getElementById("sidebar");

btnSignIn.addEventListener('click',()=>{
    changeSingIn();
});

btnSignUp.addEventListener('click',()=>{
    changeSingUp();
})

function changeSingIn(){
    forms.classList.remove('active');
    sidebar.classList.remove('active');
}

function changeSingUp(){
    forms.classList.add('active');
    sidebar.classList.add('active');
}

const correo_S = document.getElementById('email')
const password_S = document.getElementById('password')
const parrafo_S = document.getElementById('warning_S')
const parrafo_S2 = document.getElementById('warning_S2')
const form_S = document.getElementById('sesion')

async function verificarData(email,contraseña) {
const payload = {email,contraseña}
    try{
        const response = await fetch('http://localhost:3000/verificarData',{
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify(payload)
        });
        if(!response.ok){
            console.error('error al verificar datos: ', response.status);
            return null;
        }
             return await response.json();
    }catch (error) {
              console.error('Error de conexión:', error);
              return null;
}}


form_S.addEventListener("submit",async e =>{
    e.preventDefault();
    parrafo_S.textContent = "";
    parrafo_S2.textContent = "";
    let warningS = "";
    let warningS2 = "";
    let entrar_S = false;


    const correoValue_S = correo_S.value;
    const passwordValue_S = password_S.value;
    regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;


    if(!regexEmail.test(correo_S.value)){
        warningS += "email no es valido"
        entrar_S = true
    }

    if(password_S.value.length <8){
        warningS2 += "contraseña invalida"
        entrar_S = true
    }

    if(entrar_S){
        parrafo_S.innerHTML = warningS
        parrafo_S2.innerHTML = warningS2
        return
    }

    const result = await verificarData(correoValue_S,passwordValue_S);
    if(!result){
        parrafo_S.textContent = "no se puedo verificar(falta sql server DB)"; //al no estar conectado la base de datos por el node.js, tirara este error
        return;
    }

    const{correoExiste,contraseñaExiste} = result;

    if(!correoExiste){
        warningS = "el correo no esta registrado";
        entrar_S = true;
    }else if(!contraseñaExiste){
        warningS2 = "contraseña incorrecta";
        entrar_S = true;
    }

    if(entrar_S){
        parrafo_S.innerHTML = warningS
        parrafo_S2.innerHTML = warningS2
        warningS = ""
        warningS2 = ""
    }else{
        window.location.href = '/index.html';
    }
});





