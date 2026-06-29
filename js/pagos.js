// Resguardos por si faltan en utils.js
if (typeof formatearDinero !== "function") {
  window.formatearDinero = (val) => "$" + Number(val).toFixed(2);
}

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
/**
 * Busca los créditos asociados
 * a la cédula ingresada por el usuario
 * y genera los botones para seleccionar
 * cada uno de ellos.
 */
function buscarClientePago() {
  // Obtiene la cédula ingresada
  let cedula = document.getElementById("payment-client-id").value.trim();

  // Verifica que la cédula tenga
  // exactamente diez dígitos numéricos
  if (cedula.length != 10 || isNaN(cedula)) {
    alert("Ingrese una cédula válida de 10 dígitos");
    return;
  }

  // Busca todos los créditos
  // registrados para el cliente
  let listaCreditos = buscarCreditos(cedula);

  // Comprueba que el cliente
  // tenga créditos registrados
  if (listaCreditos.length == 0) {
    alert("El cliente no tiene créditos registrados");
    return;
  }

  // Obtiene el contenedor donde
  // se mostrarán los botones
  let contenedor = document.getElementById("lista-creditos");

  let html = "";
  let primerCreditoDisponible = -1;
  // Genera un botón para cada
  // crédito encontrado
  for (let i = 0; i < listaCreditos.length; i++) {
    if (listaCreditos[i].estado === "Pagado") {
      continue;
    }
    if (primerCreditoDisponible === -1) {
      primerCreditoDisponible = i;
    }
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

  // Inserta los botones en la interfaz
  contenedor.innerHTML = html;
  if (primerCreditoDisponible !== -1) {
    seleccionarCredito(primerCreditoDisponible);
  } else {
    creditoSeleccionado = null;
    contenedor.innerHTML =
      "<p style='color:green;font-weight:bold'>✅ Todos los créditos han sido cancelados.</p>";

    document.getElementById("payment-client-card").style.display = "none";
    document.getElementById("payment-result").style.display = "none";
    return;
  }
}

// =======================
// ACTUALIZAR ESTADOS (Simulación de tiempo y moras)
// =======================
/**
 * Actualiza el estado de las cuotas
 * considerando la fecha actual o una
 * fecha simulada ingresada por el usuario.
 *
 * Si una cuota vence y no ha sido pagada,
 * cambia su estado a "Atrasada" y calcula
 * automáticamente el interés por mora.
 */
function actualizarEstados() {
  // Verifica que exista un crédito
  // seleccionado con cuotas registradas
  if (!creditoSeleccionado || !creditoSeleccionado.cuotas) {
    return;
  }

  // Utiliza la fecha actual como referencia
  let hoy = new Date();

  // Obtiene la fecha simulada ingresada
  // por el usuario, si existe
  let fechaSimuladaInput = document.getElementById(
    "simulation-current-date",
  ).value;

  // Reemplaza la fecha actual por la
  // fecha simulada cuando corresponda
  if (fechaSimuladaInput) {
    hoy = new Date(fechaSimuladaInput + "T23:59:59");
  }

  // Define la tasa anual de interés por mora
  let tasaMoraAnual = 36;

  // Recorre todas las cuotas del crédito
  creditoSeleccionado.cuotas.forEach((cuota) => {
    // Procesa únicamente cuotas
    // pendientes o atrasadas
    if (cuota.estado == "Pendiente" || cuota.estado == "Atrasada") {
      // Obtiene la fecha de vencimiento
      let fechaVencimiento = new Date(cuota.fechaPago + "T23:59:59");

      // Verifica si la cuota ya venció
      if (hoy > fechaVencimiento) {
        // Cambia el estado de la cuota
        cuota.estado = "Atrasada";

        // Calcula los días de retraso
        let milisegundosDiferencia = hoy - fechaVencimiento;

        let diasRetraso = Math.floor(
          milisegundosDiferencia / (1000 * 60 * 60 * 24),
        );

        // Calcula la tasa diaria de mora
        let tasaDiariaMora = tasaMoraAnual / 100 / 360;

        // Calcula el interés por mora
        cuota.interesMora =
          (cuota.valorOriginal || cuota.valor) * tasaDiariaMora * diasRetraso;

        // Actualiza el valor total
        // de la cuota
        cuota.valor = (cuota.valorOriginal || cuota.valor) + cuota.interesMora;
      } else {
        // Mantiene la cuota como pendiente
        cuota.estado = "Pendiente";

        // Elimina el interés por mora
        cuota.interesMora = 0;

        // Restaura el valor original
        cuota.valor = cuota.valorOriginal || cuota.valor;
      }
    }
  });

  // Guarda los cambios realizados
  guardarLocalStorage();
}

// =======================
// SELECCIONAR CRÉDITO
// =======================
/**
 * Selecciona uno de los créditos
 * encontrados para un cliente y
 * actualiza la información mostrada
 * en la interfaz.
 *
 * @param {number} indice - Posición del crédito dentro de la lista.
 */
function seleccionarCredito(indice) {
  // Obtiene la cédula ingresada
  let cedula = document.getElementById("payment-client-id").value.trim();

  // Recupera los créditos
  // asociados al cliente
  let listaCreditos = buscarCreditos(cedula);

  // Almacena el crédito seleccionado
  creditoSeleccionado = listaCreditos[indice];

  // Actualiza el estado de las cuotas
  actualizarEstados();

  // Muestra la información
  // del cliente y del crédito
  document.getElementById("payment-client-card").style.display = "block";
  document.getElementById("payment-result").style.display = "block";

  // Actualiza los datos generales
  // del crédito seleccionado
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

  // Elimina la selección visual
  // de todos los botones
  let botones = document.querySelectorAll(".btn-credito");

  for (let i = 0; i < botones.length; i++) {
    botones[i].classList.remove("activo");
  }

  // Resalta el botón correspondiente
  // al crédito seleccionado
  let botonActual = document.getElementById(`credito-${indice}`);

  if (botonActual) {
    botonActual.classList.add("activo");
  }

  // Actualiza la tabla
  // del cronograma de pagos
  pintarPagos();
}

// =======================
// PINTAR PAGOS
// =======================
/**
 * Genera dinámicamente la tabla
 * de cuotas del crédito seleccionado,
 * mostrando el estado de cada pago
 * y las acciones disponibles.
 */
function pintarPagos() {
  // Obtiene el cuerpo de la tabla
  // donde se mostrarán las cuotas
  let tabla = document.getElementById("payment-body");

  // Almacena el contenido HTML
  // que será generado dinámicamente
  let contenido = "";

  // Recorre todas las cuotas
  // del crédito seleccionado
  for (let i = 0; i < creditoSeleccionado.cuotas.length; i++) {
    let cuota = creditoSeleccionado.cuotas[i];

    // Genera el detalle del interés
    // por mora cuando exista
    let detalleMora =
      cuota.interesMora > 0
        ? `<br><small style="color:red">+${formatearDinero(cuota.interesMora)} Mora</small>`
        : "";

    // Construye una fila de la tabla
    contenido += `
      <tr>

        <!-- Número de cuota -->
        <td>${cuota.numero}</td>

        <!-- Fecha programada de pago -->
        <td>${cuota.fechaPago}</td>

        <!-- Fecha en la que realmente se pagó -->
        <td>${cuota.fechaRealPago ?? "-"}</td>

        <!-- Valor de la cuota -->
        <td>
          ${formatearDinero(cuota.valor)}
          ${detalleMora}
        </td>

        <!-- Estado actual de la cuota -->
        <td
          style="font-weight:bold; color:${
            cuota.estado === "Atrasada"
              ? "red"
              : cuota.estado === "Pendiente"
                ? "orange"
                : "green"
          }">

          ${cuota.estado}

        </td>

        <!-- Acción disponible -->
        <td>

          ${
            cuota.estado == "Pendiente" || cuota.estado == "Atrasada"
              ? `<button onclick="pagarCuota(${cuota.numero})">
                  Pagar
                 </button>`
              : "✔"
          }

        </td>

      </tr>
    `;
  }

  // Inserta el contenido generado
  // dentro de la tabla
  tabla.innerHTML = contenido;
}
// =======================
// PAGAR CUOTA
// =======================
/**
 * Registra el pago de una cuota,
 * actualiza el saldo del crédito
 * y modifica el estado de la
 * obligación financiera.
 *
 * @param {number} numeroCuota - Número de la cuota que será pagada.
 */
function pagarCuota(numeroCuota) {
  // Busca la cuota correspondiente
  // al número recibido
  let cuota = creditoSeleccionado.cuotas.find((c) => c.numero == numeroCuota);

  // Verifica que la cuota exista
  // y que aún no haya sido pagada
  if (
    cuota == null ||
    cuota.estado == "Al corriente" ||
    cuota.estado == "Pagada con atraso"
  ) {
    return;
  }

  // Obtiene la fecha actual
  let hoy = new Date();

  // Registra la fecha en que
  // se realizó el pago
  cuota.fechaRealPago = hoy.toISOString().split("T")[0];

  // Obtiene la fecha de vencimiento
  let vencimiento = new Date(cuota.fechaPago + "T23:59:59");

  // Determina si el pago fue
  // realizado a tiempo o con retraso
  if (hoy > vencimiento) {
    cuota.estado = "Pagada con atraso";
  } else {
    cuota.estado = "Al corriente";
  }

  // Descuenta el valor pagado
  // del saldo del crédito
  creditoSeleccionado.saldo -= cuota.valor;

  // Acumula el monto pagado
  creditoSeleccionado.totalPagado += cuota.valor;

  // Evita que el saldo sea negativo
  if (creditoSeleccionado.saldo < 0) {
    creditoSeleccionado.saldo = 0;
  }

  // Verifica si aún existen cuotas
  // Verifica si todas las cuotas ya fueron pagadas
  let todasPagadas = creditoSeleccionado.cuotas.every(
    (c) => c.estado === "Al corriente" || c.estado === "Pagada con atraso",
  );

  // Si todas están pagadas,
  // marca el crédito como pagado
  if (todasPagadas) {
    creditoSeleccionado.estado = "Pagado";
  }

  // Guarda los cambios realizados
  guardarLocalStorage();

  actualizarEstados();

  if (creditoSeleccionado.estado === "Pagado") {
    buscarClientePago();
    return;
  }
  // Actualiza la información
  // mostrada en la interfaz
  document.getElementById("payment-balance").textContent = formatearDinero(
    creditoSeleccionado.saldo,
  );

  document.getElementById("remaining-balance").textContent = formatearDinero(
    creditoSeleccionado.saldo,
  );

  document.getElementById("payment-credit-status").textContent =
    creditoSeleccionado.estado;

  document.getElementById("payment-status").textContent =
    creditoSeleccionado.estado;

  // Recalcula los estados y
  // actualiza la tabla de pagos
  actualizarEstados();
  pintarPagos();
}

// =======================
// VALIDAR FECHA SIMULADA
// =======================
/**
 * Valida la fecha simulada ingresada
 * por el usuario, actualiza el estado
 * de las cuotas y refresca la
 * información del crédito.
 */
function validarFechaSimulada() {
  // Verifica que exista un crédito seleccionado
  if (!creditoSeleccionado) {
    alert("Primero busque un cliente y seleccione un crédito.");

    return;
  }

  // Recalcula el estado de las cuotas
  // utilizando la fecha simulada
  actualizarEstados();

  // Actualiza el cronograma de pagos
  pintarPagos();

  // Refresca el saldo mostrado
  // en la interfaz
  document.getElementById("payment-balance").textContent = formatearDinero(
    creditoSeleccionado.saldo,
  );

  document.getElementById("remaining-balance").textContent = formatearDinero(
    creditoSeleccionado.saldo,
  );
}

// =======================
// REINICIAR SIMULADOR
// =======================
/**
 * Reinicia completamente el simulador,
 * eliminando toda la información
 * almacenada en el navegador y
 * recargando la aplicación.
 */
function reiniciarSimulador() {
  // Solicita confirmación antes
  // de eliminar los datos
  if (
    confirm(
      "¿Estás seguro de que deseas borrar todos los clientes, créditos y pagos registrados?",
    )
  ) {
    // Elimina toda la información
    // almacenada en el navegador
    localStorage.clear();

    // Recarga la aplicación para
    // iniciar el simulador desde cero
    location.reload();
  }
}

// =======================
// ASIGNACIÓN DE EVENTOS
// =======================
// =========================
// ASIGNACIÓN DE EVENTOS
// Vincula los botones de la
// interfaz con las funciones
// correspondientes.
// =========================

// Asocia el botón de búsqueda
// con la función que localiza
// los créditos del cliente
document
  .getElementById("search-payment-client")
  .addEventListener("click", buscarClientePago);

// Asocia el botón de reinicio
// con la función que elimina
// la información del simulador
document
  .getElementById("reset-simulator-btn")
  .addEventListener("click", reiniciarSimulador);

// Asocia el botón de validación
// con la función que procesa
// la fecha simulada
document
  .getElementById("validate-simulation-btn")
  .addEventListener("click", validarFechaSimulada);

// =========================
// EXPOSICIÓN GLOBAL
// Permite acceder a las
// funciones desde eventos
// definidos en el HTML.
// =========================

// Hace accesible la función
// para seleccionar un crédito
window.seleccionarCredito = seleccionarCredito;

// Hace accesible la función
// para registrar el pago
// de una cuota
window.pagarCuota = pagarCuota;
