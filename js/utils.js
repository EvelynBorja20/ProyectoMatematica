// =========================
// UTILIDADES GENERALES
// =========================

function obtenerNumero(id) {
  return parseFloat(document.getElementById(id).value);
}

function formatearDinero(valor) {
  if (isNaN(valor)) {
    return "$ 0.00";
  }

  return "$ " + Number(valor).toFixed(2);
}
function mostrarResultado(id, valor) {
  document.getElementById(id).textContent = valor;
}

function camposValidos(...valores) {
  return valores.every((valor) => !isNaN(valor));
}
