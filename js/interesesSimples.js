// Agrupamos la calculadora en un objeto utilizando llaves { }
const CalculadoraFinanciera = {
  
  inputs: {},
  salidas: {},

  // Método para inicializar la calculadora
  inicializar() {
    // Asignamos las referencias del HTML usando llaves para estructurar
    this.inputs = {
      capital: document.getElementById("capital"),
      tasa: document.getElementById("rate"),
      tiempo: document.getElementById("time")
    };

    this.salidas = {
      boton: document.getElementById("calc-simple"),
      interes: document.getElementById("interest-result"),
      total: document.getElementById("total-result")
    };

    // Escuchar el evento click
    this.salidas.boton.addEventListener("click", () => this.procesarCalculo());
  },

  // Método para realizar la operación matemática
  procesarCalculo() {
    // Extracción de valores de los inputs
    const P = parseFloat(this.inputs.capital.value);  // Capital inicial
    const rAnual = parseFloat(this.inputs.tasa.value); // Tasa de interés (%)
    const t = parseFloat(this.inputs.tiempo.value);    // Tiempo en años

    // Validación de datos
    if (isNaN(P) || isNaN(rAnual) || isNaN(t) || P <= 0 || rAnual < 0 || t <= 0) {
      alert("Por favor, ingresa valores válidos y mayores a cero.");
      return;
    }

    // Fórmulas de Interés Simple
    const r = rAnual / 100;
    const interesGenerado = P * r * t; // I = P * r * t
    const montoTotal = P + interesGenerado;  // A = P + I

    // Opciones de formato de moneda con llaves { }
    const formatoMoneda = {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    };

    // Renderizar resultados en el HTML
    this.salidas.interes.textContent = interesGenerado.toLocaleString("es-MX", formatoMoneda);
    this.salidas.total.textContent = montoTotal.toLocaleString("es-MX", formatoMoneda);
  }
};


document.addEventListener("DOMContentLoaded", () => {
  CalculadoraFinanciera.inicializar();
});