// Resguardos por si faltan en utils.js
if (typeof formatearDinero !== 'function') { window.formatearDinero = (val) => "$" + Number(val).toFixed(2); }

let creditos = JSON.parse(localStorage.getItem("creditos")) || [];
let pagos = JSON.parse(localStorage.getItem("pagos")) || [];
let creditoSeleccionado = null;

// =======================
// GUARDAR LOCAL STORAGE
// =======================
function guardarLocalStorage() {
  localStorage.setItem("creditos", JSON.stringify(creditos));
  localStorage.setItem("pagos", JSON.stringify(pagos));
}

// =======================
// BUSCAR CRÉDITO
// =======================
function buscarCreditos(cedula) {
  let lista = [];
  for (let i = 0; i < creditos.length; i++) {
    if (creditos[i].cedula == cedula) {
      lista.push(creditos[i]);
    }
  }
  return lista;
}

// =======================
// BUSCAR CLIENTE PAGO
// =======================
function buscarClientePago() {
  let cedula = document.getElementById("payment-client-id").value.trim();

  if (cedula.length != 10 || isNaN(cedula)) {
    alert("Ingrese una cédula válida de 10 dígitos");
    return;
  }

  let listaCreditos = buscarCreditos(cedula);

  if (listaCreditos.length == 0) {
    alert("El cliente no tiene créditos registrados");
    return;
  }

  let contenedor = document.getElementById("lista-creditos");
  let html = "";

  for (let i = 0; i < listaCreditos.length; i++) {
    html += `
      <button
        id="credito-${i}"
        class="btn-credito"
        style="padding: 5px 10px; cursor: pointer;"
        onclick="seleccionarCredito(${i})">
        Crédito ${i + 1}
      </button>
    `;
  }

  contenedor.innerHTML = html;
  seleccionarCredito(0);
} 

// =======================
// ACTUALIZAR ESTADOS (Simulación de tiempo y moras)
// =======================
function actualizarEstados() {
  if (!creditoSeleccionado || !creditoSeleccionado.cuotas) return;
  
  // Usar la fecha del input de simulación si existe, de lo contrario usar hoy
  let hoy = new Date();
  let fechaSimuladaInput = document.getElementById("simulation-current-date").value;
  if (fechaSimuladaInput) {
    hoy = new Date(fechaSimuladaInput + "T23:59:59");
  }
  
  let tasaMoraAnual = 36; 

  creditoSeleccionado.cuotas.forEach(cuota => {
    if (cuota.estado == "Pendiente" || cuota.estado == "Atrasada") {
      let fechaVencimiento = new Date(cuota.fechaPago + "T23:59:59");
      
      if (hoy > fechaVencimiento) {
        cuota.estado = "Atrasada";
        let milisegundosDiferencia = hoy - fechaVencimiento;
        let diasRetraso = Math.floor(milisegundosDiferencia / (1000 * 60 * 60 * 24));
        
        let tasaDiariaMora = (tasaMoraAnual / 100) / 360;
        cuota.interesMora = (cuota.valorOriginal || cuota.valor) * tasaDiariaMora * diasRetraso;
        cuota.valor = (cuota.valorOriginal || cuota.valor) + cuota.interesMora;
      } else {
        cuota.estado = "Pendiente";
        cuota.interesMora = 0;
        cuota.valor = cuota.valorOriginal || cuota.valor;
      }
    }
  });
  guardarLocalStorage();
}

// =======================
// SELECCIONAR CRÉDITO
// =======================
function seleccionarCredito(indice) {
  let cedula = document.getElementById("payment-client-id").value.trim();
  let listaCreditos = buscarCreditos(cedula);

  creditoSeleccionado = listaCreditos[indice];

  actualizarEstados();

  document.getElementById("payment-client-card").style.display = "block";
  document.getElementById("payment-result").style.display = "block"; 

  document.getElementById("payment-id").textContent = creditoSeleccionado.cedula;
  document.getElementById("payment-name").textContent = creditoSeleccionado.nombre;
  document.getElementById("payment-balance").textContent = formatearDinero(creditoSeleccionado.saldo);
  document.getElementById("payment-credit-status").textContent = creditoSeleccionado.estado;
  document.getElementById("remaining-balance").textContent = formatearDinero(creditoSeleccionado.saldo);
  document.getElementById("payment-status").textContent = creditoSeleccionado.estado;

  let botones = document.querySelectorAll(".btn-credito");
  for (let i = 0; i < botones.length; i++) {
    botones[i].classList.remove("activo");
  }

  let botonActual = document.getElementById(`credito-${indice}`);
  if(botonActual) { botonActual.classList.add("activo"); }

  pintarPagos();
}

