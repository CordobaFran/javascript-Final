let cantidad;
let userLocal;
let logged;
let dolaroficial;
let userFiltered = JSON.parse(localStorage.getItem("usuario"));
const DateTime = luxon.DateTime;
const setTransferToStorage = (resp) => {
    return new Promise((resolve, reject)=>{
        resp ? resolve("resuelta") : reject("transferencia no realizada");
    })
};


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

function dateTime(String){
    const dt = DateTime.fromISO(String);
    return dt.toLocaleString(DateTime.DATE_SHORT);
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
            window.location = 'views/inicio.html';  
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
    
    logged = localStorage.setItem("logged", false);
    logged = (localStorage.getItem("usuario") === null) ? true : false;
    console.warn(logged)
    logged ? localStorage.setItem("logged", false) : localStorage.setItem("logged", true);
}

function putMovimientos(filter, id, elementId){
    let movimientosDatos = JSON.parse(localStorage.usuario);
    let filtered;
        //ordenamiento de listado completo por última fecha    
        movimientosDatos.movimientos.sort((a, b) => {
            if(a.fecha < b.fecha) {return 1;}
            if(a.fecha > b.fecha) {return -1;}
            return 0
        })
    //agregado de table y titulos
    id = document.getElementById(elementId);
    id.innerHTML = "";
    let table = document.createElement("tr");
        table.innerHTML = ` <th class ="table__date">Fecha</th>
                            <th class ="table__detail">Detalle</th>
                            <th class ="table__mount">Monto</th>`
        id.append(table);
    //opciones de filtrado
    switch (filter) {
        case "transfDet":
            filtered = movimientosDatos.movimientos.filter((el)=>el.detalle.includes(`transferencia`));
            break;
        case "ingreso":
            filtered = movimientosDatos.movimientos.filter((el)=>el.monto > 0);
            break;
        case "egreso":
            filtered = movimientosDatos.movimientos.filter((el)=>el.monto < 0);
            break; 
        case "ingresoTransf":
            filtered = movimientosDatos.movimientos.filter((el)=>el.monto > 0 && el.detalle.includes(`transferencia`));
            break;
        case "egresoTransf":
            filtered = movimientosDatos.movimientos.filter((el)=>el.monto < 0 && el.detalle.includes(`transferencia`));
            break;                      
        default:
            filtered = movimientosDatos.movimientos;
            break;
    } 
    //Agregado de movimientos al html
    filtered.forEach((mov) => {
        table = document.createElement("tr");
            table.innerHTML = ` <td>${dateTime(mov.fecha)}</td>
                                <td class ="table__detail">${mov.detalle.charAt(0).toUpperCase() + mov.detalle.slice(1)}</td>
                                <td>${currency(mov.monto)}</td>`;
        id.append(table);
    });    
}

function filterTransactionsBySelected(id, elementId){
    document.querySelectorAll(".dropdown-item").forEach( function(el) {
        el.addEventListener("click", function(e) {
            document.querySelector(".dropdown-toggle").innerText = el.textContent;
            putMovimientos(e.target.value, id, elementId );
        });
    });  
}

function inicioLink(){
    //COLOCACION DATOS DE USUARIO EN INICIO
    putMovimientos("",movimientos, "movimientos");

    let divDatos = document.getElementById("divInicioDatos");
        divDatos.innerHTML = "";
    let parrafo = document.createElement("p");
        parrafo.innerHTML = `<h4 class="font-weight-bolder h2">${userFiltered.titular}</h4>
                            <h4>Cuenta N° ${userFiltered.numCuenta}</h4>
                            <h4>${currency(userFiltered.cantidad)}</h4>`;
        divDatos.append(parrafo);
}

