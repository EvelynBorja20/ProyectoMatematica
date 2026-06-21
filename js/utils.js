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


function mostrarAlerta(mensaje) {
  let alertaAnterior = document.querySelector(".overlay-alerta");

  if (alertaAnterior) {
    alertaAnterior.remove();
  }

  let overlay = document.createElement("div");

  overlay.className = "overlay-alerta";

  overlay.innerHTML = `
    <div class="alerta-modal">
      <div class="alerta-check">
        <i class="fa-solid fa-check"></i>
      </div>

      <h2>¡Éxito!</h2>

      <p>${mensaje}</p>
    </div>
  `;

  document.body.appendChild(overlay);

  setTimeout(() => {
    overlay.classList.add("mostrar");
  }, 20);

  setTimeout(() => {
    overlay.classList.remove("mostrar");

    setTimeout(() => {
      overlay.remove();
    }, 300);
  }, 2200);
}