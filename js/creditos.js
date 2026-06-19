let cuotaCalculada = 0;
let montoCalculado = 0;
let plazoCalculado = 0;
let creditoAprobado = false;
// =========================
// DATOS
// =========================

let clientes = JSON.parse(localStorage.getItem("clientes")) || [];
let creditos = JSON.parse(localStorage.getItem("creditos")) || [];

let clienteSeleccionado = null;

// =========================
// BUSCAR CLIENTE
// =========================

function buscarCliente(cedula) {
  for (let i = 0; i < clientes.length; i++) {
    if (clientes[i].cedula == cedula) {
      return clientes[i];
    }
  }

  return null;
}

// =========================
// BUSCAR CLIENTE CRÉDITO
// =========================

function buscarClienteCredito() {
  let cedula = document.getElementById("credit-client-id").value.trim();

  if (cedula.length != 10 || isNaN(cedula)) {
    alert("Ingrese una cédula válida");
    return;
  }

  let cliente = buscarCliente(cedula);

  if (cliente == null) {
    alert("Cliente no encontrado");
    return;
  }

  clienteSeleccionado = cliente;

  document.getElementById("credit-client-card").style.display = "block";

  document.getElementById("show-id").textContent = cliente.cedula;

  document.getElementById("show-name").textContent = cliente.nombre;

  document.getElementById("show-income").textContent = formatearDinero(
    cliente.ingresos,
  );

  document.getElementById("show-expenses").textContent = formatearDinero(
    cliente.egresos,
  );
}

function generarTablaFrances(monto, plazo, tasa) {
  let tabla = document.getElementById("amortization-body");

  let contenido = "";

  let saldo = monto;

  let tasaMensual = tasa / 100 / 12;

  let cuota = monto * (tasaMensual / (1 - Math.pow(1 + tasaMensual, -plazo)));

  for (let i = 1; i <= plazo; i++) {
    let interes = saldo * tasaMensual;

    let capital = cuota - interes;

    saldo = saldo - capital;

    if (saldo < 0) {
      saldo = 0;
    }

    contenido += `
      <tr>
        <td>${i}</td>
        <td>${formatearDinero(capital)}</td>
        <td>${formatearDinero(interes)}</td>
        <td>${formatearDinero(cuota)}</td>
        <td>${formatearDinero(saldo)}</td>
      </tr>
    `;
  }

  tabla.innerHTML = contenido;
}

function generarTablaAleman(monto, plazo, tasa) {
  let tabla = document.getElementById("amortization-body");

  let contenido = "";

  let saldo = monto;

  let tasaMensual = tasa / 100 / 12;

  let capital = monto / plazo;

  for (let i = 1; i <= plazo; i++) {
    let interes = saldo * tasaMensual;

    let cuota = capital + interes;

    saldo = saldo - capital;

    if (saldo < 0) {
      saldo = 0;
    }

    contenido += `
      <tr>
        <td>${i}</td>
        <td>${formatearDinero(capital)}</td>
        <td>${formatearDinero(interes)}</td>
        <td>${formatearDinero(cuota)}</td>
        <td>${formatearDinero(saldo)}</td>
      </tr>
    `;
  }

  tabla.innerHTML = contenido;
}

// =========================
// CALCULAR CRÉDITO
// =========================

function calcularCredito() {
  if (clienteSeleccionado == null) {
    alert("Primero busque un cliente");
    return;
  }

  let monto = obtenerNumero("credit-amount");
  let plazo = obtenerNumero("credit-months");
  let tipo = document.querySelector('input[name="credit-type"]:checked').value;

  let tasa = 15;

  if (!camposValidos(monto, plazo)) {
    alert("Ingrese valores válidos");
    return;
  }

  if (monto <= 0 || plazo <= 0) {
    alert("Los valores deben ser positivos");
    return;
  }

  // Capacidad de pago
  let disponible = clienteSeleccionado.ingresos - clienteSeleccionado.egresos;

  let capacidadPago = disponible * 0.4;
  let cuotasActuales = calcularCuotasActivas(clienteSeleccionado.cedula);

  let capacidadDisponible = capacidadPago - cuotasActuales;

  if (capacidadDisponible < 0) {
    capacidadDisponible = 0;
  }

  // Interés simple anual 15%

  let interes = monto * (tasa / 100) * (plazo / 12);

  let totalPagar = monto + interes;

  let cuota = totalPagar / plazo;

  cuotaCalculada = cuota;
  montoCalculado = monto;
  plazoCalculado = plazo;

  // Mostrar resultado

  document.getElementById("credit-result").style.display = "block";

  document.getElementById("capacity-payment").textContent =
    formatearDinero(capacidadDisponible);

  document.getElementById("total-payment").textContent =
    formatearDinero(totalPagar);

  document.getElementById("monthly-payment").textContent =
    formatearDinero(cuota);

  if (capacidadDisponible > 0 && cuota <= capacidadDisponible) {
    creditoAprobado = true;
    document.getElementById("credit-status").textContent =
      "RESULTADO: APROBADO";
  } else {
    creditoAprobado = false;
    document.getElementById("credit-status").textContent =
      "RESULTADO: RECHAZADO";
  }

  if (tipo == "frances") {
    generarTablaFrances(monto, plazo, tasa);
  } else {
    generarTablaAleman(monto, plazo, tasa);
  }
}

// =========================
// FUNCION LOCAL STORAGE
// =========================

function guardarLocalStorage() {
  localStorage.setItem("creditos", JSON.stringify(creditos));
}

