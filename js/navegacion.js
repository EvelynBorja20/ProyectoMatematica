// =========================
// NAVEGACION MENU
// =========================

// Buscar todos los botones del menú lateral
const links = document.querySelectorAll(".nav-link");

// Recorrer cada botón del menú
links.forEach((link) => {

  // Cuando el usuario haga clic
  link.addEventListener("click", () => {

    // Quitar clase active de todos
    links.forEach((l) => {
      l.classList.remove("active");
    });

    // Poner active solo al botón seleccionado
    link.classList.add("active");
  });
});