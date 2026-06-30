// =========================
// UTILIDADES GENERALES
// Funciones reutilizables
// utilizadas en todas las
// calculadoras del sistema.
// =========================


/**
 * Obtiene el valor numérico de un campo
 * de entrada a partir de su identificador.
 *
 * @param {string} id - ID del elemento HTML.
 * @returns {number} Valor convertido a número decimal.
 */
function obtenerNumero(id) {
  return parseFloat(document.getElementById(id).value);
}


/**
 * Convierte un número al formato de moneda.
 * Si el valor no es válido, devuelve $ 0.00.
 *
 * @param {number} valor - Número a formatear.
 * @returns {string} Valor con formato monetario.
 */
function formatearDinero(valor) {
  if (isNaN(valor)) {
    return "$ 0.00";
  }

  return "$ " + Number(valor).toFixed(2);
}


/**
 * Muestra un resultado dentro del elemento
 * indicado mediante su identificador.
 *
 * @param {string} id - ID del elemento donde se mostrará el resultado.
 * @param {string} valor - Texto que se visualizará.
 */
function mostrarResultado(id, valor) {
  document.getElementById(id).textContent = valor;
}


/**
 * Verifica que todos los valores recibidos
 * sean números válidos.
 *
 * @param {...number} valores - Conjunto de valores a validar.
 * @returns {boolean} true si todos son válidos.
 */
function camposValidos(...valores) {
  return valores.every((valor) => !isNaN(valor));
}


/**
 * Muestra una ventana emergente indicando
 * que una operación fue realizada con éxito.
 * Si ya existe una alerta visible, la reemplaza.
 *
 * @param {string} mensaje - Mensaje que aparecerá en la alerta.
 */
function mostrarAlerta(mensaje) {

  // Elimina una alerta anterior si existe
  let alertaAnterior = document.querySelector(".overlay-alerta");

  if (alertaAnterior) {
    alertaAnterior.remove();
  }

  // Crea el contenedor principal de la alerta
  let overlay = document.createElement("div");
  overlay.className = "overlay-alerta";

  // Contenido HTML de la ventana emergente
  overlay.innerHTML = `
    <div class="alerta-modal">
      <div class="alerta-check">
        <i class="fa-solid fa-check"></i>
      </div>

      <h2>¡Éxito!</h2>

      <p>${mensaje}</p>
    </div>
  `;

  // Inserta la alerta en la página
  document.body.appendChild(overlay);

  // Activa la animación de aparición
  setTimeout(() => {
    overlay.classList.add("mostrar");
  }, 20);

  // Oculta automáticamente la alerta
  setTimeout(() => {
    overlay.classList.remove("mostrar");

    // Elimina el elemento del DOM
    setTimeout(() => {
      overlay.remove();
    }, 300);

  }, 2200);
}