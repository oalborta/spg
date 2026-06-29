const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTpWDOBhG0TjMrBBi1EYQ8fjdlqTKYOV5PZqlgPrm_Pp8qLE-kcX_QoGPLZTofZ7W1JNYHEpBfLvlLL/pub?output=csv';

const logos = {
    "ESPN": "https://upload.wikimedia.org/wikipedia/commons/e/e3/ESPN.svg",
    "Fox Sports": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Fox_Sports_logo.svg"
    // Agrega aquí otros canales que uses
};

async function cargarDatos() {
    const respuesta = await fetch(CSV_URL);
    const datos = await respuesta.text();
    
    Papa.parse(datos, {
        header: true,
        complete: function(results) {
            clasificarEventos(results.data);
        }
    });
}

function clasificarEventos(eventos) {
    const ahora = new Date();
    const hoyStr = ahora.toISOString().split('T')[0]; // Formato YYYY-MM-DD

    const contenedorAhora = document.querySelector('#ahora .lista');
    const contenedorHoy = document.querySelector('#hoy .lista');
    const contenedorProx = document.querySelector('#proximos .lista');

    eventos.forEach(ev => {
        if (!ev.Evento) return; // Salta filas vacías

        const div = document.createElement('div');
        div.className = 'evento';
        div.innerHTML = `<img src="${logos[ev.Canal] || ''}" class="logo"> 
                         <strong>${ev.Evento}</strong> - ${ev.Hora_Inicio} (${ev.Canal})`;

        // Lógica simple de comparación
        if (ev.Fecha === hoyStr) {
            // Aquí se podría añadir lógica de comparación de hora más precisa
            contenedorHoy.appendChild(div);
        } else if (ev.Fecha > hoyStr) {
            contenedorProx.appendChild(div);
        }
    });
}

cargarDatos();
