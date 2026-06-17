document.addEventListener("DOMContentLoaded", () => {

    const botones = document.querySelectorAll(
        ".calculators-subnav .subnav-item"
    );

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

    botones.forEach((boton) => {

        boton.addEventListener("click", () => {

            botones.forEach((b) =>
                b.classList.remove("active")
            );

            boton.classList.add("active");

            Object.values(paneles).forEach((panel) => {

                if(panel){
                    panel.style.display = "none";
                }

            });

            const tipo = boton.dataset.calc;

            if(paneles[tipo]){
                paneles[tipo].style.display = "block";
            }

        });

    });

    paneles.simple.style.display = "block";

});