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

function buscarCredito(cedula) {
  for (let i = 0; i < creditos.length; i++) {
    if (creditos[i].cedula == cedula) {
      return creditos[i];
    }
  }

  return null;
}

// =======================
// BUSCAR CLIENTE
// =======================

function buscarClientePago() {
  let cedula = document.getElementById("payment-client-id").value.trim();

  if (cedula.length != 10 || isNaN(cedula)) {
    alert("Ingrese una cédula válida");
    return;
  }

  let credito = buscarCredito(cedula);

  if (credito == null) {
    alert("El cliente no tiene créditos");
    return;
  }
  if (credito.estado == "Pagado") {
    alert("Este crédito ya está pagado");
  }
  creditoSeleccionado = credito;
  if (!credito.cuotas) {
    alert("Este crédito fue creado con una versión antigua");
    return;
  }
  document.getElementById("payment-client-card").style.display = "block";

  document.getElementById("payment-id").textContent = credito.cedula;

  document.getElementById("payment-name").textContent = credito.nombre;

  document.getElementById("payment-credit").textContent = formatearDinero(
    credito.monto,
  );

  document.getElementById("payment-balance").textContent = formatearDinero(
    credito.saldo,
  );

  document.getElementById("payment-cuota").textContent = formatearDinero(
    credito.cuota,
  );

  document.getElementById("payment-credit-status").textContent = credito.estado;
  document.getElementById("remaining-balance").textContent = formatearDinero(
    credito.saldo,
  );

  document.getElementById("payment-status").textContent = credito.estado;
  pintarPagos();
}

// =======================
// PROCESAR PAGO
// =======================

function procesarPago() {
  if (creditoSeleccionado == null) {
    alert("Busque un cliente");
    return;
  }

  let numeroCuota = obtenerNumero("payment-installment");
  numeroCuota = parseInt(numeroCuota);

  if (isNaN(numeroCuota) || numeroCuota <= 0) {
    alert("Ingrese una cuota válida");
    return;
  }

  if (numeroCuota > creditoSeleccionado.plazo) {
    alert("La cuota no existe");
    return;
  }

  let cuota = creditoSeleccionado.cuotas[numeroCuota - 1];

  if (cuota.estado == "Pagada") {
    alert("La cuota ya fue pagada");
    return;
  }

  if (creditoSeleccionado.saldo <= 0) {
    alert("El crédito ya está pagado");
    return;
  }
  cuota.estado = "Pagada";
  cuota.fecha = new Date().toLocaleDateString("es-EC");
  creditoSeleccionado.saldo =
    creditoSeleccionado.saldo - creditoSeleccionado.cuota;

  if (creditoSeleccionado.saldo < 0) {
    creditoSeleccionado.saldo = 0;
  }

  if (creditoSeleccionado.saldo == 0) {
    creditoSeleccionado.estado = "Pagado";
  }
  document.getElementById("payment-credit-status").textContent =
    creditoSeleccionado.estado;

  let pago = {
    cedula: creditoSeleccionado.cedula,
    cuota: numeroCuota,
    fecha: new Date().toLocaleDateString(),
    valor: creditoSeleccionado.cuota,
    estado: "Pagado",
  };

  pagos.push(pago);

  guardarLocalStorage();

  document.getElementById("payment-result").style.display = "block";

  document.getElementById("payment-status").textContent =
    creditoSeleccionado.estado;

  document.getElementById("remaining-balance").textContent = formatearDinero(
    creditoSeleccionado.saldo,
  );

  document.getElementById("payment-balance").textContent = formatearDinero(
    creditoSeleccionado.saldo,
  );

  pintarPagos();

  alert("Pago registrado");
  document.getElementById("payment-installment").value = "";
}

// =======================
// PINTAR PAGOS
// =======================

function pintarPagos() {
  console.log(creditoSeleccionado);
  console.log(document.getElementById("payment-body"));
  let tabla = document.getElementById("payment-body");

  let contenido = "";

  for (let i = 0; i < creditoSeleccionado.cuotas.length; i++) {
    let cuota = creditoSeleccionado.cuotas[i];

    contenido += `
      <tr>
        <td>${cuota.numero}</td>
        <td>${cuota.fecha || "-"}</td>
        <td>${formatearDinero(cuota.valor)}</td>
        <td>${cuota.estado}</td>
        <td>
          ${cuota.estado == "Pagada" ? "✓" : "⏳"}
        </td>
      </tr>
    `;
  }

  tabla.innerHTML = contenido;
}

// =======================
// EVENTOS
// =======================

document
  .getElementById("search-payment-client")
  .addEventListener("click", buscarClientePago);

document
  .getElementById("process-payment")
  .addEventListener("click", procesarPago);