// =======================
// PINTAR PAGOS
// =======================
function pintarPagos(){
  let tabla = document.getElementById("payment-body");
  let contenido = "";

  for(let i = 0; i < creditoSeleccionado.cuotas.length; i++){
    let cuota = creditoSeleccionado.cuotas[i];
    let detalleMora = cuota.interesMora > 0 
      ? `<br><small style="color:red">+${formatearDinero(cuota.interesMora)} Mora</small>` 
      : '';

    contenido += `
      <tr>
        <td>${cuota.numero}</td>
        <td>${cuota.fechaPago}</td>
        <td>${cuota.fechaRealPago ?? "-"}</td>
        <td>${formatearDinero(cuota.valor)} ${detalleMora}</td>
        <td style="font-weight:bold; color:${cuota.estado === 'Atrasada' ? 'red' : cuota.estado === 'Pendiente' ? 'orange' : 'green'}">
            ${cuota.estado}
        </td>
        <td>
          ${cuota.estado == "Pendiente" || cuota.estado == "Atrasada"
            ? `<button onclick="pagarCuota(${cuota.numero})">Pagar</button>`
            : "✔"
          }
        </td>
      </tr>
    `;
  }
  tabla.innerHTML = contenido;
}

// =======================
// PAGAR CUOTA
// =======================
function pagarCuota(numeroCuota){
  let cuota = creditoSeleccionado.cuotas.find(c => c.numero == numeroCuota);

  if(cuota == null || cuota.estado == "Al corriente" || cuota.estado == "Pagada con atraso"){
    return;
  }

  let hoy = new Date();
  cuota.fechaRealPago = hoy.toISOString().split("T")[0];

  let vencimiento = new Date(cuota.fechaPago + "T23:59:59");

  if(hoy > vencimiento){
    cuota.estado = "Pagada con atraso";
  } else {
    cuota.estado = "Al corriente";
  }

  creditoSeleccionado.saldo -= cuota.valor;
  creditoSeleccionado.totalPagado += cuota.valor;

  if(creditoSeleccionado.saldo < 0){
    creditoSeleccionado.saldo = 0;
  }

  let pendientes = creditoSeleccionado.cuotas.filter(c =>
    c.estado == "Pendiente" || c.estado == "Atrasada"
  );
  
  if(pendientes.length == 0){
    creditoSeleccionado.estado = "Pagado";
  }
  
  guardarLocalStorage();

  document.getElementById("payment-balance").textContent = formatearDinero(creditoSeleccionado.saldo);
  document.getElementById("remaining-balance").textContent = formatearDinero(creditoSeleccionado.saldo);
  document.getElementById("payment-credit-status").textContent = creditoSeleccionado.estado;
  document.getElementById("payment-status").textContent = creditoSeleccionado.estado;

  actualizarEstados(); 
  pintarPagos();
}

// =======================
// VALIDAR FECHA SIMULADA
// =======================
function validarFechaSimulada() {
  if (!creditoSeleccionado) {
    alert("Primero busque un cliente y seleccione un crédito.");
    return;
  }
  actualizarEstados(); 
  pintarPagos(); 
  
  document.getElementById("payment-balance").textContent = formatearDinero(creditoSeleccionado.saldo);
  document.getElementById("remaining-balance").textContent = formatearDinero(creditoSeleccionado.saldo);
}

// =======================
// REINICIAR SIMULADOR
// =======================
function reiniciarSimulador() {
  if (confirm("¿Estás seguro de que deseas borrar todos los clientes, créditos y pagos registrados?")) {
    localStorage.clear(); 
    location.reload();    
  }
}

// =======================
// ASIGNACIÓN DE EVENTOS
// =======================
document
  .getElementById("search-payment-client")
  .addEventListener("click", buscarClientePago);

document
  .getElementById("reset-simulator-btn")
  .addEventListener("click", reiniciarSimulador);

document
  .getElementById("validate-simulation-btn")
  .addEventListener("click", validarFechaSimulada);

// Exposición global
window.seleccionarCredito = seleccionarCredito;
window.pagarCuota = pagarCuota;