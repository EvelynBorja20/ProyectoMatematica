// =========================
// CALCULADORA DE INTERÉS
// COMPUESTO
// Implementa el cálculo del
// interés compuesto mediante
// una estructura basada
// en objetos.
// =========================

/**
 * Objeto que encapsula la lógica
 * de la calculadora de interés
 * compuesto, incluyendo la
 * inicialización de elementos y
 * el procesamiento del cálculo.
 */
const CalculadoraInteresCompuesto = {
  // Referencias a los campos
  // de entrada del formulario
  inputs: {},

  // Referencias a los elementos
  // donde se muestran los resultados
  salidas: {},

  /**
   * Inicializa la calculadora,
   * obtiene los elementos del DOM
   * y registra los eventos.
   */
  inicializar() {
    // Obtiene los campos
    // de entrada
    this.inputs = {
      capital: document.getElementById("compound-capital"),
      tasa: document.getElementById("compound-rate"),
      tiempo: document.getElementById("compound-time"),
    };

    // Obtiene los elementos
    // donde se mostrarán los resultados
    this.salidas = {
      boton: document.getElementById("calc-compound"),
      interes: document.getElementById("compound-interest-result"),
      total: document.getElementById("compound-total-result"),
    };

    // Verifica que el botón exista
    // antes de registrar el evento
    if (this.salidas.boton) {
      this.salidas.boton.addEventListener("click", () =>
        this.procesarCalculo(),
      );
    }
  },

  /**
   * Calcula el interés compuesto
   * y el monto total utilizando
   * los datos ingresados por
   * el usuario.
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
      alert(
        "Por favor, ingresa números válidos y mayores a cero en todos los campos.",
      );

      return;
    }

    // Convierte la tasa
    // de porcentaje a decimal
    const r = rAnual / 100;

    // Calcula el monto total
    // aplicando interés compuesto
    const montoTotal = P * Math.pow(1 + r, t);

    // Calcula el interés generado
    const interesGenerado = montoTotal - P;

    // Configura el formato
    // de presentación en moneda
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
  CalculadoraInteresCompuesto.inicializar();
});
