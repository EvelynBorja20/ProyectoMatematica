// =========================
// NAVEGACIÓN DE CALCULADORAS
// Controla el cambio entre
// las diferentes calculadoras
// y paneles de la aplicación.
// =========================


// Espera a que el documento
// termine de cargarse
document.addEventListener("DOMContentLoaded", () => {

  // Obtiene todos los botones
  // del menú de calculadoras
  const botones = document.querySelectorAll(
    ".calculators-subnav .subnav-item"
  );

  // Agrupa las referencias
  // a los diferentes paneles
  const paneles = {

    simple:
      document.getElementById("simple-panel"),

    compound:
      document.getElementById("compound-panel"),

    future:
      document.getElementById("future-panel"),

    tutor:
      document.getElementById("tutor-panel"),

    chart:
      document.getElementById("chart-panel")

  };

  // Recorre cada botón del menú
  botones.forEach((boton) => {

    // Asigna el evento de clic
    boton.addEventListener("click", () => {

      // Elimina la clase activa
      // de todos los botones
      botones.forEach((b) => {

        b.classList.remove("active");

      });

      // Activa el botón seleccionado
      boton.classList.add("active");

      // Oculta todos los paneles
      Object.values(paneles).forEach((panel) => {

        if (panel) {

          panel.style.display = "none";

        }

      });

      // Obtiene el tipo de
      // calculadora seleccionado
      const tipo = boton.dataset.calc;

      // Muestra únicamente
      // el panel correspondiente
      if (paneles[tipo]) {

        paneles[tipo].style.display = "block";

      }

    });

  });

  // Muestra la calculadora
  // de interés simple al iniciar
  paneles.simple.style.display = "block";

});