// =========================
// sOLICITAR CREDITOS (CORREGIDO)
// =========================
function solicitarCredito() {
  if (clienteSeleccionado == null) {
    alert("Debe buscar un cliente");
    return;
  }

  if (!creditoAprobado) {
    alert("El crédito no está aprobado");
    return;
  }
  if (montoCalculado <= 0 || plazoCalculado <= 0) {
    alert("Primero calcule el crédito");
    return;
  }

  let tipo = document.querySelector('input[name="credit-type"]:checked').value;
  let fechaInicio = document.getElementById("credit-start-date").value;

  if(fechaInicio == ""){
    alert("Seleccione la fecha de inicio.");
    return;
  }

  let cuotas = [];
  let fecha = new Date(fechaInicio + "T00:00:00");
  
  let saldoRestante = montoCalculado;
  let tasaAnual = 15;
  let tasaMensual = tasaAnual / 100 / 12;
  
  // Fórmulas financieras reales aplicadas a la base de datos
  let cuotaFijaFrances = montoCalculado * (tasaMensual / (1 - Math.pow(1 + tasaMensual, -plazoCalculado)));
  let capitalFijoAleman = montoCalculado / plazoCalculado;
  
  let totalMontoConInteres = 0;

  for(let i = 1; i <= plazoCalculado; i++){
    let fechaPago = new Date(fecha);
    fechaPago.setMonth(fechaPago.getMonth() + i); // Siguiente mes

    let interesMes = saldoRestante * tasaMensual;
    let capitalMes = 0;
    let valorCuota = 0;

    if (tipo === "frances") {
      capitalMes = cuotaFijaFrances - interesMes;
      valorCuota = cuotaFijaFrances;
    } else { 
      capitalMes = capitalFijoAleman;
      valorCuota = capitalFijoAleman + interesMes;
    }

    saldoRestante -= capitalMes;
    if (saldoRestante < 0 || i === plazoCalculado) saldoRestante = 0;

    totalMontoConInteres += valorCuota;

    // Inyección de datos completa para la tabla
    cuotas.push({
        numero: i,
        capital: capitalMes,
        interes: interesMes,
        valor: valorCuota,
        valorOriginal: valorCuota, 
        fechaPago: fechaPago.toISOString().split("T")[0],
        fechaRealPago: null,
        estado: "Pendiente",
        interesMora: 0
    });
  }

  let credito = {
    cedula: clienteSeleccionado.cedula,
    nombre: clienteSeleccionado.nombre,
    monto: montoCalculado,
    plazo: plazoCalculado,
    cuota: tipo === "frances" ? cuotaFijaFrances : totalMontoConInteres / plazoCalculado, 
    saldo: totalMontoConInteres, 
    tasa: tasaAnual,
    tipo: tipo,
    estado: "Activo",
    fechaInicio: fechaInicio,
    totalPagado: 0,
    cuotas: cuotas
  };

  creditos.push(credito);
  guardarLocalStorage();
  
  alert("Crédito solicitado con éxito mediante Sistema " + (tipo === "frances" ? "Francés" : "Alemán"));
  
  // Limpieza y reinicio de interfaz
  document.getElementById("credit-amount").value = "";
  document.getElementById("credit-months").value = "";
  document.getElementById("credit-start-date").value = "";
  clienteSeleccionado = null;
  document.getElementById("credit-client-card").style.display = "none";
  document.getElementById("credit-result").style.display = "none";
  document.getElementById("amortization-body").innerHTML = "";
  document.getElementById("credit-client-id").value = "";
  cuotaCalculada = 0;
  montoCalculado = 0;
  plazoCalculado = 0;
  creditoAprobado = false;
}
 
//--Actualizacion de los Estados de cuenta--//
function actualizarEstadoCuotas(credito){

    let hoy = new Date();
    credito.cuotas.forEach(cuota=>{

        if(cuota.estado=="Pendiente" ){
            let fecha=new Date(cuota.fechaPago + "T23:59:59");
            if(hoy>fecha){
                cuota.estado="Atrasada";
            }
        }
    });

    guardarLocalStorage();
}

//--pago de las cuotas--//
function pagarCuota(credito, numero){

    let cuota = credito.cuotas.find(c=>c.numero==numero);

    if(cuota==null){
        return;
    }

    if(
        cuota.estado=="Al corriente" ||
        cuota.estado=="Pagada con atraso"
    ){
        return;
    }

    let hoy = new Date();
    let vencimiento = new Date(cuota.fechaPago + "T23:59:59");
    cuota.fechaRealPago = hoy.toISOString().split("T")[0];

    if(hoy>vencimiento){
        cuota.estado="Pagada con atraso";
    }else{
        cuota.estado="Al corriente";
    }

    credito.saldo-=cuota.valor;
    credito.totalPagado+=cuota.valor;

    if(credito.saldo<0){
        credito.saldo=0;
    }

    let pendientes=credito.cuotas.filter(c=>
        c.estado=="Pendiente" ||
        c.estado=="Atrasada"
    );
    if(pendientes.length==0){
        credito.estado="Pagado";
    }
    guardarLocalStorage();
}

// =========================
// Cuotas activas
// =========================

function calcularCuotasActivas(cedula) {
  let total = 0;

  for (let i = 0; i < creditos.length; i++) {
    if (creditos[i].cedula == cedula && creditos[i].estado == "Activo") {
      total += creditos[i].cuota;
    }
  }

  return total;
}

// =========================
// EVENTOS
// =========================

document
  .getElementById("search-client-btn")
  .addEventListener("click", buscarClienteCredito);

document
  .getElementById("calculate-credit")
  .addEventListener("click", calcularCredito);

document
  .getElementById("save-credit")
  .addEventListener("click", solicitarCredito);
