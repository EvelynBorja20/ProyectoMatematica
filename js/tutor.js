// =========================
// TUTOR IA
// =========================

// Cuando la página termina de cargar
document.addEventListener("DOMContentLoaded", () => {

  // Buscar el botón Preguntar
  const boton = document.getElementById("ask-tutor");

  // Si no existe el botón, detener código
  if (!boton) return;

  // Cuando se haga clic, responder pregunta
  boton.addEventListener("click", responderTutor);
});


// =========================
// BASE EDUCATIVA
// =========================

// Esta función busca una respuesta
// según lo que escriba el usuario
function buscarRespuesta(pregunta) {

  // Convertir texto a minúsculas
  // para evitar errores al comparar
  const texto = pregunta.toLowerCase();

  // Buscar tema interés compuesto
  if (
    texto.includes("interés compuesto") ||
    texto.includes("interes compuesto")
  ) {
    return "El interés compuesto reinvierte los intereses generados, permitiendo que el dinero crezca más rápido con el tiempo.";
  }

  // Buscar interés simple
  if (
    texto.includes("interés simple") ||
    texto.includes("interes simple")
  ) {
    return "El interés simple se calcula únicamente sobre el capital inicial y no reinvierte ganancias.";
  }

  // Buscar tasa
  if (texto.includes("tasa")) {
    return "La tasa representa el porcentaje de crecimiento o costo del dinero durante un periodo determinado.";
  }

  // Buscar capital
  if (texto.includes("capital")) {
    return "El capital es la cantidad inicial de dinero que se invierte o presta.";
  }

  // Buscar valor futuro
  if (texto.includes("valor futuro")) {
    return "El valor futuro es el monto que tendrá una inversión después de aplicar intereses y tiempo.";
  }

  // Respuesta si no encuentra tema
  return "Todavía estoy aprendiendo esa pregunta. Intenta preguntar sobre interés simple, compuesto, tasa o capital.";
}


// =========================
// RESPONDER PREGUNTA
// =========================

// Función principal del tutor
function responderTutor() {

  // Leer lo que escribió el usuario
  const pregunta =
    document.getElementById("tutor-question")
    .value
    .trim();

  // Si no escribió nada
  if (!pregunta) {

    // Mostrar aviso
    mostrarResultado(
      "tutor-answer",
      "Escribe una pregunta."
    );

    return;
  }

  // Buscar respuesta
  const respuesta =
    buscarRespuesta(pregunta);

  // Mostrar respuesta en pantalla
  mostrarResultado(
    "tutor-answer",
    respuesta
  );
}