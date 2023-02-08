//Se encarga de Limpiar el HTML para diferentes Consultas
export function limpiarHTML(resultado,grafica) {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }

    while (grafica.firstChild) {
        grafica.removeChild(grafica.firstChild);
    }
}