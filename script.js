const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTpWDOBhG0TjMrBBi1EYQ8fjdlqTKYOV5PZqlgPrm_Pp8qLE-kcX_QoGPLZTofZ7W1JNYHEpBfLvlLL/pub?output=csv';

// Diccionario de logos (Agrega aquí tus canales)
const logos = {
    "ESPN": "https://upload.wikimedia.org/wikipedia/commons/e/e3/ESPN.svg",
    "Fox Sports": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Fox_Sports_logo.svg"
};

function cargarDatos() {
    Papa.parse(CSV_URL, {
        download: true,
        header: true,
        complete: function(results) {
            procesarEventos(results.data);
        }
    });
}

function procesarEventos(eventos) {
    const ahora = new Date();
    // Aquí el script comparará la hora del sistema con tu hoja y los pondrá en su lugar
    console.log("Eventos leídos:", eventos);
    // (En la siguiente fase conectamos los bloques HTML)
}

cargarDatos();
