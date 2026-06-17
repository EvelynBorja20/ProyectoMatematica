let clientes = JSON.parse(localStorage.getItem("clientes")) || [];

let clienteSeleccionado = null;

function guardarLocalStorage() {
  localStorage.setItem("clientes", JSON.stringify(clientes));
}

//GUARDAR CLIENTES
function guardarCliente() {
  let cedula = document.getElementById("client-id").value.trim();
  let nombre = document.getElementById("client-name").value.trim();
  let ingresos = obtenerNumero("client-income");
  let egresos = obtenerNumero("client-expenses");

  // Validar cédula
  if (cedula == "") {
    alert("Ingrese la cédula");
    return;
  }

  if (cedula.length != 10 || isNaN(cedula)) {
    alert("La cédula debe tener exactamente 10 números");
    return;
  }

  // Validar nombre
  if (nombre == "") {
    alert("Ingrese el nombre");
    return;
  }

  // Validar números
  if (!camposValidos(ingresos, egresos)) {
    alert("Ingrese ingresos y egresos válidos");
    return;
  }

  if (ingresos < 0 || egresos < 0) {
    alert("Los valores no pueden ser negativos");
    return;
  }

  // Buscar si existe
  let existente = buscarCliente(cedula);

  // Evitar repetidos
  if (existente != null && clienteSeleccionado == null) {
    alert("El cliente ya se encuentra registrado");
    return;
  }

  // Crear
  if (existente == null) {
    let cliente = {
      cedula: cedula,
      nombre: nombre,
      ingresos: ingresos,
      egresos: egresos,
    };

    clientes.push(cliente);

    alert("Cliente registrado");
  } else {
    existente.nombre = nombre;
    existente.ingresos = ingresos;
    existente.egresos = egresos;

    alert("Cliente actualizado");
  }

  guardarLocalStorage();

  pintarClientes();

  limpiarFormulario();
}

//Buscar clientes
function buscarCliente(cedula) {
  for (let i = 0; i < clientes.length; i++) {
    if (clientes[i].cedula == cedula) {
      return clientes[i];
    }
  }

  return null;
}

//pintar tabla
function pintarClientes() {
  console.log(clientes);
  let tabla = document.getElementById("clients-body");

  let contenido = "";

  for (let i = 0; i < clientes.length; i++) {
    let cliente = clientes[i];

    contenido += `
      <tr>
        <td>${cliente.cedula}</td>
        <td>${cliente.nombre}</td>
        <td>${formatearDinero(cliente.ingresos)}</td>
        <td>${formatearDinero(cliente.egresos)}</td>

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

//ACTULIZAR
function seleccionarCliente(cedula) {
  let cliente = buscarCliente(cedula);

  if (cliente != null) {
    clienteSeleccionado = cliente;

    document.getElementById("client-id").value = cliente.cedula;

    document.getElementById("client-name").value = cliente.nombre;

    document.getElementById("client-income").value = cliente.ingresos;

    document.getElementById("client-expenses").value = cliente.egresos;
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
}

// limpiar
function limpiarFormulario() {
  document.getElementById("client-id").value = "";
  document.getElementById("client-name").value = "";
  document.getElementById("client-income").value = "";
  document.getElementById("client-expenses").value = "";

  clienteSeleccionado = null;
}
document
  .getElementById("save-client")
  .addEventListener("click", guardarCliente);

document
  .getElementById("clear-client")
  .addEventListener("click", limpiarFormulario);

pintarClientes();
