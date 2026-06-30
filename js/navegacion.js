// =========================
// NAVEGACIÓN DEL MENÚ
// Gestiona el cambio del
// enlace activo dentro del
// menú de navegación.
// =========================


// Obtiene todos los enlaces
// del menú principal
const links = document.querySelectorAll(".nav-link");


// Recorre cada enlace para
// asignarle el evento de clic
links.forEach((link) => {

  link.addEventListener("click", () => {

    // Elimina la clase activa
    // de todos los enlaces
    links.forEach((l) => {
      l.classList.remove("active");
    });

    // Activa el enlace seleccionado
    link.classList.add("active");

  });

});


// =========================
// MENÚ HAMBURGUESA
// Controla la apertura y
// cierre del menú en
// dispositivos móviles.
// =========================


// Obtiene el botón del menú
const menuBtn = document.querySelector(".menu-btn");

// Obtiene el contenedor del menú
const navMenu = document.querySelector(".nav-menu");


// Verifica que ambos elementos existan
if (menuBtn && navMenu) {

  // Asigna el evento de clic
  // al botón del menú
  menuBtn.addEventListener("click", () => {

    // Alterna la visibilidad
    // del menú de navegación
    navMenu.classList.toggle("active");

  });

}