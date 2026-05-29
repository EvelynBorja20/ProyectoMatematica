// =========================
// JUEGO
// =========================

// Aquí guardamos en qué pregunta va el jugador
let preguntaActual = 0;

// Aquí guardamos los puntos ganados
let puntaje = 0;


// =========================
// CUANDO CARGA LA PAGINA
// =========================

document.addEventListener("DOMContentLoaded", () => {

  // Si no hay preguntas, no hace nada
  if (!quizPreguntas.length) return;

  // Mostrar primera pregunta
  renderQuiz();

  // Buscar botón siguiente
  const botonNext = document.getElementById("next-question");

  // Cuando se haga clic pasa a otra pregunta
  botonNext.addEventListener("click", siguientePregunta);
});


// =========================
// MOSTRAR PREGUNTA
// =========================

function renderQuiz() {

  // Tomar la pregunta actual
  const pregunta = quizPreguntas[preguntaActual];

  // Mostrar la pregunta en pantalla
  mostrarResultado(
    "quiz-question",
    pregunta.pregunta
  );

  // Buscar botones de respuestas
  const opciones = document.querySelectorAll(".quiz-option");

  // Poner texto y acción en cada botón
  opciones.forEach((boton, index) => {

    // Texto de la opción
    boton.textContent = pregunta.opciones[index];

    // Activar botón
    boton.disabled = false;

    // Revisar respuesta al hacer clic
    boton.onclick = () => verificarRespuesta(index);
  });

  // Mensaje para el jugador
  mostrarResultado(
    "quiz-feedback",
    "Escoge una respuesta"
  );
}


// =========================
// REVISAR RESPUESTA
// =========================

function verificarRespuesta(indice) {

  // Pregunta actual
  const pregunta = quizPreguntas[preguntaActual];

  // Buscar botones
  const opciones = document.querySelectorAll(".quiz-option");

  // Bloquear botones para no repetir respuesta
  opciones.forEach((boton) => {
    boton.disabled = true;
  });

  // Revisar si respondió bien
  if (indice === pregunta.correcta) {

    // Sumar puntos
    puntaje += 10;

    // Mostrar mensaje correcto
    mostrarResultado(
      "quiz-feedback",
      "✅ Correcto. " + pregunta.explicacion
    );

  } else {

    // Mostrar mensaje incorrecto
    mostrarResultado(
      "quiz-feedback",
      "❌ Incorrecto. " + pregunta.explicacion
    );
  }

  // Mostrar puntos actuales
  mostrarResultado(
    "quiz-puntaje",
    puntaje
  );
}


// =========================
// SIGUIENTE PREGUNTA
// =========================

function siguientePregunta() {

  // Ir a siguiente pregunta
  preguntaActual++;

  // Revisar si terminó el quiz
  if (preguntaActual >= quizPreguntas.length) {

    // Mostrar mensaje final
    mostrarResultado(
      "quiz-question",
      "🎉 Quiz terminado"
    );

    mostrarResultado(
      "quiz-feedback",
      "Tu puntaje final es: " + puntaje + " puntos"
    );

    // Desactivar botones
    const opciones = document.querySelectorAll(".quiz-option");

    opciones.forEach((boton) => {
      boton.disabled = true;
      boton.textContent = "-";
    });

    // Desactivar botón siguiente
    document.getElementById("next-question").disabled = true;

    return;
  }

  // Mostrar siguiente pregunta
  renderQuiz();
}