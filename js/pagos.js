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
// BUSCAR CLIENTE
// =======================

function buscarClientePago() {
  let cedula = document.getElementById("payment-client-id").value.trim();

  if (cedula.length != 10 || isNaN(cedula)) {
    alert("Ingrese una cédula válida");
    return;
  }

  let listaCreditos = buscarCreditos(cedula);

  if (listaCreditos.length == 0) {
    alert("El cliente no tiene créditos");
    return;
  }

  let contenedor = document.getElementById("lista-creditos");

  let html = "";

  for (let i = 0; i < listaCreditos.length; i++) {
    html += `
  <button
    id="credito-${i}"
    class="btn-credito"
    onclick="seleccionarCredito(${i})">
    Crédito ${i + 1}
  </button>
`;
  }

  contenedor.innerHTML = html;

  seleccionarCredito(0);
}
function seleccionarCredito(indice) {
  let cedula = document.getElementById("payment-client-id").value.trim();

  let listaCreditos = buscarCreditos(cedula);

  creditoSeleccionado = listaCreditos[indice];

  document.getElementById("payment-client-card").style.display = "block";

  document.getElementById("payment-id").textContent =
    creditoSeleccionado.cedula;

  document.getElementById("payment-name").textContent =
    creditoSeleccionado.nombre;

 

  document.getElementById("payment-balance").textContent = formatearDinero(
    creditoSeleccionado.saldo,
  );



  document.getElementById("payment-credit-status").textContent =
    creditoSeleccionado.estado;
 

  document.getElementById("remaining-balance").textContent = formatearDinero(
    creditoSeleccionado.saldo,
  );

  document.getElementById("payment-status").textContent =
    creditoSeleccionado.estado;
  let botones = document.querySelectorAll(".btn-credito");

  for (let i = 0; i < botones.length; i++) {
    botones[i].classList.remove("activo");
  }

  document.getElementById(`credito-${indice}`).classList.add("activo");
  pintarPagos();
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
  ${
    cuota.estado == "Pagada"
      ? '<span class="pagada">✓</span>'
      : `<button class="btn-pagar"
        onclick="pagarCuota(${cuota.numero})">
  Pagar
</button>`
  }
</td>
      </tr>
    `;
  }

  tabla.innerHTML = contenido;
}

function pagarCuota(numeroCuota) {
  let cuota = creditoSeleccionado.cuotas[numeroCuota - 1];

  if (cuota.estado == "Pagada") {
    return;
  }

  cuota.estado = "Pagada";

  cuota.fecha = new Date().toLocaleDateString("es-EC");

  creditoSeleccionado.saldo = 0;

  for (let i = 0; i < creditoSeleccionado.cuotas.length; i++) {
    if (creditoSeleccionado.cuotas[i].estado == "Pendiente") {
      creditoSeleccionado.saldo += creditoSeleccionado.cuotas[i].valor;
    }
  }

  if (creditoSeleccionado.saldo < 0) {
    creditoSeleccionado.saldo = 0;
  }

  if (creditoSeleccionado.saldo == 0) {
    creditoSeleccionado.estado = "Pagado";
  }

  guardarLocalStorage();

  document.getElementById("payment-balance").textContent = formatearDinero(
    creditoSeleccionado.saldo,
  );

  document.getElementById("payment-credit-status").textContent =
    creditoSeleccionado.estado;

  document.getElementById("remaining-balance").textContent = formatearDinero(
    creditoSeleccionado.saldo,
  );

  document.getElementById("payment-status").textContent =
    creditoSeleccionado.estado;

  pintarPagos();
}
// =======================
// EVENTOS
// =======================

document
  .getElementById("search-payment-client")
  .addEventListener("click", buscarClientePago);
