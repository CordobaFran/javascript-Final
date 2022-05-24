let cantidad;
let userLocal;
let logged;
const cuentas =[];
class Cuenta{
    constructor(obj){
        Object.assign(this, obj)
    }
}

const getCuentas = async ()=>{
    const resp = await fetch("cuentas.json")
    const data = await resp.json()    

    for (const cuenta of data){
        cuentas.push(new Cuenta(cuenta));
    }
}

function currency(number){
    return new Intl.NumberFormat('eu-ES', { style: 'currency', currency: 'ARS' }).format(number);
}

function btnIngresar(){
    //EJECUCION DE FETCH DE CUENTAS
    getCuentas()
    //LISTENER DE BOTON INGRESAR EN LOGIN
    let ingresarBtn = document.getElementById("ingresar");
    ingresarBtn.addEventListener("click", ()=>{checkUserAndPass()});
}

function checkUserAndPass(){
    //OBTENCION DATOS DE FORMULARIO
    let userID = document.getElementById("user");
    let userPass = document.getElementById("password");

    //FILTRADO DE USUARIOS SEGUN LO INGRESADO EN USERID
    let userFilteredJSON = JSON.stringify(cuentas.find((el)=> el.user == userID.value));
    let userFiltered = JSON.parse(userFilteredJSON);
    
    //VALIDACION DE USUARIO Y CONTRASEÑA
    if(userID.value == userFiltered.user && parseInt(userPass.value) === userFiltered.pass){
        localStorage.setItem("usuario", userFilteredJSON);
        setTimeout(() => {
            window.location.pathname = '../views/inicio.html';  
        }, 0);
        
    }else{
        let incorrect = document.getElementById("userPassIncorrect");
        incorrect.innerHTML = "";
        incorrect.append("USUARIO O CONTRASEÑA INCORRECTA");
        userID.classList.add("userPassIncorrect");
        userPass.classList.add("userPassIncorrect");
        userID.value = "";
        userPass.value = "";
    }
    //
    logged = localStorage.setItem("logged", false);
    logged = (localStorage.getItem("usuario") === null) ? true : false;
    console.warn(logged)
    logged ? localStorage.setItem("logged", false) : localStorage.setItem("logged", true);
}

function inicio(){
    //EXTRACCION DATOS USUARIO LOGUEADO
    let userFiltered = JSON.parse(localStorage.getItem("usuario"));
    
    //COLOCACION DATOS DE USUARIO EN INICIO
    let divDatos = document.getElementById("divInicioDatos")
        divDatos.innerHTML = "";
    let parrafo = document.createElement("p");
        parrafo.innerHTML = `<h4 class="font-weight-bolder h2">${userFiltered.titular}</h4>
                            <h4>Cuenta N° ${userFiltered.numCuenta}</h4>
                            <h4>${currency(userFiltered.cantidad)}</h4>`;
        divDatos.append(parrafo);
        
}

function cuenta(){
    //EXTRACCION DATOS USUARIO LOGUEADO
    let userFiltered = JSON.parse(localStorage.getItem("usuario"));

    //TITULAR DE LA PAGINA
    let cuentaH1 = document.getElementById("cuentaH1")
        cuentaH1.innerHTML = "";
        cuentaH1.innerHTML = `CUENTAS DE ${(userFiltered.titular).toUpperCase()}`; 

    //DATOS DE CUENTA
    let cuentaBox = document.getElementById("cuentaBox")
        cuentaBox.innerHTML = "";
    let box = document.createElement("p");
    box.innerHTML = `<h4 class="box__text text-center pt-3 mt-5 mb-5 h2">${userFiltered.nombCuenta}</h4>
                    <h4 class="box__text text-center mt-3 font-weight-bolder h1">${currency(userFiltered.cantidad)}</h4>
                    <h4 class="box__text text-center mt-3 h3">Cuenta N° ${userFiltered.numCuenta}</h4>`;
    cuentaBox.append(box);
}

function closeSesion(){
    let cerrarSesion = document.getElementById("cerrarSesion");

    //BORRADO DE STORAGE POR CIERRE DE SESION Y REDIRECCIONADO A LOGIN
    cerrarSesion.addEventListener("click", (e)=>{
        e.preventDefault();
        window.location.pathname = '../index.html';
        localStorage.clear();
        localStorage.getItem("usuario") === null && localStorage.setItem("logged", false);
    });
}
function Bodyclean(bodyId){
    if (localStorage.getItem("logged") === "false"){
    let body = document.getElementById(bodyId);
        body.innerHTML ="";
        Swal.fire({
            title: `Ud. ha cerrado la sesión.
                    Vuelva a ingresar`,
            showDenyButton: false,
            showCancelButton: false,
            confirmButtonText: 'Volver',
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                window.location.pathname = '../index.html';
            }
        })
        return true;
    }else{
        return false;
    }
}


//SELECCION DE FUNCION POR CADA PAG CON ID DE BODY
let pages = document.body.id;
switch (pages) {
    case "index":
        btnIngresar();
        break;
    case "inicio" :
        Bodyclean("inicio");
        Bodyclean() === false && inicio();
        Bodyclean() === false && closeSesion();        
        break;
    case "cuenta" :
        Bodyclean("cuenta");
        Bodyclean() === false && cuenta();
        Bodyclean() === false && closeSesion();  
        break;    
    default:
        break;
}

