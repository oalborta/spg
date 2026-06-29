// Aquí asocias cada canal con su logo
const logosCanales = {
    "ESPN": "url_de_tu_logo_espn.png",
    "Fox Sports": "url_de_tu_logo_fox.png"
    // Agrega aquí tus otros 8 canales
};

// Esta es la parte que "lee" tu Google Sheet (cuando lo publiques como CSV)
const csvUrl = 'TU_URL_DE_GOOGLE_SHEET_PUBLICADO_COMO_CSV';

async function cargarEventos() {
    const respuesta = await fetch(csvUrl);
    const texto = await respuesta.text();
    // Aquí iría la lógica para procesar el CSV y mostrarlo en las cajas (ahora/hoy/proximos)
    console.log("Datos cargados");
}

cargarEventos();
