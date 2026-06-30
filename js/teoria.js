// =========================
// FUNDAMENTOS INTERACTIVOS
// Controla la visualización
// de los ejemplos teóricos
// de FinanceLab Pro.
// =========================

/**
 * Espera que el documento HTML
 * cargue completamente antes de
 * inicializar los eventos.
 */
document.addEventListener("DOMContentLoaded", () => {
  // Inicializa el ejemplo de Interés Simple
  activarDemo("demo-simple", "demo-simple-box");

  // Inicializa el ejemplo de Interés Compuesto
  activarDemo("demo-compound", "demo-compound-box");

  // Inicializa el ejemplo de Valor Futuro
  activarDemo("demo-future", "demo-future-box");

  // Inicializa el ejemplo de Valor Presente
  activarDemo("demo-present", "demo-present-box");
});

// =========================
// FUNCIÓN REUTILIZABLE
// Gestiona la visualización
// de los ejemplos de cada
// concepto financiero.
// =========================

/**
 * Asocia un botón con una caja de contenido
 * para mostrar u ocultar un ejemplo práctico.
 *
 * @param {string} btnId - Identificador del botón.
 * @param {string} boxId - Identificador de la caja de ejemplo.
 */
function activarDemo(btnId, boxId) {
  // Obtiene el botón correspondiente
  const boton = document.getElementById(btnId);

  // Obtiene la caja donde se muestra el ejemplo
  const caja = document.getElementById(boxId);

  // Verifica que ambos elementos existan
  if (!boton || !caja) return;

  // Asigna el evento de clic al botón
  boton.addEventListener("click", () => {
    // Alterna la visibilidad del ejemplo
    caja.style.display = caja.style.display === "block" ? "none" : "block";
  });
}
