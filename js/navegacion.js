// =========================
// NAVEGACION MENU
// =========================

// Buscar links del menú
const links = document.querySelectorAll(".nav-link");

// Active del menú
links.forEach((link) => {

  link.addEventListener("click", () => {

    links.forEach((l) => {
      l.classList.remove("active");
    });

    link.classList.add("active");
  });

});

// =========================
// MENU HAMBURGUESA MOBILE
// =========================

const menuBtn = document.querySelector(".menu-btn");
const navMenu = document.querySelector(".nav-menu");

if (menuBtn && navMenu) {

  menuBtn.addEventListener("click", () => {

    navMenu.classList.toggle("active");

  });

}