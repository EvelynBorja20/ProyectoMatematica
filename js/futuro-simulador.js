// =========================
// FUTURO FINANCIERO
// =========================

document.addEventListener("DOMContentLoaded", () => {
  const boton = document.getElementById("calc-future");

  if (!boton) return;

  boton.addEventListener("click", calcularFuturo);
});

// =========================
// FUNCIONES FINANCIERAS
// =========================

// Valor futuro con aportes mensuales

function calcularValorFuturo(capitalInicial, aporteMensual, tasaAnual, años) {
  const tasaMensual = tasaAnual / 100 / 12;

  const meses = años * 12;

  const crecimientoCapital = capitalInicial * Math.pow(1 + tasaMensual, meses);

  const crecimientoAportes =
    aporteMensual * ((Math.pow(1 + tasaMensual, meses) - 1) / tasaMensual);

  return crecimientoCapital + crecimientoAportes;
}

function calcularCapitalInvertido(capitalInicial, aporteMensual, años) {
  return capitalInicial + aporteMensual * años * 12;
}

function calcularInteresGanado(invertido, total) {
  return total - invertido;
}

// =========================
// CONTROLADOR
// =========================

function calcularFuturo() {
  const capital = obtenerNumero("future-capital");

  const mensual = obtenerNumero("future-monthly");

  const tasa = obtenerNumero("future-rate");

  const años = obtenerNumero("future-years");

  if (!camposValidos(capital, mensual, tasa, años)) {
    alert("Completa todos los campos");
    return;
  }

  const total = calcularValorFuturo(capital, mensual, tasa, años);

  const invertido = calcularCapitalInvertido(capital, mensual, años);

  const interes = calcularInteresGanado(invertido, total);

  // TITULO DINAMICO

  mostrarResultado("future-title", `En ${años} años tendrás:`);

  mostrarResultado("future-invested", formatearDinero(invertido));

  mostrarResultado("future-profit", formatearDinero(interes));

  mostrarResultado("future-total", formatearDinero(total));

  // GRAFICO GLOBAL

  actualizarGraficoGlobal(
    [invertido, interes, total],
    ["Invertido", "Intereses", "Total"],
  );
}
