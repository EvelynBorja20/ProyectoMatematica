// =========================
// TUTOR IA
// Controla el funcionamiento
// del asistente educativo de
// la plataforma.
// =========================

/**
 * Espera a que el documento cargue
 * completamente antes de inicializar
 * los eventos del tutor.
 */
document.addEventListener("DOMContentLoaded", () => {
  // Obtiene el botón para enviar preguntas
  const boton = document.getElementById("ask-tutor");

  // Si el botón no existe, finaliza la ejecución
  if (!boton) return;

  // Asigna el evento de clic al botón
  boton.addEventListener("click", responderTutor);
});

// =========================
// BASE DE CONOCIMIENTO
// Contiene las respuestas
// educativas del tutor.
// =========================

/**
 * Busca una respuesta relacionada
 * con la pregunta ingresada por el usuario.
 *
 * @param {string} pregunta - Texto escrito por el usuario.
 * @returns {string} Respuesta correspondiente al tema consultado.
 */
function buscarRespuesta(pregunta) {
  // Convierte el texto a minúsculas
  // para facilitar las comparaciones
  const texto = pregunta.toLowerCase();

  // Tema: Interés compuesto
  if (
    texto.includes("interés compuesto") ||
    texto.includes("interes compuesto")
  ) {
    return "El interés compuesto reinvierte los intereses generados, permitiendo que el dinero crezca más rápido con el tiempo.";
  }

  // Tema: Interés simple
  if (texto.includes("interés simple") || texto.includes("interes simple")) {
    return "El interés simple se calcula únicamente sobre el capital inicial y no reinvierte ganancias.";
  }

  // Tema: Tasa de interés
  if (texto.includes("tasa")) {
    return "La tasa representa el porcentaje de crecimiento o costo del dinero durante un periodo determinado.";
  }

  // Tema: Capital
  if (texto.includes("capital")) {
    return "El capital es la cantidad inicial de dinero que se invierte o presta.";
  }

  // Tema: Valor futuro
  if (texto.includes("valor futuro")) {
    return "El valor futuro es el monto que tendrá una inversión después de aplicar intereses y tiempo.";
  }

  // Respuesta por defecto cuando no existe coincidencia
  return "Todavía estoy aprendiendo esa pregunta. Intenta preguntar sobre interés simple, compuesto, tasa o capital.";
}

// =========================
// RESPUESTA DEL TUTOR
// Procesa la consulta del
// usuario y muestra la
// respuesta correspondiente.
// =========================

/**
 * Lee la pregunta del usuario,
 * obtiene la respuesta desde la base
 * de conocimiento y la muestra
 * en la interfaz.
 */
function responderTutor() {
  // Obtiene la pregunta escrita por el usuario
  const pregunta = document.getElementById("tutor-question").value.trim();

  // Verifica que exista una pregunta
  if (!pregunta) {
    // Muestra un mensaje solicitando ingresar texto
    mostrarResultado("tutor-answer", "Escribe una pregunta.");

    return;
  }

  // Busca la respuesta adecuada
  const respuesta = buscarRespuesta(pregunta);

  // Presenta la respuesta en pantalla
  mostrarResultado("tutor-answer", respuesta);
}
