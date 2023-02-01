
// Definicion de Constantes/Variables

const criptomonedasSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');
const objBusqueda = {
    moneda: '',
    criptomoneda: ''
};

// Promises
const obtenerCriptomonedas = criptomonedas => new Promise( resolve => {
    resolve(criptomonedas);
});

document.addEventListener('DOMContentLoaded', () => {
    consultarCriptomonedas();
    formulario.addEventListener('submit', submitFormulario);
    criptomonedasSelect.addEventListener('change', leerValor);
    monedaSelect.addEventListener('change', leerValor);
});

// Consulta la API par aobtener un listado de Criptomonedas
function consultarCriptomonedas() {
    // Ir  AtoPLISTS Y Despues market capp 
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';
    fetch(url)
        .then( respuesta => respuesta.json()) // Consulta exitosa...
        .then( resultado => obtenerCriptomonedas(resultado.Data)) // 
        .then( criptomonedas  =>  selectCriptomonedas(criptomonedas) )
        .catch( error => console.log(error));
}

// llena el select 
function selectCriptomonedas(criptomonedas) {
    criptomonedas.forEach( cripto => {
        const { FullName, Name } = cripto.CoinInfo;
        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;
        // insertar el HTML
        criptomonedasSelect.appendChild(option);
    });
}

function leerValor(e)  {
    objBusqueda[e.target.name] = e.target.value;
}

//Consulta el Api o manda mensaje en caso de campos vacios
function submitFormulario(e) {
    e.preventDefault();
    // Extraer los valores
    const { moneda, criptomoneda} = objBusqueda;
    if(moneda === '' || criptomoneda === '') {
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
    setTimeout( () => {
        divMensaje.remove();
    }, 1000);
}