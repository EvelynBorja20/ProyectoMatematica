// =========================
// PREGUNTAS DEL QUIZ
// =========================

// Aquí guardamos todas las preguntas del juego
// Cada pregunta tiene:
// - la pregunta
// - las opciones
// - la respuesta correcta
// - una explicación

const quizPreguntas = [

  // =========================
  // PREGUNTA 1
  // =========================
  {
    // Pregunta que verá el jugador
    pregunta:
      "¿Qué ocurre en el interés compuesto?",

    // Opciones para escoger
    opciones: [
      "Solo crece el capital inicial",
      "Los intereses generan nuevos intereses",
      "No existe ganancia",
      "El tiempo no influye"
    ],

    // Respuesta correcta
    // Empieza desde 0:
    // 0 = primera opción
    // 1 = segunda opción
    // 2 = tercera opción
    // 3 = cuarta opción
    correcta: 1,

    // Explicación que aparece después de responder
    explicacion:
      "En el interés compuesto los intereses se reinvierten y generan nuevas ganancias."
  },

  // =========================
  // PREGUNTA 2
  // =========================
  {
    // Pregunta del jugador
    pregunta:
      "¿Qué representa la tasa de interés?",

    // Opciones
    opciones: [
      "El tiempo",
      "El capital inicial",
      "El porcentaje de crecimiento o costo del dinero",
      "La ganancia final"
    ],

    // Respuesta correcta
    correcta: 2,

    // Explicación
    explicacion:
      "La tasa indica el porcentaje aplicado al dinero durante un periodo."
  },

  // =========================
  // PREGUNTA 3
  // =========================
  {
    // Pregunta
    pregunta:
      "¿Qué es el capital en matemática financiera?",

    // Respuestas posibles
    opciones: [
      "Dinero inicial invertido o prestado",
      "Ganancia acumulada",
      "Interés generado",
      "Tiempo de inversión"
    ],

    // Opción correcta
    correcta: 0,

    // Explicación para aprender
    explicacion:
      "El capital es la cantidad inicial utilizada para invertir o prestar."
  },

  // =========================
  // PREGUNTA 4
  // =========================
  {
    // Pregunta final
    pregunta:
      "¿Qué calcula el valor futuro?",

    // Opciones
    opciones: [
      "El dinero inicial",
      "El monto después del crecimiento financiero",
      "Solo intereses",
      "La deuda pendiente"
    ],

    // Respuesta correcta
    correcta: 1,

    // Explicación
    explicacion:
      "El valor futuro representa cuánto dinero tendrás después del tiempo e intereses."
  }
];