function cuentaLink(){
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

function transferenciaLink(){
    putMovimientos("transfDet", bankTransfer, "bankTransfer");

    let transferenciaH1 = document.getElementById("transferenciaH1");
        transferenciaH1.innerHTML = "";
        transferenciaH1.innerHTML = `TRANSFERENCIAS DE ${(userFiltered.titular).toUpperCase()}`;

    let cbuCvuAliasBox = document.getElementById("cbuAlias");
        cbuCvuAliasBox.addEventListener("click", ()=>{
            window.location = "./transferencias-cbucvualias.html"
        })    
}

function transferenciaCbuCvuAliasLink(transfered){
    let transferenciaH1 = document.getElementById("transferenciaH1");
        transferenciaH1.innerHTML = "";
        transferenciaH1.innerHTML = `TRANSFERENCIAS DE ${(userFiltered.titular).toUpperCase()}`;

    //agregado de cuenta y valor para seleccionar en dropdown menu
    document.querySelector("#dropdown").innerHTML = `<option class="dropdown-item" value="1">CA ${userFiltered.numCuenta} - ${currency(userFiltered.cantidad)}</option>`;
    document.querySelectorAll(".dropdown-item").forEach( function(el) {
        el.addEventListener("click", function(e) {
            document.querySelector(".dropdown-toggle").innerText = el.textContent;
            document.querySelector(".dropdown-toggle").value = 1;
        });
    });

    //selector de Alias o Cbu
    let alias = document.getElementById("aliasForm");
        alias.addEventListener("input", ()=>{
            document.querySelector("#cbuForm").value = ""
        })
    let cbu = document.getElementById("cbuForm");
        cbu.addEventListener("input", ()=>{
            document.querySelector("#aliasForm").value = ""
        })

    //Queryselector de form
    let hasDataAccount = document.querySelector(".dropdown-toggle");
    let hasDataCbu= document.querySelector("#cbuForm");
    let hasDataAlias= document.querySelector("#aliasForm");
    let hasDataAmount = document.querySelector("#montoForm");
    let transferButton = document.getElementById("transferButton");
    let cbuLength = document.querySelector("#cbuLength");
    let span = document.querySelectorAll("span");
    
    //actualizacion cantidad de digitos cbu
    hasDataCbu.addEventListener("keyup", ()=>{
        cbuLength.innerText ="";
        cbuLength.innerText = hasDataCbu.value.length;
    })

    hasDataCbu.addEventListener("keyup", ()=>{
        if(hasDataCbu.value.length > 23){
            span.forEach((el) => {
                el.classList.add("classLenght--red", "font-weight-bold")
            });         
        }else{
            span.forEach((el) => {
                el.classList.remove("classLenght--red", "font-weight-bold")
            });
        }
    })

    //validacion de datos colocados y envío 
    transferButton.addEventListener("click", (e)=>{
        e.preventDefault()
        if(hasDataAccount.value !="" && (hasDataCbu.value || hasDataAlias.value)!= "" && (hasDataAmount.value > 0 && hasDataAmount.value < userFiltered.cantidad)){
            if(hasDataCbu.value.length == 23){
                transferConfirmation(`N°${hasDataCbu.value}`, hasDataAmount.value, undefined, "CBU/CVU")
            }else if (hasDataAlias.value.length !=""){
                transferConfirmation(hasDataAlias.value, hasDataAmount.value, undefined, "Alias")
            }else{
                transferConfirmation(undefined, undefined, "dataNoCompleted")
            }
        }else if(hasDataAmount.value > userFiltered.cantidad){
            transferConfirmation(undefined, undefined, "insuficientFunds")
        }else{
            transferConfirmation(undefined, undefined, "dataNoCompleted")
        }
    })

    setTransferToStorage(transfered).then(()=>{
        userFiltered.cantidad -= hasDataAmount.value;
        transferTransactionToHistory(hasDataAmount.value);
        let userFilteredJSON = JSON.stringify(userFiltered);
        localStorage.setItem("usuario", userFilteredJSON);
        window.location = "transferencias.html";
    }).catch(error =>  console.log(error))
}

function transferTransactionToHistory(amount){
    const today = DateTime.now().toISODate();
    let transferObject = {"monto" : -(amount), "detalle" : "transferencia", "fecha" : today}
    userFiltered.movimientos.push(transferObject)
}

function transferConfirmation(cbu, valor, error, aliasOrCbu){
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
    })
    
    swalWithBootstrapButtons.fire({
        title: `Quieres transferir ${currency(valor)} al ${aliasOrCbu}`,
        text: `${cbu}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Transferir',
        cancelButtonText: 'No, Volver',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
        swalWithBootstrapButtons.fire(
            'Transferencia Exitosa',
            'La transferencia se completó exitosamente',
            'success'    
        ).then((result) => {
            if (result.isConfirmed){
                return transferenciaCbuCvuAliasLink(true);
            }
        })  
        } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
        ){
        swalWithBootstrapButtons.fire({
            title: 'Operación cancelada',
            text: 'La operacion ha sido cancelada',
            icon: 'error',
            confirmButtonText: 'Volver',
        })
        }
    })

    if (error == "dataNoCompleted"){
        swalWithBootstrapButtons.fire({
            title: 'Operación cancelada',
            text: 'Ingrese todos los datos correctamente',
            icon: 'error',
            confirmButtonText: 'Volver'
        });
    }

    if (error == "insuficientFunds"){
        swalWithBootstrapButtons.fire({
            title: 'Fondos Insuficientes',
            text: 'Intente ingresando otro valor a transferir',
            icon: 'error',
            confirmButtonText: 'Volver'
        });
    }
}

function divisasPage(){
    function RequestDivisa(){
        fetch('https://cors-solucion.herokuapp.com/https://api-dolar-argentina.herokuapp.com/api/dolaroficial')
        .then((response) => response.json())
        .then((data) => {
        dolaroficial = data;
        let {fecha, compra, venta} = dolaroficial;
        
        //puesta cotizacion compra en box
        let divisaCompra = document.getElementById("divisaBoxCompra");
        let compraContainer = document.createElement("p");
            divisaCompra.innerHTML = "";
            compraContainer.innerHTML = `<div class="font-weight-bolder h2">COMPRA</div>
                                <div class="h4">$${compra}</div>`
            divisaCompra.append(compraContainer);

        //puesta cotizacion venta en box
        let divisaVenta = document.getElementById("divisaBoxVenta");
        let ventaContainer = document.createElement("p");
            divisaVenta.innerHTML = "";
            ventaContainer.innerHTML = "";
            ventaContainer.innerHTML = `<div class="font-weight-bolder h2">VENTA</div>
                                <div class="h4">$${venta}</div>`
            divisaVenta.append(ventaContainer);

        //puesta horario en html
        let horario = fecha.toLocaleString(DateTime.DATE_SHORT);
        document.querySelector("#tiempoDeCotizacion").innerText = horario;        
        })
    }
    //inicio funcion del fetch
    RequestDivisa();

    //actualización cada 30 segundos
    setInterval(() => {
        RequestDivisa()
    }, 30000);   
}

function closeSesionLink(){
    let cerrarSesion = document.getElementById("cerrarSesion");

    //BORRADO DE STORAGE POR CIERRE DE SESION Y REDIRECCIONADO A LOGIN
    cerrarSesion.addEventListener("click", (e)=>{
        e.preventDefault();
        window.location = '../index.html';
        localStorage.clear("logged");
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
                window.location = '../index.html';
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
        filterTransactionsBySelected("", "movimientos", "movimientos");
        Bodyclean() === false && inicioLink();
        Bodyclean() === false && closeSesionLink();        
        break;
    case "cuenta" :
        Bodyclean("cuenta");
        Bodyclean() === false && cuentaLink();
        Bodyclean() === false && closeSesionLink();  
        break;
    case "transferencias" :
        Bodyclean("transferencias");
        filterTransactionsBySelected("transfDet", "bankTransfer", "bankTransfer");
        Bodyclean() === false && transferenciaLink();
        Bodyclean() === false && closeSesionLink();  
        break;
    case "CbuCvuAlias" :
        Bodyclean("CbuCvuAlias");
        Bodyclean() === false && transferenciaCbuCvuAliasLink();
        Bodyclean() === false && closeSesionLink();
        break;
    case "divisasBody" :
        Bodyclean("divisasBody");
        Bodyclean() === false && divisasPage();
        Bodyclean() === false && closeSesionLink();
        break;  
    default:
        break;
}

