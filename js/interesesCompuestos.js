// Agrupamos la calculadora de interés compuesto en un objeto utilizando llaves { }
const CalculadoraInteresCompuesto = {
  // Elementos del DOM organizados
  inputs: {},
  salidas : {},

  // Método para inicializar y capturar los elementos del HTML
  inicializar() {
    this.inputs = {
      capital: document.getElementById("compound-capital"),
      tasa: document.getElementById("compound-rate"),
      tiempo: document.getElementById("compound-time")
    };

    this.salidas = {
      boton: document.getElementById("calc-compound"),
      interes: document.getElementById("compound-interest-result"),
      total: document.getElementById("compound-total-result")
    };

    // Validamos que el botón exista en la página antes de asignarle el evento
    if (this.salidas.boton) {
      this.salidas.boton.addEventListener("click", () => this.procesarCalculo());
    }
  },

  // Método principal para realizar la operación matemática exponencial
  procesarCalculo() {
    // Extraemos y convertimos los valores de los inputs
    const P = parseFloat(this.inputs.capital.value);   // Capital Inicial
    const rAnual = parseFloat(this.inputs.tasa.value);  // Tasa de interés anual (%)
    const t = parseFloat(this.inputs.tiempo.value);     // Tiempo en años

    // Validación de seguridad
    if (isNaN(P) || isNaN(rAnual) || isNaN(t) || P <= 0 || rAnual < 0 || t <= 0) {
      alert("Por favor, ingresa números válidos y mayores a cero en todos los campos.");
      return;
    }

    // FÓRMULA MATEMÁTICA DEL INTERÉS COMPUESTO
    // 1. Convertimos el porcentaje de la tasa a decimal (ej: 5% -> 0.05)
    const r = rAnual / 100;

    // 2. Calculamos el Monto Total (A) usando la fórmula: A = P * (1 + r)^t
    const montoTotal = P * Math.pow((1 + r), t);

    // 3. El interés generado es la diferencia: I = Monto Total - Capital Inicial
    const interesGenerado = montoTotal - P;

    // Configuración para dar formato de dinero profesional ($0.00)
    const formatoMoneda = {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    };

    // Renderizamos los resultados en las etiquetas del HTML
    this.salidas.interes.textContent = interesGenerado.toLocaleString("es-MX", formatoMoneda);
    this.salidas.total.textContent = montoTotal.toLocaleString("es-MX", formatoMoneda);
  }
};

// Aseguramos que el script se ejecute cuando el HTML esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {
  CalculadoraInteresCompuesto.inicializar();
});