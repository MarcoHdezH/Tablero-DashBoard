import {mostrarGrafica} from "./grafica.js";
import {limpiarHTML} from "./limpiador.js";

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
    limpiarHTML(resultado,grafica);

    const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion;

    fetch(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,USDT&tsyms=${Moneda}`)
    // Exito
    .then(response => response.json())
    .then(comparativa => {
        mostrarGrafica(comparativa,Moneda);
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
    limpiarHTML(resultado,grafica);

    const spinner = document.createElement('div');
    spinner.classList.add('spinner');

    spinner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>    
    `;
    resultado.appendChild(spinner);
}