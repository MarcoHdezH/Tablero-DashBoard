// Definicion de Constantes/Variables
const criptomonedasSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');
const grafica = document.querySelector('#canvas');
const objBusqueda = {
    moneda: '',
    criptomoneda: ''
};

// Promises
const obtenerCriptomonedas = criptomonedas => new Promise(resolve => {
    resolve(criptomonedas);
});

document.addEventListener('DOMContentLoaded', () => {
    consultarCriptomonedas();
    formulario.addEventListener('submit', submitFormulario);
    criptomonedasSelect.addEventListener('change', leerValor);
    monedaSelect.addEventListener('change', leerValor);
});

// Consulta la API par aobtener un listado de Criptomonedas
async function consultarCriptomonedas() {

    //limit=5; Numero de CrytoMonedas Disponibles

    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=3&tsym=USD';
    // NUEVO: 
    try {
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        const criptomonedas = await obtenerCriptomonedas(resultado.Data);
        selectCriptomonedas(criptomonedas);
    } catch (error) {
        console.log(error);
    }
    // fetch(url)
    //     .then( respuesta => respuesta.json()) // Consulta exitosa...
    //     .then( resultado => obtenerCriptomonedas(resultado.Data)) // 
    //     .then( criptomonedas  =>  selectCriptomonedas(criptomonedas) )
    //     .catch( error => console.log(error));
}

// llena el select 
function selectCriptomonedas(criptomonedas) {
    criptomonedas.forEach(cripto => {
        const { FullName, Name } = cripto.CoinInfo;
        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;
        // insertar el HTML
        criptomonedasSelect.appendChild(option);
    });
}

function leerValor(e) {
    objBusqueda[e.target.name] = e.target.value;
}

//Consulta el Api o manda mensaje en caso de campos vacios
function submitFormulario(e) {
    e.preventDefault();
    // Extraer los valores
    const { moneda, criptomoneda } = objBusqueda;
    if (moneda === '' || criptomoneda === '') {
        mostrarAlerta('Ambos campos son obligatorios');
        return;
    }
    consultarAPI();
}

//Muestra la alerta en el HTML
function mostrarAlerta(mensaje) {
    // Crea el div
    const divMensaje = document.createElement('div');
    divMensaje.classList.add('error');
    // Mensaje de error
    divMensaje.textContent = mensaje;
    // Insertar en el DOM
    formulario.appendChild(divMensaje);
    // Quitar el alert despues de 1 segundo
    setTimeout(() => {
        divMensaje.remove();
    }, 1000);
}

let Moneda;
//Consultar API
function consultarAPI() {
    const { moneda, criptomoneda } = objBusqueda;

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;
    Moneda=moneda;

    mostrarSpinner();

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(cotizacion => {
            mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);
        });
}

//Muestra la Consulta en el HTML
function mostrarCotizacionHTML(cotizacion) {
    limpiarHTML();
    //console.log(cotizacion);
    const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion;

    /*let lowP=LOWDAY;
    let highP=HIGHDAY;

    array1=[];
    array1=lowP.split(" ");
    lowP=array1[1];
    array1=null;
    array1=lowP.split(",");
    lowP=array1[0]+array1[1];
    lowP=parseFloat(lowP);

    array1=null;
    array1=highP.split(" ");
    highP=array1[1];
    array1=null;
    array1=highP.split(",");
    highP=array1[0]+array1[1];
    highP=parseFloat(highP);*/

    fetch(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,USDT&tsyms=${Moneda}`)
    // Exito
    .then(response => response.json())
    .then(comparativa => {
        mostrarGrafica(comparativa);
    });


    const precio = document.createElement('p');

    precio.classList.add('precio');

    precio.innerHTML = `El Precio es: <span> ${PRICE} </span>`;

    const precioAlto = document.createElement('p');
    precioAlto.innerHTML = `<p>Precio más alto del día: <span>${HIGHDAY}</span> </p>`;

    const precioBajo = document.createElement('p');
    precioBajo.innerHTML = `<p>Precio más bajo del día: <span>${LOWDAY}</span> </p>`;

    const ultimasHoras = document.createElement('p');
    ultimasHoras.innerHTML = `<p>Variación últimas 24 horas: <span>${CHANGEPCT24HOUR}%</span></p>`;

    const ultimaActualizacion = document.createElement('p');
    ultimaActualizacion.innerHTML = `<p>Última Actualización: <span>${LASTUPDATE}</span></p>`;

    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(ultimasHoras);
    resultado.appendChild(ultimaActualizacion);

    grafica.classList.add('canvas');

    const canvas = document.createElement('canvas');

    canvas.setAttribute('id', "Grafica");

    grafica.appendChild(canvas);

    formulario.appendChild(resultado);

    //mostrarGrafica(lowP,highP);}
}

//Muestra la Animacion de Carga
function mostrarSpinner() {
    limpiarHTML();

    const spinner = document.createElement('div');
    spinner.classList.add('spinner');

    spinner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>    
    `;
    resultado.appendChild(spinner);
}

//Se encarga de Limpiar el HTML para diferentes Consultas
function limpiarHTML() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }

    while (grafica.firstChild) {
        grafica.removeChild(grafica.firstChild);
    }
}

