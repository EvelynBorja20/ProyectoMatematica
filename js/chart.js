// =========================
// GRÁFICO GLOBAL
// =========================

let financeChart = null;

function actualizarGraficoGlobal(datos, labels) {

    document.getElementById("metric-capital").textContent =
        formatearDinero(datos[0]);

    document.getElementById("metric-interest").textContent =
        formatearDinero(datos[1]);

    document.getElementById("metric-total").textContent =
        formatearDinero(datos[2]);

    const canvas = document.getElementById("financeChart");

    if (!canvas) {
        return;
    }

    // Destruir gráfico anterior
    if (financeChart instanceof Chart) {
        financeChart.destroy();
    }

    financeChart = new Chart(canvas, {

        type: "bar",

        data: {

            labels: labels,

            datasets: [{
                label: "Dinero ($)",
                data: datos,

                backgroundColor: [
                    "#0F4C81",
                    "#2ECC71",
                    "#F39C12"
                ],

                borderRadius: 10

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {
                    display: false
                }

            },

            scales: {

                y: {
                    beginAtZero: true
                }

            }

        }

    });

}