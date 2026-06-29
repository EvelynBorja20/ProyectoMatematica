let clientes = JSON.parse(localStorage.getItem("clientes")) || [];

let clienteSeleccionado = null;

function guardarLocalStorage() {
  localStorage.setItem("clientes", JSON.stringify(clientes));
}

// VERIFICAR SOBREGIRO EN TIEMPO REAL
function verificarSobregiro() {
  let ingresos = obtenerNumero("client-income") || 0;
  let egresos = obtenerNumero("client-expenses") || 0;
  let ingresosExtra = obtenerNumero("client-extra-income") || 0;

  let ingresosTotales = ingresos + ingresosExtra;
  let aviso = document.getElementById("overdraft-warning");

  // Si el egreso es mayor que el total de ingresos, muestra el aviso antes de guardar
  if (egresos > ingresosTotales && egresos > 0) {
    aviso.style.display = "block";
  } else {
    aviso.style.display = "none";
  }
}

// GUARDAR CLIENTES
function guardarCliente() {
  let cedula = document.getElementById("client-id").value.trim();
  let nombre = document.getElementById("client-name").value.trim();
  let ingresos = obtenerNumero("client-income");
  let egresos = obtenerNumero("client-expenses");
  let ingresosExtra = obtenerNumero("client-extra-income") || 0; // Si está vacío, toma 0

  // Validar cédula
  if (cedula == "") {
    mostrarAlerta("warning", "Ingrese la cédula.");
    return;
  }

  if (cedula.length != 10 || isNaN(cedula)) {
    mostrarAlerta("error", "La cédula debe tener exactamente 10 números.");
    return;
  }

  // Validar nombre
  if (nombre == "") {
    mostrarAlerta("warning", "Ingrese el nombre del cliente.");
    return;
  }

  // Validar números conservando tu función original 'camposValidos'
  if (!camposValidos(ingresos, egresos) || isNaN(ingresosExtra)) {
    mostrarAlerta("warning", "Ingrese ingresos y egresos válidos.");
    return;
  }

  if (ingresos < 0 || egresos < 0 || ingresosExtra < 0) {
    mostrarAlerta("error", "Los valores no pueden ser negativos.");
    return;
  }

  // Buscar si existe
  let existente = buscarCliente(cedula);

  // Evitar repetidos
  if (existente != null && clienteSeleccionado == null) {
    mostrarAlerta("info", "El cliente ya se encuentra registrado.");
    return;
  }

  // Crear o Actualizar
  if (existente == null) {
    let cliente = {
      cedula: cedula,
      nombre: nombre,
      ingresos: ingresos,
      egresos: egresos,
      ingresosExtra: ingresosExtra // Guardamos el nuevo dato
    };

    clientes.push(cliente);
    mostrarAlerta("success", "Cliente registrado correctamente.");
  } else {
    existente.nombre = nombre;
    existente.ingresos = ingresos;
    existente.egresos = egresos;
    existente.ingresosExtra = ingresosExtra; // Actualizamos el nuevo dato

    mostrarAlerta("success", "Cliente actualizado correctamente.");
  }

  guardarLocalStorage();

  pintarClientes();

  limpiarFormulario();
}

// Buscar clientes
function buscarCliente(cedula) {
  for (let i = 0; i < clientes.length; i++) {
    if (clientes[i].cedula == cedula) {
      return clientes[i];
    }
  }
  return null;
}

// pintar tabla
function pintarClientes() {
  console.log(clientes);
  let tabla = document.getElementById("clients-body");

  let contenido = "";

  for (let i = 0; i < clientes.length; i++) {
    let cliente = clientes[i];
    // Evita errores visuales con clientes antiguos que no tengan ingresosExtra en el LocalStorage
    let extra = cliente.ingresosExtra !== undefined ? cliente.ingresosExtra : 0;

    contenido += `
      <tr>
        <td>${cliente.cedula}</td>
        <td>${cliente.nombre}</td>
        <td>${formatearDinero(cliente.ingresos)}</td>
        <td>${formatearDinero(cliente.egresos)}</td>
        <td>${formatearDinero(extra)}</td>

        <td>
          <button onclick="seleccionarCliente('${cliente.cedula}')">
            Actualizar
          </button>

          <button onclick="eliminarCliente('${cliente.cedula}')">
            Eliminar
          </button>
        </td>

      </tr>
    `;
  }

  tabla.innerHTML = contenido;
}

// ACTUALIZAR
function seleccionarCliente(cedula) {
  let cliente = buscarCliente(cedula);

  if (cliente != null) {
    clienteSeleccionado = cliente;

    document.getElementById("client-id").value = cliente.cedula;
    document.getElementById("client-name").value = cliente.nombre;
    document.getElementById("client-income").value = cliente.ingresos;
    document.getElementById("client-expenses").value = cliente.egresos;
    document.getElementById("client-extra-income").value = cliente.ingresosExtra !== undefined ? cliente.ingresosExtra : 0;

    // Al cargar los datos en la tabla de arriba, valida si está sobregirado inmediatamente
    verificarSobregiro();
  }
}

// eliminar
function eliminarCliente(cedula) {
  let confirmar = confirm("¿Desea eliminar el cliente?");
  if (!confirmar) {
    return;
  }

  for (let i = 0; i < clientes.length; i++) {
    if (clientes[i].cedula == cedula) {
      clientes.splice(i, 1);
      break;
    }
  }

  guardarLocalStorage();
  pintarClientes();
  mostrarAlerta("success", "Cliente eliminado correctamente.");
}

// limpiar
function limpiarFormulario() {
  document.getElementById("client-id").value = "";
  document.getElementById("client-name").value = "";
  document.getElementById("client-income").value = "";
  document.getElementById("client-expenses").value = "";
  document.getElementById("client-extra-income").value = ""; 
  
  document.getElementById("overdraft-warning").style.display = "none"; // Oculta el aviso al limpiar

  clienteSeleccionado = null;
}

document
  .getElementById("save-client")
  .addEventListener("click", guardarCliente);

document
  .getElementById("clear-client")
  .addEventListener("click", limpiarFormulario);

// Escuchadores de eventos para controlar el aviso en tiempo real mientras el usuario escribe
document.getElementById("client-income").addEventListener("input", verificarSobregiro);
document.getElementById("client-expenses").addEventListener("input", verificarSobregiro);
document.getElementById("client-extra-income").addEventListener("input", verificarSobregiro);

pintarClientes();
