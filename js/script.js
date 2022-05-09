let cantidad;
let activeUser;
let exit;
let userLocal;
let userLogged;

class Cuenta{
    constructor(titular, cuenta, user, pass, ncuenta){
        this.titular = titular;
        this.cantidad = cuenta;
        this.user = user;
        this.pass = pass;
        this.nCuenta = ncuenta;
    }
    mostrar(){
        alert(`Nombre de titular: ${this.titular}\nMonto en la cuenta: $${this.cantidad}`);
        inicio();
    }
    ingresar(cantidad){  
        if (cantidad > 0){
            this.cantidad += cantidad;
            alert(`Ud. ha ingresado ${cantidad} a su cuenta`);
            inicio();
        } else {
            alert("Ingrese un monto válido");
            ingresar();
        }
    }
    retirar(cantidad){
        if(cantidad <= this.cantidad){
            this.cantidad = this.cantidad - cantidad;
            alert(`Ud. ha retirado ${cantidad}`);
            inicio();
        }else {
            alert("Ud no tiene fondos suficientes\nIntente con otro monto.");
            retirar();
        }
    }
}

const cuentas =[]
cuentas.push(new Cuenta("Franco Damian Cordoba", 5000, 36784909, 1905, "01-123456-10"));
cuentas.push(new Cuenta("Ana Reyes", 20000, 94475963, 2056));
cuentas.push(new Cuenta("Gilberto Cordoba" , 60000, 14598212, 2012));
cuentas.push(new Cuenta("Eva Farfan" , 90000, 13409461, 1992));

function btnIngresar(){
    let ingresarBtn = document.getElementById("ingresar");

    ingresarBtn.addEventListener("click", ()=>{getUser()});
}

function getUser(){
    let userID = document.getElementById("user").value;
    let userPass = document.getElementById("password").value;
    let userFiltered = cuentas.find((el)=> el.user == userID);
    let passFiltered = userFiltered.pass;
      
    if(userID == userFiltered.user && parseInt(userPass) === passFiltered){
        userLocal = localStorage.setItem("usuario", userFiltered.user);
        window.location.pathname = '../views/inicio.html';
    }else{
        divCuenta.append("USUARIO INCORRECTO")
    }
}

function inicio(){
    userLogged = localStorage.getItem("usuario")
    let userFiltered = cuentas.find((el)=> el.user == userLogged);
    let divCuenta = document.getElementById("div__cuenta")
        console.log("hola")
        divCuenta.innerHTML = "";
    let parrafo = document.createElement("p");
        parrafo.innerHTML = `<h4>${userFiltered.titular}</h4>
                            <h4>Cuenta N° ${userFiltered.nCuenta}</h4>
                            <h4>$${userFiltered.cantidad}</h4>`;
        divCuenta.append(parrafo);
}

let pages = document.body.id;
switch (pages) {
    case "index":
        btnIngresar();
        break;
    case "inicio" :
        inicio();
        break;
    default:
        break;
}

