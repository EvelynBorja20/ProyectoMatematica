// =========================
// THEORY.JS
// Fundamentos Interactivos
// FinanceLab Pro
// =========================

// Espera que todo el HTML cargue antes de ejecutar
document.addEventListener("DOMContentLoaded", () => {

  // Activa interacción de Interés Simple
  activarDemo("demo-simple", "demo-simple-box");

  // Activa interacción de Interés Compuesto
  activarDemo("demo-compound", "demo-compound-box");

  // Activa interacción de Valor Futuro
  activarDemo("demo-future", "demo-future-box");

  // Activa interacción de Valor Presente
  activarDemo("demo-present", "demo-present-box");
});

// =========================
// FUNCIÓN REUTILIZABLE
// =========================

// Recibe:
//
// btnId  -> id del botón
// boxId  -> id de la caja oculta
//
// Objetivo:
// Mostrar u ocultar ejemplos teóricos
//
function activarDemo(btnId, boxId) {

  // Busca botón en HTML
  const boton = document.getElementById(btnId);

  // Busca caja de ejemplo
  const caja = document.getElementById(boxId);

  // Seguridad:
  // Si no existen elementos, termina función
  if (!boton || !caja) return;

  // Evento click
  boton.addEventListener("click", () => {

    // Alterna visibilidad
    // Si está visible → oculta
    // Si está oculto → muestra
    caja.style.display =
      caja.style.display === "block"
        ? "none"
        : "block";
  });
}