/*function mostrarGrafica(lowP,highP) {
    const $grafica = document.querySelector("#Grafica");
    // Las etiquetas son las que van en el eje X. 
    const etiquetas = ["Precio Más Bajo", "Precio Más Alto"]
    // Podemos tener varios conjuntos de datos. Comencemos con uno
    const datosVentas2020 = {
        label: "Cotización por Dia",
        data: [lowP,highP], // La data es un arreglo que debe tener la misma cantidad de valores que la cantidad de etiquetas
        backgroundColor: 'rgba(54, 162, 235, 0.2)', // Color de fondo
        borderColor: 'rgba(54, 162, 235, 1)', // Color del borde
        borderWidth: 1,// Ancho del borde
    };
    new Chart($grafica, {
        type: 'bar',// Tipo de gráfica
        data: {
            labels: etiquetas,
            backgroundColor:'white',
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
}*/

function mostrarGrafica(comparativa) {
    console.log(typeof comparativa);
    const{BTC,ETH,USDT}=comparativa;
    let C1,C2,C3,C4,C5;

    console.log(comparativa);
    if(Moneda=='USD'){
        C1 = BTC.USD;
        C2 = ETH.USD;
        C3 = USDT.USD;
    }
    if(Moneda=='MXN'){
        C1 = BTC.MXN;
        C2 = ETH.MXN;
        C3 = USDT.MXN;
    }
    if(Moneda=='COP'){
        C1 = BTC.COP;
        C2 = ETH.COP;
        C3 = USDT.COP;
    }
    if(Moneda=='JPY'){
        C1 = BTC.JPY;
        C2 = ETH.JPY;
        C3 = USDT.JPY;
    }
    if(Moneda=='VES'){
        C1 = BTC.VES;
        C2 = ETH.VES;
        C3 = USDT.VES;
    }
    if(Moneda=='EUR'){
        C1 = BTC.EUR;
        C2 = ETH.EUR;
        C3 = USDT.EUR;
    }
    if(Moneda=='GPB'){
        C1 = BTC.GPB;
        C2 = ETH.GPB;
        C3 = USDT.GPB;
    }
    const $grafica = document.querySelector("#Grafica");
    // Las etiquetas son las que van en el eje X. 
    const etiquetas = ["BitCoin","Etherium","Tether"]
    // Podemos tener varios conjuntos de datos. Comencemos con uno
    const datosVentas2020 = {
        label: "Cotización por Dia",
        data: [C1,C2,C3], // La data es un arreglo que debe tener la misma cantidad de valores que la cantidad de etiquetas
        backgroundColor: 'rgba(54, 162, 235, 0.2)', // Color de fondo
        borderColor: 'rgba(54, 162, 235, 1)', // Color del borde
        borderWidth: 1,// Ancho del borde
    };
    new Chart($grafica, {
        type: 'bar',// Tipo de gráfica
        data: {
            labels: etiquetas,
            backgroundColor:'white',
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