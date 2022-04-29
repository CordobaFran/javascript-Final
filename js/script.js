let cantidad;
let activeUser;
let exit;
class Cuenta{
    constructor(titular, cuenta, user, pass){
        this.titular = titular;
        this.cantidad = cuenta;
        this.user = user;
        this.pass = pass;
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
cuentas.push(new Cuenta("Franco Cordoba", 5000, 36784909, 1905));
cuentas.push(new Cuenta("Ana Reyes", 20000, 94475963, 2056));
cuentas.push(new Cuenta("Gilberto Cordoba" , 60000, 14598212, 2012));
cuentas.push(new Cuenta("Eva Farfan" , 90000, 13409461, 1992));

function getUser(){

    let div1 = document.getElementById("div1")
    let userID = document.getElementById("user").value;
    let userFiltered = cuentas.find((el)=> el.user == userID);
    
    if(userID == userFiltered.user){
        let parrafo = document.createElement("p");
        parrafo.innerHTML = `<h5>Bienvenido: ${userFiltered.titular}</h5>
                            <h5>Su saldo es: ${userFiltered.cantidad}</h5>`;
        div1.appendChild(parrafo);
    }
}

getUser()
