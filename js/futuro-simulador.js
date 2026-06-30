// =========================
// FUTURO FINANCIERO
// Gestiona el cálculo del
// valor futuro de una
// inversión con aportes
// periódicos.
// =========================

// Ejecuta la configuración cuando
// el documento termina de cargarse
document.addEventListener("DOMContentLoaded", () => {
  // Obtiene el botón de cálculo
  const boton = document.getElementById("calc-future");

  // Verifica que el botón exista
  if (!boton) {
    return;
  }

  // Asigna el evento de clic
  boton.addEventListener("click", calcularFuturo);
});

// =========================
// FUNCIONES FINANCIERAS
// Contienen las operaciones
// matemáticas utilizadas
// para calcular el valor
// futuro de una inversión.
// =========================

/**
 * Calcula el valor futuro de una
 * inversión considerando un capital
 * inicial, aportes mensuales y una
 * tasa de interés anual.
 *
 * @param {number} capitalInicial - Capital inicial invertido.
 * @param {number} aporteMensual - Aporte realizado cada mes.
 * @param {number} tasaAnual - Tasa anual de interés.
 * @param {number} años - Tiempo de inversión en años.
 * @returns {number} Valor futuro de la inversión.
 */
function calcularValorFuturo(capitalInicial, aporteMensual, tasaAnual, años) {
  // Convierte la tasa anual
  // en tasa mensual
  const tasaMensual = tasaAnual / 100 / 12;

  // Calcula el número
  // total de meses
  const meses = años * 12;

  // Calcula el crecimiento
  // del capital inicial
  const crecimientoCapital = capitalInicial * Math.pow(1 + tasaMensual, meses);

  // Calcula el crecimiento
  // de los aportes mensuales
  const crecimientoAportes =
    aporteMensual * ((Math.pow(1 + tasaMensual, meses) - 1) / tasaMensual);

  // Devuelve el valor futuro
  return crecimientoCapital + crecimientoAportes;
}

/**
 * Calcula el capital total
 * aportado durante todo
 * el periodo de inversión.
 *
 * @param {number} capitalInicial - Capital inicial.
 * @param {number} aporteMensual - Aporte mensual.
 * @param {number} años - Tiempo en años.
 * @returns {number} Capital invertido.
 */
function calcularCapitalInvertido(capitalInicial, aporteMensual, años) {
  return capitalInicial + aporteMensual * años * 12;
}

/**
 * Calcula la ganancia obtenida
 * mediante los intereses
 * generados por la inversión.
 *
 * @param {number} invertido - Capital aportado.
 * @param {number} total - Valor futuro obtenido.
 * @returns {number} Interés generado.
 */
function calcularInteresGanado(invertido, total) {
  return total - invertido;
}

// =========================
// CONTROLADOR
// Coordina la lectura de
// datos, realiza los
// cálculos y actualiza
// la interfaz.
// =========================

/**
 * Obtiene los datos ingresados,
 * calcula el valor futuro de la
 * inversión y muestra los
 * resultados en pantalla.
 */
function calcularFuturo() {
  // Obtiene los valores
  // ingresados por el usuario
  const capital = obtenerNumero("future-capital");

  const mensual = obtenerNumero("future-monthly");

  const tasa = obtenerNumero("future-rate");

  const años = obtenerNumero("future-years");

  // Verifica que todos los
  // campos sean válidos
  if (!camposValidos(capital, mensual, tasa, años)) {
    alert("Completa todos los campos");
    return;
  }

  // Calcula el valor futuro
  const total = calcularValorFuturo(capital, mensual, tasa, años);

  // Calcula el capital invertido
  const invertido = calcularCapitalInvertido(capital, mensual, años);

  // Calcula el interés generado
  const interes = calcularInteresGanado(invertido, total);

  // Actualiza el título
  // de resultados
  mostrarResultado("future-title", `En ${años} años tendrás:`);

  // Muestra el capital invertido
  mostrarResultado("future-invested", formatearDinero(invertido));

  // Muestra los intereses obtenidos
  mostrarResultado("future-profit", formatearDinero(interes));

  // Muestra el valor futuro total
  mostrarResultado("future-total", formatearDinero(total));

  // Actualiza el gráfico
  // con los resultados obtenidos
  actualizarGraficoGlobal(
    [invertido, interes, total],
    ["Invertido", "Intereses", "Total"],
  );
}
