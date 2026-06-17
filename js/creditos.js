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
    formatearDinero(capacidadPago);

  document.getElementById("total-payment").textContent =
    formatearDinero(totalPagar);

  document.getElementById("monthly-payment").textContent =
    formatearDinero(cuota);

  if (cuota <= capacidadPago) {
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
// verficar creditos
// =========================

function tieneCredito(cedula) {
  for (let i = 0; i < creditos.length; i++) {
    if (creditos[i].cedula == cedula) {
      return true;
    }
  }

  return false;
}
// =========================
// sOLICITAR CREDITOS
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

  if (tieneCredito(clienteSeleccionado.cedula)) {
    alert("El cliente ya tiene un crédito");
    return;
  }
  let tipo = document.querySelector(
  'input[name="credit-type"]:checked'
).value;

// Crear las cuotas del crédito
let cuotas = [];

for (let i = 1; i <= plazoCalculado; i++) {

  cuotas.push({
    numero: i,
    valor: cuotaCalculada,
    estado: "Pendiente"
  });

}

let credito = {
  cedula: clienteSeleccionado.cedula,

  nombre: clienteSeleccionado.nombre,

  monto: montoCalculado,

  plazo: plazoCalculado,

  cuota: cuotaCalculada,

  saldo: montoCalculado,

  tasa: 15,

  tipo: tipo,

  estado: "Activo",

  cuotas: cuotas
};
   

  creditos.push(credito);

  guardarLocalStorage();
  console.log(creditos);
  alert("Crédito agregado");
  document.getElementById("credit-amount").value = "";
  document.getElementById("credit-months").value = "";

  clienteSeleccionado = null;

  document.getElementById("credit-client-card").style.display = "none";
  document.getElementById("credit-result").style.display = "none";

  document.getElementById("amortization-body").innerHTML = "";
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
