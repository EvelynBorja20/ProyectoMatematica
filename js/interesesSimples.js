// =========================
// CALCULADORA FINANCIERA
// Implementa el cálculo del
// interés simple mediante
// una estructura basada
// en objetos.
// =========================

/**
 * Objeto que encapsula la lógica
 * de la calculadora de interés simple,
 * incluyendo la inicialización de
 * elementos y el procesamiento
 * de los cálculos.
 */
const CalculadoraFinanciera = {
  // Referencias a los campos
  // de entrada del formulario
  inputs: {},

  // Referencias a los elementos
  // donde se muestran los resultados
  salidas: {},

  /**
   * Inicializa la calculadora
   * obteniendo los elementos del DOM
   * y registrando los eventos necesarios.
   */
  inicializar() {
    // Obtiene los campos
    // de entrada del formulario
    this.inputs = {
      capital: document.getElementById("capital"),
      tasa: document.getElementById("rate"),
      tiempo: document.getElementById("time"),
    };

    // Obtiene los elementos
    // donde se mostrarán los resultados
    this.salidas = {
      boton: document.getElementById("calc-simple"),
      interes: document.getElementById("interest-result"),
      total: document.getElementById("total-result"),
    };

    // Asigna el evento de clic
    // al botón de cálculo
    this.salidas.boton.addEventListener("click", () => this.procesarCalculo());
  },

  /**
   * Calcula el interés simple y
   * el monto total a partir de los
   * datos ingresados por el usuario.
   */
  procesarCalculo() {
    // Obtiene los valores ingresados
    const P = parseFloat(this.inputs.capital.value);
    const rAnual = parseFloat(this.inputs.tasa.value);
    const t = parseFloat(this.inputs.tiempo.value);

    // Verifica que los datos
    // sean válidos
    if (
      isNaN(P) ||
      isNaN(rAnual) ||
      isNaN(t) ||
      P <= 0 ||
      rAnual < 0 ||
      t <= 0
    ) {
      alert("Por favor, ingresa valores válidos y mayores a cero.");

      return;
    }

    // Convierte la tasa
    // de porcentaje a decimal
    const r = rAnual / 100;

    // Calcula el interés simple
    const interesGenerado = P * r * t;

    // Calcula el monto total
    const montoTotal = P + interesGenerado;

    // Configura el formato
    // para mostrar moneda
    const formatoMoneda = {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    };

    // Muestra el interés generado
    this.salidas.interes.textContent = interesGenerado.toLocaleString(
      "es-MX",
      formatoMoneda,
    );

    // Muestra el monto total
    this.salidas.total.textContent = montoTotal.toLocaleString(
      "es-MX",
      formatoMoneda,
    );
    // =========================
    // ACTUALIZAR CENTRO ANALÍTICO
    // =========================

    actualizarGraficoGlobal(
      [P, interesGenerado, montoTotal],
      ["Capital", "Intereses", "Monto Total"],
    );
  },
};

// =========================
// INICIALIZACIÓN
// Ejecuta la configuración
// de la calculadora cuando
// el documento termina
// de cargarse.
// =========================

document.addEventListener("DOMContentLoaded", () => {
  // Inicializa la calculadora
  CalculadoraFinanciera.inicializar();
});
