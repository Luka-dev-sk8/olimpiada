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

