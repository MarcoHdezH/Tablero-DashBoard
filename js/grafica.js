export function mostrarGrafica(comparativa,Moneda) {
    const { BTC, ETH, USDT } = comparativa;
    let C1, C2, C3, C4, C5;

    if (Moneda == 'USD') {
        C1 = BTC.USD;
        C2 = ETH.USD;
        C3 = USDT.USD;
    }
    if (Moneda == 'MXN') {
        C1 = BTC.MXN;
        C2 = ETH.MXN;
        C3 = USDT.MXN;
    }
    if (Moneda == 'COP') {
        C1 = BTC.COP;
        C2 = ETH.COP;
        C3 = USDT.COP;
    }
    if (Moneda == 'JPY') {
        C1 = BTC.JPY;
        C2 = ETH.JPY;
        C3 = USDT.JPY;
    }
    if (Moneda == 'VES') {
        C1 = BTC.VES;
        C2 = ETH.VES;
        C3 = USDT.VES;
    }
    if (Moneda == 'EUR') {
        C1 = BTC.EUR;
        C2 = ETH.EUR;
        C3 = USDT.EUR;
    }
    if (Moneda == 'GPB') {
        C1 = BTC.GPB;
        C2 = ETH.GPB;
        C3 = USDT.GPB;
    }
    const $grafica = document.querySelector("#Grafica");
    // Las etiquetas son las que van en el eje X. 
    const etiquetas = ["BitCoin", "Etherium", "Tether"]
    // Podemos tener varios conjuntos de datos. Comencemos con uno
    const datosVentas2020 = {
        label: "Cotización por Dia",
        data: [C1, C2, C3], // La data es un arreglo que debe tener la misma cantidad de valores que la cantidad de etiquetas
        backgroundColor: 'rgba(54, 162, 235, 0.2)', // Color de fondo
        borderColor: 'rgba(54, 162, 235, 1)', // Color del borde
        borderWidth: 1,// Ancho del borde
    };
    new Chart($grafica, {
        type: 'bar',// Tipo de gráfica
        data: {
            labels: etiquetas,
            backgroundColor: 'white',
            datasets: [
                datosVentas2020,
                // Aquí más datos...
            ]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }],
            },
        }
    });
}